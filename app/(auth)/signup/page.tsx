"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signUpAction, type SignUpActionData } from "../actions";
import { Donut, Eye, EyeOff, Loader2 } from "lucide-react";
import { useFormStatus, useFormState } from "react-dom";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SSOButtons from "@/components/sso-buttons";

export default function SignUp() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUpPage />
    </div>
  );
}

export function SignUpPage({ next }: { next?: string }) {
  return (
    <main className="w-full max-w-md p-8 border rounded-md shadow-sm">
      <div className="flex justify-center items-center gap-1.5 mb-4">
        <Donut className="w-5 h-5" />
        <h1 className="text-lg font-bold text-foreground">DishCraft</h1>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-foreground">
        Create Account
      </h2>
      <SignUpForm next={next} />

      <div className="mt-2 w-full">
        <SSOButtons />
      </div>

      <div className="mt-3">
        <span className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="underline text-foreground">
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
  const [showPassword, setShowPassword] = useState(false);
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
        <label
          className="block text-foreground mb-1 text-sm"
          htmlFor="new-username"
        >
          Username
        </label>
        <Input
          className="w-full text-sm"
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
      <div className="space-y-2 relative">
        <label
          className="block text-foreground mb-1 text-sm"
          htmlFor="new-password"
        >
          Password
        </label>
        <Input
          className="w-full text-sm pr-8"
          id="new-password"
          name="password"
          type={showPassword ? "text" : "password"}
          disabled={pending}
          required
          autoComplete="new-password"
        />
        {showPassword ? (
          <EyeOff
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-foreground h-5 w-5 absolute right-2 top-[1.9rem] cursor-pointer"
            aria-label="hide password"
          />
        ) : (
          <Eye
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-foreground h-5 w-5 absolute right-2 top-[1.9rem] cursor-pointer"
            aria-label="show password"
          />
        )}
        {error && "fieldErrors" in error && error.fieldErrors.password ? (
          <div className="text-red-500 text-sm">
            {error.fieldErrors.password.map((err) => (
              <p key={err}>{err}</p>
            ))}
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-3 items-start">
        {/* <Button className="p-0 h-8 px-4" disabled={pending}> */}
        <Button className="w-full" disabled={pending}>
          {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Sign Up
        </Button>
        {error && "message" in error && !pending ? (
          <span className="text-red-500 text-sm"> {error.message}</span>
        ) : null}
      </div>
    </div>
  );
}
