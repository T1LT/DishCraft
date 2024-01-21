import { Suspense } from "react";
import { SearchInput } from "./input";
import RecipeList from "../recipe-list";
import { headers as dynamic } from "next/headers";
import z from "zod";
import { notFound } from "next/navigation";

const SearchParamsSchema = z.object({
  q: z.string().max(256).optional().default(""),
});

export default function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  dynamic();

  const query = SearchParamsSchema.safeParse(searchParams);

  if (!query.success) notFound();

  return (
    <div className="w-full max-w-lg space-y-4">
      <div className="flex flex-col gap-8">
        <h1 className="font-bold text-3xl text-center">Search Recipes</h1>
        <SearchInput />
      </div>
      <Suspense fallback={null}>
        <RecipeList filter="all" q={query.data.q} />
      </Suspense>
    </div>
  );
}
