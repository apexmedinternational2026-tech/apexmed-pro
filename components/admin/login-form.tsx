"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { signInAction, type SignInActionState } from "@/lib/actions/admin/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const NOT_AUTHORIZED_MESSAGE = "This account is not authorized for admin access.";

const INITIAL_STATE: SignInActionState = {};

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "";
  const notAuthorized = searchParams.get("error") === "not_authorized";

  const [state, formAction, isPending] = useActionState(signInAction, INITIAL_STATE);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="next" value={next} />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="username" required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>

      {(state.error || notAuthorized) && (
        <p role="alert" className="text-body-sm text-error">
          {state.error ?? NOT_AUTHORIZED_MESSAGE}
        </p>
      )}

      <Button type="submit" variant="primary" size="lg" disabled={isPending} className="w-full">
        {isPending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
