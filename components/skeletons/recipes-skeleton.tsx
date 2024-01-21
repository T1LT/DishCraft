import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  Donut,
  Flame,
  Menu,
  Pizza,
  Plus,
  Search,
  UserCircle2,
} from "lucide-react";

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
      <NavbarSkeleton />
      <div className="w-full flex justify-center px-4 py-12">
        <div className="w-full max-w-lg space-y-4">
          <div className="flex justify-center">
            <Skeleton className="h-[40px] w-[250px]" />
          </div>
          <RecipeListSkeleton />
        </div>
      </div>
    </>
  );
}

export function NavbarSkeleton() {
  return (
    <header className="w-full px-4 flex justify-center sticky top-4">
      <div className="z-10 h-[74px] max-w-5xl w-full py-4 px-6 flex justify-between lg:grid grid-cols-6 place-items-center text-sm rounded-full backdrop-filter bg-white/40 backdrop-blur border">
        <Link
          href="/"
          className="col-span-2 lg:col-span-1 w-full flex justify-start"
        >
          <div className="flex items-center gap-2">
            <Donut className="h-6 w-6" />
            <h1 className="text-2xl font-bold select-none">DishCraft</h1>
          </div>
        </Link>
        <nav className="hidden col-span-1 lg:block lg:col-span-4">
          <ul className="flex space-x-4 sm:space-x-6 font-semibold text-base">
            <li>
              <Link
                href="/"
                className="flex items-center gap-2 hover:underline underline-offset-4"
              >
                <Pizza className="h-5 w-5" />
                All
              </Link>
            </li>
            <li className="font-light select-none">|</li>
            <li>
              <Link
                href="/popular"
                className="flex items-center gap-2 hover:underline underline-offset-4"
              >
                <Flame className="h-5 w-5" />
                Popular
              </Link>
            </li>
            <li className="font-light select-none">|</li>
            <li>
              <Link
                href="/add"
                className="flex items-center gap-2 hover:underline underline-offset-4"
              >
                <Plus className="h-5 w-5" />
                Add
              </Link>
            </li>
            <li className="font-light select-none">|</li>
            <li>
              <Link
                href="/search"
                className="flex items-center gap-2 hover:underline underline-offset-4"
              >
                <Search className="h-5 w-5" />
                Search
              </Link>
            </li>
            <li className="font-light select-none">|</li>
            <li>
              <Link
                href="/user"
                className="flex items-center gap-2 hover:underline underline-offset-4"
              >
                <UserCircle2 className="h-5 w-5" />
                Me
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex lg:hidden" aria-label="Open navigation dropdown">
          <Menu className="h-5 w-5" />
        </div>
      </div>
    </header>
  );
}
