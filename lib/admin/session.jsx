"use client";

import { useAuth } from "@/lib/auth";

/** Sesi panel admin: terpisah dari sesi pembeli/penjual. */
export function useSession() {
  const { adminUser, hydrated, adminLogout } = useAuth();
  return {
    ready: hydrated,
    user: adminUser ? { name: adminUser.nama, email: adminUser.email, role: "admin" } : null,
    logout: adminLogout,
  };
}