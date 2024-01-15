"use client";

import { Button } from "@/components/ui/button";
import { Ghost } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
      <h1 className="font-bold text-3xl flex items-center gap-2">
        <Ghost className="h-8 w-8 font-medium" />
        Page Not Found
        <Ghost className="h-8 w-8 font-medium" />
      </h1>
      <p className="text-lg">You seem lost. Want to go home?</p>
      <Button onClick={() => router.back()}>Return To Deliciousness</Button>
    </div>
  );
}
