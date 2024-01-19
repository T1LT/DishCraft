import RecipeCard from "@/components/recipe-card";
import { nanoid } from "nanoid";
import { headers } from "next/headers";
import { getRecipes } from "./actions";

export default async function RecipeList({
  filter,
}: {
  filter: "all" | "popular";
}) {
  const rid = headers().get("x-vercel-id") ?? nanoid();

  console.time(`fetch ${filter} recipes (req: ${rid})`);
  const recipes = await getRecipes(filter);
  console.timeEnd(`fetch ${filter} recipes (req: ${rid})`);

  if (!recipes || !recipes.length) {
    return <h1 className="font-semibold text-xl">No recipes found!</h1>;
  }

  return (
    <ul className="space-y-2">
      {recipes.map((recipe) => (
        <li key={recipe.id}>
          <RecipeCard recipe={recipe} />
        </li>
      ))}
    </ul>
  );
}
