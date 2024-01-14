"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signUpAction, type SignUpActionData } from "../actions";
import { Loader2 } from "lucide-react";
import { useFormStatus, useFormState } from "react-dom";
import { useEffect, useRef } from "react";
import Link from "next/link";

export default function SignUp() {
  return (
    <div className="flex items-center justify-center h-full">
      <SignUpPage />
    </div>
  );
}

export function SignUpPage({ next }: { next?: string }) {
  return (
    <main className="max-w-sm p-5">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Create Account
      </h2>
      <SignUpForm next={next} />
      <div className="mt-3">
        <span>
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Login
          </Link>
        </span>
      </div>
    </main>
  );
}

function SignUpForm({ next }: { next?: string }) {
  const [state, formAction] = useFormState(signUpAction, {});

  return (
    <form action={formAction}>
      <input type="hidden" name="next" value={next} />
      <SignUpFormFields {...state} />
    </form>
  );
}

function SignUpFormFields({ error }: SignUpActionData) {
  const { pending } = useFormStatus();
  // focus on the input only if there is an error,
  // and there wasn't an error before
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (error && inputRef.current) {
      // only select if the input is not already focused
      if (document.activeElement !== inputRef.current) {
        inputRef.current?.select();
      }
    }
  }, [error]);
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <label className="block text-gray-700 mb-1" htmlFor="new-username">
          Username
        </label>
        <Input
          className="w-full text-base"
          autoFocus
          autoCapitalize="off"
          id="new-username"
          name="username"
          type="text"
          required
          disabled={pending}
          autoComplete="new-username"
        />

        {error && "fieldErrors" in error && error.fieldErrors.username ? (
          <div className="text-red-500 text-sm">
            {error.fieldErrors.username.map((err) => (
              <p key={err}>{err}</p>
            ))}
          </div>
        ) : null}
      </div>
      <div className="space-y-2">
        <label className="block text-gray-700 mb-1" htmlFor="new-password">
          Password
        </label>
        <Input
          className="w-full text-base"
          id="new-password"
          name="password"
          type="password"
          disabled={pending}
          required
          autoComplete="new-password"
        />

        {error && "fieldErrors" in error && error.fieldErrors.password ? (
          <div className="text-red-500 text-sm">
            {error.fieldErrors.password.map((err) => (
              <p key={err}>{err}</p>
            ))}
          </div>
        ) : null}
      </div>
      <div className="flex gap-2 items-center">
        <Button className="p-0 h-8 px-4" disabled={pending}>
          {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Create Account
        </Button>
        {error && "message" in error && !pending ? (
          <span className="text-red-500 text-sm"> {error.message}</span>
        ) : null}
      </div>
    </div>
  );
}
