import Navbar from "@/components/navbar";
import FloatingAddButton from "@/components/floating-add-button";

export const metadata = {
  openGraph: {
    title: "DishCraft",
    url: "https://dishcraft.vercel.app",
    siteName: "DishCraft",
  },
  twitter: {
    title: "DishCraft",
    card: "summary_large_image",
    site: "@T1LTdev",
    creator: "@T1LTdev",
  },
};

export default function RecipesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="w-full flex justify-center px-4 py-12">{children}</div>
      <FloatingAddButton />
    </>
  );
}
