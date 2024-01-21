import RecipeCard from "@/components/recipe-card";
import { nanoid } from "nanoid";
import { headers } from "next/headers";
import { getTableConfig } from "drizzle-orm/pg-core";
import { db, recipesTable } from "@/app/db";
import { desc, ilike, sql, or } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { NextLink } from "@/components/pagination-link";
import { Suspense } from "react";
import clsx from "clsx";

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

function recipesWhere(q: string | null) {
  return q != null && q.length
    ? or(
        ilike(recipesTable.title, `%${q}%`),
        ilike(recipesTable.cuisine, `%${q}%`),
        ilike(recipesTable.category, `%${q}%`),
      )
    : undefined;
}

export async function getRecipes({
  page,
  filter,
  q,
  limit = PER_PAGE,
}: {
  page: number;
  filter: "all" | "popular";
  q: string | null;
  limit?: number;
}) {
  const order =
    filter === "all" ? desc(recipesTable.created_at) : desc(recipesTable.likes);

  return await db
    .select()
    .from(recipesTable)
    .where(recipesWhere(q))
    .orderBy(order)
    .limit(limit)
    .offset((page - 1) * limit);
}

async function hasMoreRecipes({ page, q }: { page: number; q: string | null }) {
  const count = await db
    .select({ id: recipesTable.id })
    .from(recipesTable)
    .where(recipesWhere(q))
    .limit(PER_PAGE)
    .offset(page * PER_PAGE);

  return count.length > 0;
}

export default async function RecipeList({
  filter,
  page = 1,
  q = null,
}: {
  filter: "all" | "popular";
  page?: number;
  q?: string | null;
}) {
  const rid = headers().get("x-vercel-id") ?? nanoid();

  console.time(`fetch ${filter} recipes (req: ${rid})`);
  const recipes = await getRecipes({ page, filter, q });
  console.timeEnd(`fetch ${filter} recipes (req: ${rid})`);

  if (!recipes || !recipes.length) {
    return (
      <h1 className="font-medium text-lg text-center">No recipes found!</h1>
    );
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
        <Previous page={page} q={q} />
        <Suspense fallback={null}>
          <Next page={page} q={q} />
        </Suspense>
      </div>
    </div>
  );
}

export async function Next({ page, q }: { page: number; q: string | null }) {
  const hasMore = await hasMoreRecipes({ page, q });

  return (
    <div className={clsx("w-max", !hasMore && "cursor-not-allowed")}>
      <Button
        variant="link"
        disabled={!hasMore}
        className="hover:no-underline p-0"
      >
        <NextLink page={page + 1} dir="Next" q={q} />
      </Button>
    </div>
  );
}

export async function Previous({
  page,
  q,
}: {
  page: number;
  q: string | null;
}) {
  return (
    <div className={clsx("w-max", page === 1 && "cursor-not-allowed")}>
      <Button
        variant="link"
        disabled={page === 1}
        className="hover:no-underline p-0"
      >
        <NextLink page={page - 1} dir="Previous" q={q} />
      </Button>
    </div>
  );
}
