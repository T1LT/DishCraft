import { auth } from "@/app/auth";
import { db, usersTable } from "@/app/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import RecipeForm from "./recipe-form";

export default async function AddRecipe() {
  const cookieJar = cookies();

  if (!cookieJar.getAll().length) {
    redirect("/login/next/add-recipe");
  }

  const session = await auth();

  if (!session?.user?.id) {
    return redirect("/login/next/add-recipe");
  }

  const user = (
    await db
      .select({
        id: usersTable.id,
      })
      .from(usersTable)
  )[0];

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Add a Recipe</h1>
      <RecipeForm />
    </div>
  );
}
