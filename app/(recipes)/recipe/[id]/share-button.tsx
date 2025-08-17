"use client";

import { Send, Copy } from "lucide-react";
import { usePathname } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

type RecipeType = {
  title: string;
  id: string;
  likes: number;
  image_url: string | null;
  cuisine: string;
  category: string;
  prepTime: number;
  ingredients: string;
  procedure: string;
  username: string | null;
  submitted_by: string | null;
  created_at: Date;
  updated_at: Date;
};

export default function ShareButton({ recipe }: { recipe: RecipeType }) {
  const pathname = usePathname();
  const { toast } = useToast();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if device supports native sharing
    // Only enable on mobile devices that actually have native sharing
    const isMobileDevice =
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    const hasNativeSharing =
      typeof navigator !== "undefined" &&
      "share" in navigator &&
      navigator.canShare &&
      navigator.canShare({ url: "https://dishcraft.vercel.app" });

    setIsMobile(isMobileDevice && hasNativeSharing);
  }, []);

  const shareUrl = `https://dishcraft.vercel.app/${recipe.id.replace("_", "/")}`;
  const shareTitle = `Check out ${recipe.title} by ${recipe.username} on DishCraft`;
  const encodedShareTitle = encodeURIComponent(`${shareTitle}: ${shareUrl}`);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({ title: "Link copied to clipboard!" });
      setIsOpen(false);
    } catch (error) {
      toast({ title: "Failed to copy link", variant: "destructive" });
    }
  }

  async function handleShare() {
    if (isMobile) {
      try {
        await navigator.share({
          title: shareTitle,
          url: shareUrl,
        });
      } catch (error) {
        // On mobile, don't show dialog - just silently fail
        // This ensures only native sharing is used on mobile
        console.log("Native sharing failed or was cancelled");
      }
    } else {
      setIsOpen(true);
    }
  }

  return (
    <>
      <Send
        className="h-6 w-6 cursor-pointer"
        onClick={handleShare}
        aria-label="share recipe"
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Recipe</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-6">
            <div className="grid grid-cols-2 gap-4 w-full">
              <Button
                onClick={copyLink}
                variant="outline"
                className="flex flex-col items-center gap-2 h-20"
              >
                <Copy className="h-6 w-6" />
                <span className="text-sm">Copy Link</span>
              </Button>

              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-20 bg-green-50 hover:bg-green-100 border-green-200"
                asChild
              >
                <Link
                  href={`https://wa.me/?text=${encodedShareTitle}`}
                  target="_blank"
                >
                  <Image
                    src="https://img.icons8.com/color/48/whatsapp--v1.png"
                    alt="whatsapp"
                    width={40}
                    height={40}
                    unoptimized
                  />
                  <span className="text-sm">WhatsApp</span>
                </Link>
              </Button>

              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-20 bg-black hover:bg-neutral-800 text-white border-black hover:text-white"
                asChild
              >
                <Link
                  href={`https://twitter.com/intent/tweet?text=${encodedShareTitle}`}
                  target="_blank"
                >
                  <Image
                    src="https://img.icons8.com/color/48/twitterx--v1.png"
                    alt="twitter"
                    width={40}
                    height={40}
                    unoptimized
                  />
                  <span className="text-sm">X (Twitter)</span>
                </Link>
              </Button>

              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-20 bg-blue-50 hover:bg-blue-100 border-blue-200"
                asChild
              >
                <Link
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                  target="_blank"
                >
                  <Image
                    src="https://img.icons8.com/color/48/facebook-new.png"
                    alt="facebook"
                    width={40}
                    height={40}
                    unoptimized
                  />
                  <span className="text-sm">Facebook</span>
                </Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
