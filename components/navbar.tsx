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
    <div className="w-full px-4 flex justify-center sticky top-4">
      <div className="z-10 max-w-5xl w-full py-4 px-6 flex justify-between lg:grid grid-cols-6 place-items-center text-sm rounded-full backdrop-filter bg-white/40 backdrop-blur border">
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
                prefetch={true}
                className="hover:underline underline-offset-4"
              >
                All
              </Link>
            </li>
            <li className="font-light select-none">|</li>
            <li>
              <Link
                href="/popular"
                prefetch={true}
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
                    href="/add"
                    className="hover:underline underline-offset-4"
                  >
                    Add
                  </Link>
                }
              >
                <AddLink />
              </Suspense>
            </li>
            <li className="font-light select-none">|</li>
            <li>
              <Link
                href="/user"
                prefetch={true}
                className="hover:underline underline-offset-4"
              >
                Me
              </Link>
            </li>
          </ul>
        </nav>
        <Suspense
          fallback={
            <Button className="h-8 py-5 px-4 rounded-full hidden lg:flex lg:col-span-1">
              Log Out
            </Button>
          }
        >
          <AuthNav />
        </Suspense>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex lg:hidden">
            <Menu className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <Suspense fallback={<h1>Hello There!</h1>}>
                <UsernameLabel />
              </Suspense>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/" prefetch={true} className="w-full">
                All Recipes
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/popular" prefetch={true} className="w-full">
                Popular Recipes
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/add" className="w-full">
                Add a Recipe
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/user" prefetch={true} className="w-full">
                My Page
              </Link>
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
