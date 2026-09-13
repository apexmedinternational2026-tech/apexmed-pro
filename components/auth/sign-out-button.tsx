"use client";

import { signOutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { LogoutIcon } from "@/components/ui/icons";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <Button type="submit" variant="ghost" size="sm">
        <LogoutIcon className="h-4 w-4" />
        Sign out
      </Button>
    </form>
  );
}
