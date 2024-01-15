import { Donut, Menu } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddLink, AuthNav, UsernameLabel } from "@/app/(auth)/auth-nav";

export default function Navbar() {
  return (
    <div className="w-full flex justify-center sticky top-5 ">
      <div className="z-10 max-w-5xl w-full py-4 px-6 flex items-center justify-between text-sm rounded-full backdrop-filter bg-white/40 backdrop-blur border">
        <Link href="/">
          <div className="flex items-center gap-2">
            <Donut className="h-6 w-6" />
            <h1 className="text-2xl font-bold select-none">DishCraft</h1>
          </div>
        </Link>
        <nav className="hidden lg:block">
          <ul className="flex space-x-4 sm:space-x-6 font-semibold">
            <li>
              <Link href="/all" className="hover:underline underline-offset-4">
                All
              </Link>
            </li>
            <li className="font-light select-none">|</li>
            <li>
              <Link
                href="/popular"
                className="hover:underline underline-offset-4"
              >
                Popular
              </Link>
            </li>
            <li className="font-light select-none">|</li>
            <li>
              <Suspense
                fallback={
                  <Link
                    href="/addrecipe"
                    className="hover:underline underline-offset-4"
                  >
                    Add
                  </Link>
                }
              >
                <AddLink />
              </Suspense>
            </li>
          </ul>
        </nav>
        <Suspense
          fallback={
            <Button className="rounded-full hidden lg:block">Log Out</Button>
          }
        >
          <AuthNav />
        </Suspense>
        <DropdownMenu>
          <DropdownMenuTrigger className="block lg:hidden">
            <Menu className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <Suspense fallback={<h1>Hello There!</h1>}>
                <UsernameLabel />
              </Suspense>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/all" className="hover:underline w-full">
                All Recipes
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/popular" className="hover:underline">
                Popular Recipes
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Suspense
                fallback={
                  <Link href="/addrecipe" className="hover:underline">
                    Add a Recipe
                  </Link>
                }
              >
                <AddLink />
              </Suspense>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Suspense
                fallback={
                  <Button variant="link" className="p-0 h-4">
                    Log Out
                  </Button>
                }
              >
                <AuthNav type="dropdown" />
              </Suspense>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
