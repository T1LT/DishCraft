"use server";

import z from "zod";
import {
  db,
  recipesTable,
  genRecipeId,
  usersTable,
  likesTable,
  genLikeId,
} from "@/app/db";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import {
  deleteRecipeRateLimit,
  likeRecipeRateLimit,
  newRecipeRateLimit,
  updateRecipeRateLimit,
} from "@/lib/rate-limit";
import { PutBlobResult, put } from "@vercel/blob";
import { desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const MAX_FILE_SIZE = 4096000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const SubmitRecipeSchema = z.object({
  title: z
    .string()
    .min(3, "Title is required. 3 characters minimum.")
    .max(80, "Title has a maximum of 80 characters.")
    .trim(),
  cuisine: z
    .string()
    .min(3, "Cuisine is required. 3 characters minimum.")
    .max(80, "Cuisine has a maximum of 80 characters.")
    .trim(),
  category: z
    .string()
    .min(3, "Category is required. 3 characters minimum.")
    .max(80, "Category has a maximum of 80 characters.")
    .trim(),
  prepTime: z.coerce.number().min(0, "Prep Time cannot be negative."),
  ingredients: z
    .string()
    .min(3, "Ingredients are required. 3 characters minimum.")
    .max(5000, "Ingredients have a maximum of 5000 characters.")
    .trim(),
  procedure: z
    .string()
    .min(3, "Procedure is required. 3 characters minimum.")
    .max(5000, "Procedure has a maximum of 5000 characters.")
    .trim(),
  image: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max file size is 4MB.`)
    .refine(
      (file) => !file.size || ACCEPTED_IMAGE_TYPES.includes(file?.type),
      ".jpg, .jpeg, .png and .webp files are accepted.",
    )
    .optional(),
});

export type SubmitRecipeData = {
  error?:
    | {
        code: "INTERNAL_ERROR";
        message: string;
      }
    | {
        code: "AUTH_ERROR";
        message: string;
      }
    | {
        code: "VALIDATION_ERROR";
        fieldErrors: {
          [field: string]: string[];
        };
      };
};

export async function submitRecipe(
  _prevState: any,
  formData: FormData,
): Promise<SubmitRecipeData | void> {
  const session = await auth();

  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  const user = (
    await db
      .select({
        id: usersTable.id,
        username: usersTable.username,
      })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
  )[0];

  const input = SubmitRecipeSchema.safeParse({
    title: formData.get("title"),
    cuisine: formData.get("cuisine"),
    category: formData.get("category"),
    prepTime: formData.get("prepTime"),
    ingredients: formData.get("ingredients"),
    procedure: formData.get("procedure"),
    image: formData.get("image"),
  });

  if (!input.success) {
    const { fieldErrors } = input.error.flatten();
    return {
      error: {
        code: "VALIDATION_ERROR",
        fieldErrors,
      },
    };
  }

  const rl = await newRecipeRateLimit.limit(userId);

  if (!rl.success) {
    return {
      error: {
        code: "AUTH_ERROR",
        message: "Too many attempts. Try again later.",
      },
    };
  }

  const id = genRecipeId();

  try {
    const file = input.data.image;

    let blob: PutBlobResult | undefined;

    if (file.size) {
      blob = await put(file.name, file, {
        access: "public",
      });
    }

    await db.insert(recipesTable).values({
      id,
      title: input.data.title as string,
      cuisine: input.data.cuisine as string,
      category: input.data.category as string,
      prepTime: input.data.prepTime as number,
      ingredients: input.data.ingredients as string,
      procedure: input.data.procedure as string,
      image_url: blob ? (blob.url as string) : null,
      likes: 0,
      submitted_by: userId,
      username: user.username,
    });
  } catch (err) {
    console.error(err);
    return {
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to add recipe. Please try again later.",
      },
    };
  }

  redirect(`/${id.replace("_", "/")}`);
}

export async function changeLike(
  recipeId: string,
  likes: number,
  userLiked: boolean,
) {
  const session = await auth();

  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  const rl = await likeRecipeRateLimit.limit(userId);

  if (!rl.success) {
    return {
      error: {
        code: "AUTH_ERROR",
        message: "Too many attempts. Try again later.",
      },
    };
  }

  try {
    if (!userLiked) {
      const id = genLikeId();

      // add entry to likes table
      await db
        .insert(likesTable)
        .values({ id, recipe_id: recipeId, user_id: userId });

      // update recipe likes field
      await db
        .update(recipesTable)
        .set({ likes: likes + 1 })
        .where(eq(recipesTable.id, recipeId));
    } else {
      // remove entry from likes table
      await db
        .delete(likesTable)
        .where(sql`user_id = ${userId} AND recipe_id = ${recipeId}`);

      // update recipe likes field
      await db
        .update(recipesTable)
        .set({ likes: likes - 1 })
        .where(eq(recipesTable.id, recipeId));
    }
  } catch (err) {
    console.error(err);
    return {
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to like/unlike recipe. Please try again later.",
      },
    };
  }

  revalidatePath(`/${recipeId.replace("_", "/")}`);
}

export async function getRecipes(filter: "all" | "popular") {
  if (filter === "all") {
    const recipes = await db
      .select({
        id: recipesTable.id,
        title: recipesTable.title,
        cuisine: recipesTable.cuisine,
        category: recipesTable.category,
        username: recipesTable.username,
        prepTime: recipesTable.prepTime,
        image_url: recipesTable.image_url,
        likes: recipesTable.likes,
      })
      .from(recipesTable)
      .orderBy(desc(recipesTable.created_at));
    return recipes;
  } else if (filter === "popular") {
    const popularRecipes = await db
      .select({
        id: recipesTable.id,
        title: recipesTable.title,
        cuisine: recipesTable.cuisine,
        category: recipesTable.category,
        username: recipesTable.username,
        prepTime: recipesTable.prepTime,
        image_url: recipesTable.image_url,
        likes: recipesTable.likes,
      })
      .from(recipesTable)
      .orderBy(desc(recipesTable.likes));
    return popularRecipes;
  }
}

export async function getRecipe(id: string) {
  const recipeId = `recipe_${id}`;
  return (
    await db
      .select()
      .from(recipesTable)
      .where(sql`id = ${recipeId}`)
  )[0];
}

export async function deleteRecipe(recipeId: string, submittedBy: string) {
  const session = await auth();

  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  if (userId !== submittedBy) {
    return {
      error: {
        code: "AUTH_ERROR",
        message: "You are not authorized to delete this recipe.",
      },
    };
  }

  const rl = await deleteRecipeRateLimit.limit(userId);

  if (!rl.success) {
    return {
      error: {
        code: "AUTH_ERROR",
        message: "Too many attempts. Try again later.",
      },
    };
  }

  try {
    await db.delete(recipesTable).where(eq(recipesTable.id, recipeId));
  } catch (err) {
    console.error(err);
    return {
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to delete recipe. Please try again later.",
      },
    };
  }

  revalidatePath("/");
  redirect("/");
}

export async function editRecipe(
  recipeId: string,
  submittedBy: string | null,
  _prevState: any,
  formData: FormData,
): Promise<SubmitRecipeData | void> {
  const session = await auth();

  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  if (userId !== submittedBy) {
    return {
      error: {
        code: "AUTH_ERROR",
        message: "You are not authorized to delete this recipe.",
      },
    };
  }

  const input = SubmitRecipeSchema.safeParse({
    title: formData.get("title"),
    cuisine: formData.get("cuisine"),
    category: formData.get("category"),
    prepTime: formData.get("prepTime"),
    ingredients: formData.get("ingredients"),
    procedure: formData.get("procedure"),
    image: formData.get("image"),
  });

  if (!input.success) {
    const { fieldErrors } = input.error.flatten();
    return {
      error: {
        code: "VALIDATION_ERROR",
        fieldErrors,
      },
    };
  }

  const rl = await updateRecipeRateLimit.limit(userId);

  if (!rl.success) {
    return {
      error: {
        code: "AUTH_ERROR",
        message: "Too many attempts. Try again later.",
      },
    };
  }

  const prevImageURL = (
    await db
      .select({ image_url: recipesTable.image_url })
      .from(recipesTable)
      .where(eq(recipesTable.id, recipeId))
  )[0].image_url;

  try {
    const file = input.data.image;

    let blob: PutBlobResult | undefined;

    if (file.size) {
      blob = await put(file.name, file, {
        access: "public",
      });
    }

    await db
      .update(recipesTable)
      .set({
        title: input.data.title as string,
        cuisine: input.data.cuisine as string,
        category: input.data.category as string,
        prepTime: input.data.prepTime as number,
        ingredients: input.data.ingredients as string,
        procedure: input.data.procedure as string,
        image_url: blob ? (blob.url as string) : (prevImageURL as string),
      })
      .where(eq(recipesTable.id, recipeId));
  } catch (err) {
    console.error(err);
    return {
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to update recipe. Please try again later.",
      },
    };
  }

  revalidatePath(`/${recipeId.replace("_", "/")}`);
  redirect(`/${recipeId.replace("_", "/")}`);
}
