import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { db, likesTable, recipesTable, usersTable } from "@/app/db";
import { desc, eq, sql } from "drizzle-orm";
import { cookies, headers as dynamic } from "next/headers";
import RecipeCard from "@/components/recipe-card";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    .innerJoin(usersTable, eq(recipesTable.submitted_by, usersTable.id))
    .orderBy(desc(recipesTable.created_at));
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
    .innerJoin(usersTable, eq(usersTable.id, likesTable.user_id))
    .orderBy(desc(likesTable.updated_at));
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
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-3xl text-center">User Page</h1>
        <h2 className="font-bold text-2xl text-center">{user.username}</h2>
      </div>
      <Tabs defaultValue="submitted" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="submitted" className="w-full">
            Submitted
          </TabsTrigger>
          <TabsTrigger value="liked" className="w-full">
            Liked
          </TabsTrigger>
        </TabsList>
        <TabsContent value="submitted">
          <div>
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
                <Link href="/add" className="underline underline-offset-4">
                  Add a recipe
                </Link>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="liked">
          <div>
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
                  href="/"
                  prefetch={true}
                  className="underline underline-offset-4"
                >
                  View all recipes
                </Link>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
