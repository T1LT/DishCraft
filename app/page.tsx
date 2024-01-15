import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <div>
          <h1 className="p-2 text-center font-extrabold tracking-tight text-5xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-br from-red-500 to-yellow-400">
            What will you cook next?
          </h1>
        </div>
      </main>
    </>
  );
}
