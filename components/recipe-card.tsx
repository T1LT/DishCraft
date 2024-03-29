import { ArrowRight } from "lucide-react";
import Link from "next/link";

type ReducedRecipe = {
  id: string;
  title: string;
  cuisine: string;
  category: string;
  likes: number;
};

export default function RecipeCard({ recipe }: { recipe: ReducedRecipe }) {
  return (
    <Link
      href={`/${recipe.id.replace("_", "/")}`}
      prefetch={true}
      className="flex flex-col items-center"
    >
      <div className="w-full px-4 py-4 flex flex-col items-start gap-2 group rounded-md hover:bg-neutral-100/75 transition">
        <div className="w-full flex items-center gap-2">
          <span className="font-semibold text-gray-800 group-hover:text-black transition duration-300">
            {recipe.title}
          </span>
          <ArrowRight className="h-4 w-4 text-gray-800 group-hover:translate-x-1 transition-transform group-hover:text-black group-hover:dark:text-white" />
        </div>
        <div className="text-gray-600 group-hover:text-black space-x-2 text-sm font-light">
          <span>{`${recipe.cuisine}`}</span>
          <span className="text-xs select-none">|</span>
          <span>{`${recipe.category}`}</span>
          <span className="text-xs select-none">|</span>
          <span>{`${recipe.likes} like${recipe.likes === 1 ? "" : "s"}`}</span>
        </div>
      </div>
    </Link>
  );
}
