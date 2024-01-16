import Navbar from "@/components/navbar";

export default function RecipesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="w-full flex justify-center px-4 py-12">{children}</div>
    </>
  );
}
