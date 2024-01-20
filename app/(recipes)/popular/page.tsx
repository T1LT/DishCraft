import z from "zod";
import RecipeList from "../recipe-list";
import { headers as dynamic } from "next/headers";
import { notFound } from "next/navigation";

const SearchParamsSchema = z.object({
  p: z.coerce.number().min(1).max(100).optional().default(1),
});

export default function PopularRecipes({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  dynamic();

  const query = SearchParamsSchema.safeParse(searchParams);

  if (!query.success) notFound();

  const page = query.data.p;

  return (
    <div className="w-full max-w-lg space-y-4">
      <h1 className="font-bold text-3xl text-center">Popular Recipes</h1>
      <RecipeList filter="popular" page={page} />
    </div>
  );
}
