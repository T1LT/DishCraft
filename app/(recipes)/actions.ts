"use server";

import z from "zod";
import { db, recipesTable, genRecipeId } from "@/app/db";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { newRecipeRateLimit } from "@/lib/rate-limit";
import { put } from "@vercel/blob";

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
  prepTime: z.number(),
  ingredients: z.string().max(5000).trim(),
  procedure: z.string().max(5000).trim(),
  image: z
    .any()
    .refine((files) => files?.length == 1, "Image is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 4MB.`,
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted.",
    ),
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

    const blob = await put(file.name, file, {
      access: "public",
    });

    await db.insert(recipesTable).values({
      id,
      title: input.data.title as string,
      cuisine: input.data.cuisine as string,
      category: input.data.category as string,
      prepTime: input.data.prepTime as number,
      ingredients: input.data.ingredients as string,
      procedure: input.data.procedure as string,
      image_url: blob.url as string,
      likes: 0,
      submitted_by: userId,
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
