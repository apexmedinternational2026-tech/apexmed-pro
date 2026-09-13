"use client";

import { useActionState } from "react";
import { resetPasswordAction, type AuthActionState } from "@/lib/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const INITIAL_STATE: AuthActionState = {};

export function ResetPasswordForm() {
  const [state, formAction, isPending] = useActionState(resetPasswordAction, INITIAL_STATE);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">New password</Label>
        <Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="confirm_password">Confirm new password</Label>
        <Input
          id="confirm_password"
          name="confirm_password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>

      {state.error && (
        <p role="alert" className="text-body-sm text-error">
          {state.error}
        </p>
      )}

      <Button type="submit" variant="gold" size="lg" disabled={isPending} className="w-full">
        {isPending ? "Saving…" : "Set new password"}
      </Button>
    </form>
  );
}
