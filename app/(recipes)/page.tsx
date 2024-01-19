import RecipeList from "./recipe-list";

export default function Recipes() {
  return (
    <div className="w-full max-w-lg space-y-4">
      <h1 className="font-bold text-3xl text-center">All Recipes</h1>
      <RecipeList filter="all" />
    </div>
  );
}
