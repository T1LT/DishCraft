import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { db, likesTable, recipesTable, usersTable } from "@/app/db";
import { eq, sql } from "drizzle-orm";
import { cookies, headers as dynamic } from "next/headers";
import RecipeCard from "@/components/recipe-card";
import Link from "next/link";

async function getSubmittedRecipes(userId: string) {
  return await db
    .select({
      id: recipesTable.id,
      title: recipesTable.title,
      cuisine: recipesTable.cuisine,
      category: recipesTable.category,
      likes: recipesTable.likes,
    })
    .from(recipesTable)
    .where(eq(recipesTable.submitted_by, userId))
    .innerJoin(usersTable, eq(recipesTable.submitted_by, usersTable.id));
}

async function getLikedRecipes(userId: string) {
  return await db
    .select({
      id: recipesTable.id,
      title: recipesTable.title,
      cuisine: recipesTable.cuisine,
      category: recipesTable.category,
      likes: recipesTable.likes,
    })
    .from(recipesTable)
    .where(eq(usersTable.id, userId))
    .innerJoin(likesTable, eq(recipesTable.id, likesTable.recipe_id))
    .innerJoin(usersTable, eq(usersTable.id, likesTable.user_id));
}

export default async function UserPage() {
  dynamic();

  const cookieJar = cookies();

  if (!cookieJar.getAll().length) {
    redirect("/login/next/user");
  }

  const session = await auth();

  if (!session?.user?.id) {
    return redirect("/login/next/user");
  }

  const user = (
    await db
      .select()
      .from(usersTable)
      .where(sql`${usersTable.id} = ${session.user.id}`)
      .limit(1)
  )[0];

  if (!user) redirect("/login");

  const submittedRecipes = await getSubmittedRecipes(user.id);
  const likedRecipes = await getLikedRecipes(user.id);

  return (
    <div className="w-full max-w-lg space-y-4">
      <h1 className="font-bold text-3xl text-center">User Page</h1>
      <h2 className="font-bold text-2xl">{user.username}</h2>
      <div>
        <h2 className="font-bold text-xl mb-2">Submitted Recipes</h2>
        {submittedRecipes.length ? (
          <ul className="space-y-2">
            {submittedRecipes.map((recipe) => (
              <li key={recipe.id}>
                <RecipeCard recipe={recipe} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col gap-2">
            <h1 className="font-semibold">No recipes submitted!</h1>
            <Link href="/add-recipe" className="underline underline-offset-4">
              Add a recipe
            </Link>
          </div>
        )}
      </div>
      <div>
        <h2 className="font-bold text-xl mb-2">Liked Recipes</h2>
        {likedRecipes.length ? (
          <ul className="space-y-2">
            {likedRecipes.map((recipe) => (
              <li key={recipe.id}>
                <RecipeCard recipe={recipe} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col gap-2">
            <h1 className="font-semibold">No recipes liked!</h1>
            <Link
              href="/recipes?filter=all"
              prefetch={true}
              className="underline underline-offset-4"
            >
              View all recipes
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
