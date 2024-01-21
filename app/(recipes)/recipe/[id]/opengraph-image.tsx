export const runtime = "edge";
export const revalidate = 60;

import { ImageResponse } from "next/og";
import { db, usersTable, recipesTable } from "@/app/db";
import { sql } from "drizzle-orm";
import { notFound } from "next/navigation";

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/7PJ3fU62YbZ
 */

export default async function MainOG({
  params: { id },
}: {
  params: { id: string };
}) {
  id = `recipe_${id}`;
  const recipe = (
    await db
      .select()
      .from(recipesTable)
      .where(sql`${recipesTable.id} = ${id}`)
      .limit(1)
  )[0];

  if (!recipe) notFound();

  // fonts
  const inter300 = fetch(
    new URL(
      `../../../../node_modules/@fontsource/inter/files/inter-latin-300-normal.woff`,
      import.meta.url,
    ),
  ).then((res) => res.arrayBuffer());

  const inter600 = fetch(
    new URL(
      `../../../../node_modules/@fontsource/inter/files/inter-latin-600-normal.woff`,
      import.meta.url,
    ),
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div tw="flex h-full w-full px-4" style={font("Inter 300")}>
        <div tw="flex flex-col justify-between h-full w-full">
          <div tw="p-4 pt-8 pb-0 flex flex-row items-center w-full text-3xl">
            <div tw="flex items-center">
              <span style={font("Inter 600")}>DishCraft</span>
            </div>

            <div tw="flex items-center text-gray-600 ml-auto">
              dishcraft.vercel.app
            </div>
          </div>
          <div tw="p-4 flex flex-col justify-center items-center w-full">
            <h3
              tw="flex tracking-tight leading-tight text-5xl text-center mb-2 text-[#FF9966] justify-center"
              style={font("Inter 600")}
            >
              {recipe.title}
            </h3>
            <p tw="flex text-gray-600 text-3xl items-center justify-center">
              by {recipe.username}
            </p>
          </div>
          <div tw="p-4 pb-8 flex">
            <div tw="text-gray-600 flex items-center text-3xl justify-between w-full">
              <span>
                {new Date(recipe.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span>Likes: {recipe.likes}</span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Inter 300",
          data: await inter300,
        },
        {
          name: "Inter 600",
          data: await inter600,
        },
      ],
    },
  );
}

// helper for more succinct styles
function font(fontFamily: string) {
  return { fontFamily };
}
