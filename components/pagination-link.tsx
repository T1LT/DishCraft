"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

export function NextLink({
  page,
  dir,
}: {
  page: number;
  dir: "Next" | "Previous";
}) {
  const pathname = usePathname();
  const params = new URLSearchParams({
    ...(page > 1 ? { p: page.toString() } : {}),
  }).toString();

  return (
    <Link
      href={`${pathname}${params.length ? `?${params}` : ""}`}
      prefetch={true}
      className={cn(
        buttonVariants({ variant: "secondary" }),
        "flex items-center gap-1",
      )}
    >
      {dir === "Previous" ? <ChevronLeft className="h-4 w-4" /> : null}
      {dir}
      {dir === "Next" ? <ChevronRight className="h-4 w-4" /> : null}
    </Link>
  );
}
