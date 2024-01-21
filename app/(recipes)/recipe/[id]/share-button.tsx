"use client";

import { Send } from "lucide-react";
import { usePathname } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export default function ShareButton() {
  const pathname = usePathname();
  const { toast } = useToast();

  async function copyLink() {
    await navigator.clipboard.writeText(
      `https://dishcraft.vercel.app${pathname}`,
    );
    toast({ title: "Link copied to clipboard!" });
  }

  return (
    <Send
      className="h-6 w-6 cursor-pointer"
      onClick={copyLink}
      aria-label="share recipe"
    />
  );
}
