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
import { likeRecipeRateLimit, newRecipeRateLimit } from "@/lib/rate-limit";
import { PutBlobResult, put } from "@vercel/blob";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const MAX_FILE_SIZE = 400000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const SubmitRecipeSchema = z.object({
  title: z.string().min(3).max(80).trim(),
  cuisine: z.string().min(3).max(80).trim(),
  category: z.string().min(3).max(80).trim(),
  prepTime: z.coerce.number(),
  ingredients: z.string().max(5000).trim(),
  procedure: z.string().max(5000).trim(),
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

  redirect(`/recipes/${id.replace(/^recipe_/, "")}`);
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

  revalidatePath(`/recipes/${recipeId.replace(/^recipe_/, "")}`);
}
