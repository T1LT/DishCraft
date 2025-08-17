import { db, likesTable } from "@/app/db";
import { sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { headers } from "next/headers";
import Image from "next/image";
import { notFound } from "next/navigation";
import LikeButton from "@/app/(recipes)/recipe/[id]/like-button";
import { auth } from "@/app/auth";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import DeleteRecipe from "./delete-recipe";
import { getRecipe } from "@/app/(recipes)/actions";
import Link from "next/link";
import BackButton from "@/components/back-button";
import { Button } from "@/components/ui/button";
import ShareButton from "./share-button";

async function getUserLiked(recipeId: string, userId: string | undefined) {
  if (!userId) return false;

  return (
    (
      await db
        .select()
        .from(likesTable)
        .where(sql`user_id = ${userId} AND recipe_id = ${recipeId}`)
    ).length === 1
  );
}

export default async function RecipeItem({
  params,
}: {
  params: { id: string };
}) {
  const rid = headers().get("x-vercel-id") ?? nanoid();

  console.time(`fetch recipe ${params.id} (req: ${rid})`);
  const recipe = await getRecipe(params.id);
  console.timeEnd(`fetch recipe ${params.id} (req: ${rid})`);

  if (!recipe) notFound();

  const session = await auth();
  let userLiked: boolean;

  if (!session?.user?.id) userLiked = false;

  const userId = session?.user?.id;

  userLiked = await getUserLiked(recipe.id, userId);

  return (
    <div className="w-full max-w-xl space-y-8 px-4">
      <div className="flex flex-col gap-2 items-center">
        <BackButton />
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
            priority={true}
            className="animate-reveal"
          />
        )}
      </div>
      <div className="flex justify-between items-center">
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
        <div className="h-full flex items-center gap-2">
          <ShareButton recipe={recipe} />
          <LikeButton
            likes={recipe.likes}
            recipeId={recipe.id}
            userLiked={userLiked}
          />
        </div>
      </div>
      <div>
        <h3 className="font-bold text-xl">Ingredients</h3>
        <MarkdownRenderer>{recipe.ingredients}</MarkdownRenderer>
      </div>
      <div>
        <h3 className="font-bold text-xl">Procedure</h3>
        <MarkdownRenderer>{recipe.procedure}</MarkdownRenderer>
      </div>
      {userId === recipe.submitted_by ? (
        <div className="w-full flex justify-center gap-8">
          <Button asChild variant="secondary" className="w-[75px]">
            <Link href={`/${recipe.id.replace("_", "/")}/edit`} prefetch={true}>
              Edit
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger>
              <Button variant="destructive" className="w-[75px]">
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  recipe from our server.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <DeleteRecipe
                    recipeId={recipe.id}
                    submittedBy={recipe.submitted_by}
                  />
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ) : null}
    </div>
  );
}
