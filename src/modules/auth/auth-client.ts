import { createAuthClient } from "better-auth/react";
import { config } from "../../lib/env";

export const authClient = createAuthClient({
  baseURL: config.next.appUrl,
});

export const { signIn, signOut, signUp, useSession } = authClient;
