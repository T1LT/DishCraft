import RecipeCard from "@/components/recipe-card";
import { nanoid } from "nanoid";
import { headers } from "next/headers";
import { getTableConfig } from "drizzle-orm/pg-core";
import { db, recipesTable } from "@/app/db";
import { desc, sql } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { NextLink } from "@/components/pagination-link";
import { Suspense } from "react";

const PER_PAGE = 20;
const recipesTableName = getTableConfig(recipesTable).name;

export async function getRecipesCount() {
  // high perf estimate
  const statement = sql`SELECT reltuples::BIGINT AS estimate
    FROM pg_class
    WHERE relname = ${recipesTableName}
  `;
  const res = await db.execute(statement);
  if (!res.rows[0]) return 0;
  const row: { estimate: number } = res.rows[0] as any;
  return row.estimate ?? 0;
}

export async function getRecipes({
  page,
  limit = PER_PAGE,
}: {
  page: number;
  limit?: number;
}) {
  return await db
    .select()
    .from(recipesTable)
    .orderBy(desc(recipesTable.created_at))
    .limit(limit)
    .offset((page - 1) * limit);
}

async function hasMoreRecipes({ page }: { page: number }) {
  const count = await db
    .select({ id: recipesTable.id })
    .from(recipesTable)
    .limit(PER_PAGE)
    .offset(page * PER_PAGE);

  return count.length > 0;
}

export default async function RecipeList({
  filter,
  page = 1,
}: {
  filter: "all" | "popular";
  page: number;
}) {
  const rid = headers().get("x-vercel-id") ?? nanoid();

  console.time(`fetch ${filter} recipes (req: ${rid})`);
  const recipes = await getRecipes({ page });
  console.timeEnd(`fetch ${filter} recipes (req: ${rid})`);

  if (!recipes || !recipes.length) {
    return <h1 className="font-semibold text-xl">No recipes found!</h1>;
  }

  return (
    <div>
      <ul className="space-y-2">
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <RecipeCard recipe={recipe} />
          </li>
        ))}
      </ul>

      <div className="w-full py-4 flex items-center justify-between">
        <Previous page={page} />
        <Suspense fallback={null}>
          <Next page={page} />
        </Suspense>
      </div>
    </div>
  );
}

export async function Next({ page }: { page: number }) {
  const hasMore = await hasMoreRecipes({ page });

  return (
    <Button variant="link" disabled={!hasMore} className="hover:no-underline">
      <NextLink page={page + 1} dir="Next" />
    </Button>
  );
}

export async function Previous({ page }: { page: number }) {
  return (
    <Button variant="link" disabled={page === 1} className="hover:no-underline">
      <NextLink page={page - 1} dir="Previous" />
    </Button>
  );
}
