import { getRecipe } from "@/app/(recipes)/actions";
import { auth } from "@/app/auth";
import { db, usersTable } from "@/app/db";
import { nanoid } from "nanoid";
import { cookies, headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import UpdateRecipeForm from "./update-recipe";

export default async function EditRecipe({
  params,
}: {
  params: { id: string };
}) {
  const rid = headers().get("x-vercel-id") ?? nanoid();

  console.time(`fetch recipe ${params.id} (req: ${rid})`);
  const recipe = await getRecipe(params.id);
  console.timeEnd(`fetch recipe ${params.id} (req: ${rid})`);

  if (!recipe) notFound();

  const cookieJar = cookies();

  if (!cookieJar.getAll().length) {
    redirect("/login");
  }

  const session = await auth();

  if (!session?.user?.id) {
    return redirect("/login");
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

  return <UpdateRecipeForm recipe={recipe} />;
}
