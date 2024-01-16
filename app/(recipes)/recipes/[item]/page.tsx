import { db, likesTable, recipesTable } from "@/app/db";
import { sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { headers } from "next/headers";
import Image from "next/image";
import { notFound } from "next/navigation";
import LikeButton from "../like-button";
import { auth } from "@/app/auth";

async function getRecipe(id: string) {
  const recipeId = `recipe_${id}`;
  return (
    await db
      .select()
      .from(recipesTable)
      .where(sql`id = ${recipeId}`)
  )[0];
}

async function getUserLiked(recipeId: string, userId: string | undefined) {
  if (!userId) return false;

  return (
    (
      await db
        .select()
        .from(likesTable)
        .where(sql`user_id = ${userId} AND recipe_id = ${recipeId}`)
    ).length === 1
  );
}

export default async function RecipeItem({
  params,
}: {
  params: { item: string };
}) {
  const rid = headers().get("x-vercel-id") ?? nanoid();

  console.time(`fetch recipe ${params.item} (req: ${rid})`);
  const recipe = await getRecipe(params.item);
  console.timeEnd(`fetch recipe ${params.item} (req: ${rid})`);

  if (!recipe) notFound();

  const session = await auth();
  let userLiked: boolean;

  if (!session?.user?.id) userLiked = false;

  const userId = session?.user?.id;

  userLiked = await getUserLiked(recipe.id, userId);

  return (
    <div className="w-full max-w-xl space-y-8 px-8">
      <div>
        <h1 className="font-bold text-3xl text-center">{recipe.title}</h1>
        <h2 className="font-semibold text-lg text-center">{`by ${recipe.username}`}</h2>
      </div>
      <div className="flex justify-center">
        {recipe.image_url && (
          <Image
            src={recipe.image_url}
            height={300}
            width={400}
            alt={recipe.title}
          />
        )}
      </div>
      <div className="flex justify-between items-center">
        <div className="flex flex-col space-y-2">
          <p className="flex gap-1">
            <span className="font-bold">Cuisine:</span>
            {recipe.cuisine}
          </p>
          <p className="flex gap-1">
            <span className="font-bold">Category:</span>
            {recipe.category}
          </p>
          <p className="flex gap-1">
            <span className="font-bold">Prep Time:</span>
            {recipe.prepTime} min
          </p>
        </div>
        <LikeButton
          likes={recipe.likes}
          recipeId={recipe.id}
          userLiked={userLiked}
        />
      </div>
      <div>
        <h3 className="font-bold text-xl">Ingredients</h3>
        <p className="leading-loose text-justify pt-2">{recipe.ingredients}</p>
      </div>
      <div>
        <h3 className="font-bold text-xl">Procedure</h3>
        <p className="leading-loose text-justify pt-2">{recipe.procedure}</p>
      </div>
    </div>
  );
}
