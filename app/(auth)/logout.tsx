"use client";

import { Button } from "@/components/ui/button";
import { signOutAction } from "./actions";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

export function Logout({ type }: { type?: "dropdown" | undefined }) {
  return (
    <form action={signOutAction}>
      <LogoutButton type={type} />
    </form>
  );
}

function LogoutButton({ type }: { type?: "dropdown" | undefined }) {
  const { pending } = useFormStatus();

  if (type === "dropdown") {
    return (
      <Button variant="link" className="p-0 h-4" disabled={pending}>
        {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Log Out
      </Button>
    );
  } else {
    return (
      <Button
        className="h-8 px-4 py-5 rounded-full hidden lg:flex"
        disabled={pending}
      >
        {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Log Out
      </Button>
    );
  }
}
