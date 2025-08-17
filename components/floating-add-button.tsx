"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FloatingAddButton() {
  const pathname = usePathname();

  // Don't show the button on the add page
  if (pathname === "/add") {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-0 left-0 z-50 flex justify-center">
      <div className="max-w-5xl w-full px-4 lg:px-0 flex justify-end">
        <Link
          href="/add"
          className="w-14 h-14 rounded-full backdrop-filter bg-background/40 backdrop-blur border flex items-center justify-center hover:bg-background/60 transition-all duration-200 shadow-lg hover:shadow-xl"
          aria-label="Add new recipe"
        >
          <Plus className="h-6 w-6" />
        </Link>
      </div>
    </div>
  );
}
