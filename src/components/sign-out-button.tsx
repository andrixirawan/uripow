"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/modules/auth/auth-client";
import { LogOut } from "lucide-react";

export const SignOutButton = () => {
  return (
    <Button
      variant="destructive"
      onClick={() => signOut()}
      className="flex items-center gap-2"
    >
      <LogOut className="h-4 w-4" />
      Sign Out
    </Button>
  );
};
