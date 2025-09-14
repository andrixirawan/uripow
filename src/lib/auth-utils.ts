import { auth } from "./auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

/**
 * Utility function untuk mengecek authentication dari server
 * @returns session data jika user sudah login
 * @throws redirect ke /sign-in jika user belum login
 */
export async function requireAuth() {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user) {
      redirect("/sign-in");
    }

    return session;
  } catch (error) {
    console.error("Authentication error:", error);
    redirect("/sign-in");
  }
}

/**
 * Utility function untuk mengecek authentication tanpa redirect
 * @returns session data atau null
 */
export async function getSession() {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });
    return session;
  } catch (error) {
    console.error("Session error:", error);
    return null;
  }
}

/**
 * Utility function untuk mengecek apakah user sudah login
 * @returns boolean
 */
export async function isAuthenticated() {
  const session = await getSession();
  return !!session?.user;
}
