import { capitalize } from "@/lib/utils";
import RecipeList from "./recipe-list";
import { Suspense } from "react";
import RecipeListSkeleton from "@/components/skeletons/recipes-skeleton";

export default function Recipes({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const { filter: filter } = searchParams as { [key: string]: string };

  return (
    <div className="w-full max-w-lg space-y-4">
      <h1 className="font-bold text-3xl text-center">
        {capitalize(filter)} Recipes
      </h1>
      <Suspense fallback={<RecipeListSkeleton />}>
        <RecipeList filter={filter} />
      </Suspense>
    </div>
  );
}
