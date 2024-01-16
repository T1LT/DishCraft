import { db, recipesTable } from "@/app/db";
import { capitalize } from "@/lib/utils";
import { desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { headers } from "next/headers";
import Link from "next/link";

async function getRecipes(filter: string) {
  if (!filter || filter === "all") {
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
      .from(recipesTable);
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

export default async function Recipes({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const { filter: filter } = searchParams as { [key: string]: string };

  const rid = headers().get("x-vercel-id") ?? nanoid();

  console.time(`fetch ${filter} recipes (req: ${rid})`);
  const recipes = await getRecipes(filter);
  console.timeEnd(`fetch ${filter} recipes (req: ${rid})`);

  if (!recipes || !recipes.length) return <h1>No recipes found!</h1>;

  return (
    <div className="w-full max-w-lg space-y-4">
      <h1 className="font-bold text-3xl text-center">
        {capitalize(filter)} Recipes
      </h1>
      <ul className="space-y-2">
        {recipes.map((recipe) => (
          <li>
            <Link
              href={`/recipes/${recipe.id.replace(/^recipe_/, "")}`}
              className="hover:underline underline-offset-4"
              key={recipe.id}
            >
              <h1>{recipe.title}</h1>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
