"use client";

import { useAuth } from "@/lib/auth";

/** Sesi panel admin: satu sumber dengan login (lib/auth). */
export function useSession() {
  const { user, hydrated, logout } = useAuth();
  return {
    ready: hydrated,
    user: user
      ? { name: user.nama, email: user.email, role: user.role === "admin" ? "admin" : "user" }
      : null,
    logout,
  };
}