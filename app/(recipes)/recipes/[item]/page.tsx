import { db, recipesTable } from "@/app/db";
import { sql } from "drizzle-orm";
import { Heart } from "lucide-react";
import { nanoid } from "nanoid";
import { headers } from "next/headers";
import Image from "next/image";
import { notFound } from "next/navigation";

async function getRecipe(id: string) {
  const recipeId = `recipe_${id}`;
  return (
    await db
      .select()
      .from(recipesTable)
      .where(sql`id = ${recipeId}`)
  )[0];
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
      <div className="flex justify-between">
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
        <p className="flex items-center gap-1">
          <Heart className="h-6 w-6" />
          {recipe.likes}
        </p>
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
