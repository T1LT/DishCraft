import Navbar from "@/components/navbar";
import SplashHeader from "@/components/splash-header";
import { Button } from "@/components/ui/button";
import { Beef, CakeSlice, IceCream, Pizza, Sandwich } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const icons = [Beef, CakeSlice, IceCream, Pizza, Sandwich];
  const Icon = icons[Math.floor(Math.random() * 5)];

  return (
    <>
      <Navbar />
      <main className="flex min-h-[calc(100vh-74px)] flex-col items-center justify-center p-4">
        <SplashHeader />
        <Button asChild className="text-md p-6 lg:text-xl lg:p-8 group">
          <Link href="/recipes?filter=all" className="flex items-center gap-2">
            View All Recipes
            <Icon className="h-6 w-6 group-hover:scale-110 transition" />
          </Link>
        </Button>
      </main>
    </>
  );
}
