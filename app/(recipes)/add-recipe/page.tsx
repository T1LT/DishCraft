import { auth } from "@/app/auth";
import { redirect } from "next/navigation";

export default async function AddRecipe() {
  const session = await auth();

  if (!session?.user?.id) {
    return redirect("/login/next/add-recipe");
  }

  return <div>Add Recipe Page</div>;
}
