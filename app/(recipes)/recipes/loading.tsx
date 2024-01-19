import RecipeCardSkeleton from "@/components/skeletons/recipe-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full max-w-lg space-y-4">
      <div className="flex justify-center">
        <Skeleton className="h-[40px] w-[250px]" />
      </div>
      <ul className="space-y-2">
        {Array.from({ length: 8 }, (_, idx) => (
          <li key={idx}>
            <RecipeCardSkeleton />
          </li>
        ))}
      </ul>
    </div>
  );
}
