import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "./auth";

/**
 * Cek session user di server, redirect ke /sign-in jika tidak login.
 * Return session jika login.
 */
export async function requireAuth() {
  let session = null;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    console.error("Gagal mengambil session user:", error);
  }

  if (!session) {
    redirect("/sign-in");
  }

  return session;
}

/**
 * Cek jika user sudah login, redirect ke /dashboard (untuk halaman sign-in/sign-up)
 */
export async function requireGuest() {
  let session = null;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    console.error("Gagal mengambil session user:", error);
  }

  if (session) {
    redirect("/dashboard");
  }
}
