import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
      <h1 className="font-bold text-3xl flex items-center gap-2">
        <Ghost className="h-8 w-8 font-medium" />
        Page Not Found
        <Ghost className="h-8 w-8 font-medium" />
      </h1>
      <p className="text-lg">You seem lost. Want to go home?</p>
      <Button asChild>
        <Link href="/">Return To Deliciousness</Link>
      </Button>
    </div>
  );
}
