import { auth } from "@/app/auth";
import { db, usersTable } from "@/app/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import RecipeForm from "./recipe-form";

export default async function AddRecipe() {
  const cookieJar = cookies();

  if (!cookieJar.getAll().length) {
    redirect("/login/next/add");
  }

  const session = await auth();

  if (!session?.user?.id) {
    return redirect("/login/next/add");
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

  return <RecipeForm />;
}
