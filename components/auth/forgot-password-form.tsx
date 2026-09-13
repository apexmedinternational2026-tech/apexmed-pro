"use client";

import { useActionState } from "react";
import Link from "next/link";
import { forgotPasswordAction, type AuthActionState } from "@/lib/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const INITIAL_STATE: AuthActionState = {};

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, INITIAL_STATE);

  if (state.message) {
    return (
      <p role="status" className="rounded-2xl border border-navy-800/10 bg-white p-6 text-body-md text-ink-900">
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="username" required />
      </div>

      {state.error && (
        <p role="alert" className="text-body-sm text-error">
          {state.error}
        </p>
      )}

      <Button type="submit" variant="gold" size="lg" disabled={isPending} className="w-full">
        {isPending ? "Sending…" : "Send reset link"}
      </Button>

      <p className="text-center text-body-sm text-slate-500">
        <Link
          href="/login"
          className="font-medium text-navy-900 underline decoration-navy-900/30 underline-offset-2 hover:decoration-navy-900"
        >
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
