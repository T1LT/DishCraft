import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[calc(100vh-74px)] flex-col items-center justify-center p-4">
        <div>
          <h1 className="text-center font-extrabold tracking-tight text-5xl lg:text-7xl mb-24">
            What will you cook next?
          </h1>
        </div>
      </main>
    </>
  );
}
