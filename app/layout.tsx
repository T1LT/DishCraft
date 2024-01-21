import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";
import { LayoutSkeleton } from "@/components/skeletons/recipes-skeleton";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains_mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "DishCraft",
  description: "One-stop store for all your recipes. Built for developers.",
  metadataBase: new URL("https://dishcraft.vercel.app"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${jetbrains_mono.variable} overflow-y-scroll`}
      >
        <Suspense fallback={<LayoutSkeleton />}>{children}</Suspense>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
