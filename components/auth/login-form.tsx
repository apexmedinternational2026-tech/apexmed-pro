"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signInAction, type AuthActionState } from "@/lib/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const LINK_EXPIRED_MESSAGE = "That link has expired or was already used. Please sign in, or reset your password again.";

const INITIAL_STATE: AuthActionState = {};

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "";
  const linkExpired = searchParams.get("error") === "link_expired";

  const [state, formAction, isPending] = useActionState(signInAction, INITIAL_STATE);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="next" value={next} />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="username" required />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link href="/forgot-password" className="text-caption font-medium text-navy-900 underline decoration-navy-900/30 underline-offset-2 hover:decoration-navy-900">
            Forgot password?
          </Link>
        </div>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>

      {(state.error || linkExpired) && (
        <p role="alert" className="text-body-sm text-error">
          {state.error ?? LINK_EXPIRED_MESSAGE}
        </p>
      )}

      <Button type="submit" variant="gold" size="lg" disabled={isPending} className="w-full">
        {isPending ? "Signing in…" : "Sign in"}
      </Button>

      <p className="text-center text-body-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-navy-900 underline decoration-navy-900/30 underline-offset-2 hover:decoration-navy-900">
          Sign up
        </Link>
      </p>
    </form>
  );
}
