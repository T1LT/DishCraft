export const runtime = "edge";
export const revalidate = 60;

import { ImageResponse } from "next/og";
import { getRecipes, getRecipesCount } from "./recipe-list";
import { Donut } from "lucide-react";

const numberFormatter = new Intl.NumberFormat("en-US");

export default async function MainOG() {
  const recipes = await getRecipes({
    page: 1,
    filter: "all",
    q: null,
    limit: 3,
  });

  const count = await getRecipesCount();

  // font fetching
  const inter300 = fetch(
    new URL(
      `../../node_modules/@fontsource/inter/files/inter-latin-300-normal.woff`,
      import.meta.url,
    ),
  ).then((res) => res.arrayBuffer());

  const inter600 = fetch(
    new URL(
      `../../node_modules/@fontsource/inter/files/inter-latin-600-normal.woff`,
      import.meta.url,
    ),
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div tw="flex h-full w-full" style={font("Inter 300")}>
        <div tw="flex flex-col justify-between h-full w-full">
          <div tw="p-4 pt-8 px-8 pb-0 flex flex-row items-center w-full text-3xl">
            <div tw="flex items-center gap-2">
              <Donut style={{ height: "1.5rem", width: "1.5rem" }} />
              <h1 tw="text-2xl font-bold select-none">DishCraft</h1>
            </div>

            <div tw="flex items-center ml-auto text-gray-600">
              dishcraft.vercel.app
            </div>
          </div>
          <div tw="p-4 px-8 flex flex-col justify-center flex-1">
            <ul tw="flex flex-col">
              {recipes.map((recipe) => (
                <li key={recipe.id} tw="text-3xl flex items-start mb-5">
                  <div tw="flex flex-col">
                    <span
                      tw="mb-1 max-w-270 max-h-10 overflow-hidden"
                      style={font("Inter 600")}
                    >
                      {recipe.title}
                    </span>
                    <div tw="flex text-gray-600">
                      by {recipe.username} | {recipe.cuisine} |{" "}
                      {recipe.category} | {recipe.likes}
                    </div>
                  </div>
                </li>
              ))}

              <li tw="text-3xl flex items-start mb-5">
                <div tw="flex w-18 pr-4 text-right justify-end text-[#FF9966] flex-shrink-0"></div>
                <div tw="flex flex-col text-gray-600">
                  {numberFormatter.format(count)} more
                </div>
              </li>
            </ul>
          </div>
          <div tw="p-4 px-8 pb-8 pt-6 bg-gray-100 flex">
            <div tw="text-gray-600 flex items-center text-3xl justify-center w-full">
              <span>What will you cook next?</span>
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

function font(fontFamily: string) {
  return { fontFamily };
}
