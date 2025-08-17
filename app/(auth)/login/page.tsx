"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signInAction, type SignInActionData } from "../actions";
import { Donut, Eye, EyeOff, Loader2 } from "lucide-react";
import { useFormStatus, useFormState } from "react-dom";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SSOButtons from "@/components/sso-buttons";

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoginPage />
    </div>
  );
}

export function LoginPage({ next }: { next?: string }) {
  return (
    <main className="w-full max-w-md p-8 border rounded-md shadow-sm">
      <div className="flex justify-center items-center gap-1.5 mb-4">
        <Donut className="w-5 h-5" />
        <h1 className="text-lg font-bold text-foreground">DishCraft</h1>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-foreground">Login</h2>
      <SignInForm next={next} />

      <div className="mt-2 w-full">
        <SSOButtons />
      </div>

      {/* TODO: IMPLEMENT FORGOT PASSWORD FLOW */}
      {/* <div className="mt-3">
        <span className="cursor-default" title="Unimplemented">
          Forgot your password?
        </span>
      </div> */}
      <div className="mt-3">
        <span className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline text-foreground">
            Sign Up
          </Link>
        </span>
      </div>
    </main>
  );
}

function SignInForm({ next }: { next?: string }) {
  const [state, formAction] = useFormState(signInAction, {});

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="next" value={next} />
      <SignInFormFields {...state} />
    </form>
  );
}

function SignInFormFields({ error }: SignInActionData) {
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
          htmlFor="username"
        >
          Username
        </label>
        <Input
          className="w-full text-sm"
          autoFocus
          ref={inputRef}
          autoCapitalize="off"
          id="username"
          type="text"
          name="username"
          disabled={pending}
          autoComplete="username"
          required
        />
      </div>
      <div className="space-y-2 relative">
        <label
          className="block text-foreground mb-1 text-sm"
          htmlFor="password"
        >
          Password
        </label>
        <Input
          className="w-full text-sm pr-8"
          id="password"
          type={showPassword ? "text" : "password"}
          name="password"
          disabled={pending}
          autoComplete="current-password"
          required
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
      </div>
      <div className="flex flex-col gap-3 items-start">
        {/* <Button className="p-0 h-8 px-4" disabled={pending}> */}
        <Button className="w-full" disabled={pending}>
          {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Login
        </Button>
        {error && !pending ? (
          <span className="text-red-500 text-sm"> {error.message}</span>
        ) : null}
      </div>
    </div>
  );
}
