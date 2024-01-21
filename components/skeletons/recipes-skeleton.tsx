import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "../navbar";

export function RecipeCardSkeleton() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full px-4 py-4 flex flex-col items-start gap-2 group rounded-md">
        <div className="w-full flex items-center gap-2">
          <Skeleton className="w-[250px] h-[24px]" />
        </div>
        <div className="flex items-center text-gray-200 space-x-2 text-sm font-light">
          <Skeleton className="w-[45px] h-[20px]" />
          <span className="text-xs select-none">|</span>
          <Skeleton className="w-[45px] h-[20px]" />
          <span className="text-xs select-none">|</span>
          <Skeleton className="w-[45px] h-[20px]" />
        </div>
      </div>
    </div>
  );
}

export default function RecipeListSkeleton() {
  return (
    <ul className="space-y-2">
      {Array.from({ length: 8 }, (_, idx) => (
        <li key={idx}>
          <RecipeCardSkeleton />
        </li>
      ))}
    </ul>
  );
}

export function LayoutSkeleton() {
  return (
    <>
      <Navbar />
      <div className="w-full max-w-lg space-y-4">
        <div className="flex justify-center">
          <Skeleton className="h-[40px] w-[250px]" />
        </div>
        <RecipeListSkeleton />
      </div>
    </>
  );
}
