"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

export function NextLink({
  page,
  dir,
  q,
}: {
  page: number;
  dir: "Next" | "Previous";
  q: string | null;
}) {
  const pathname = usePathname();
  const params = new URLSearchParams({
    ...(q === null ? {} : { q }),
    ...(page > 1 ? { p: page.toString() } : {}),
  }).toString();

  return (
    <Link
      href={`${pathname}${params.length ? `?${params}` : ""}`}
      prefetch={true}
      className={cn(
        buttonVariants({ variant: "secondary" }),
        "flex items-center",
      )}
    >
      {dir === "Previous" ? <ChevronLeft className="h-4 w-4 mr-2" /> : null}
      {dir}
      {dir === "Next" ? <ChevronRight className="h-4 w-4 ml-2" /> : null}
    </Link>
  );
}
