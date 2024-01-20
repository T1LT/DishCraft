"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      className="w-max"
      onClick={router.back}
      aria-label="back button"
    >
      <ChevronLeft className="mr-2 h-4 w-4" />
      <span className="font-semibold text-sm">Back</span>
    </Button>
  );
}
