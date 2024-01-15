import { db, recipesTable } from "@/app/db";
import { sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { headers } from "next/headers";
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

  return <div>Recipe item</div>;
}
