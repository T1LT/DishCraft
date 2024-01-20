"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signInAction, type SignInActionData } from "../actions";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useFormStatus, useFormState } from "react-dom";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoginPage />
    </div>
  );
}

export function LoginPage({ next }: { next?: string }) {
  return (
    <main className="max-w-sm p-8 border rounded-md shadow-sm">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Login</h1>
      <SignInForm next={next} />
      {/* TODO: IMPLEMENT FORGOT PASSWORD FLOW */}
      {/* <div className="mt-3">
        <span className="cursor-default" title="Unimplemented">
          Forgot your password?
        </span>
      </div> */}
      <div className="mt-3">
        <span className="text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline">
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
        <label className="block text-gray-700 mb-1" htmlFor="username">
          Username
        </label>
        <Input
          className="w-full text-base"
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
        <label className="block text-gray-700 mb-1" htmlFor="password">
          Password
        </label>
        <Input
          className="w-full text-base pr-8"
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
            className="text-gray-700 h-5 w-5 absolute right-2 top-[2.125rem] cursor-pointer"
          />
        ) : (
          <Eye
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-gray-700 h-5 w-5 absolute right-2 top-[2.125rem] cursor-pointer"
          />
        )}
      </div>
      <div className="flex flex-col gap-3 items-start">
        <Button className="p-0 h-8 px-4" disabled={pending}>
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
