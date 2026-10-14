"use client";

import { useEffect, useState } from "react";

export interface SessionUser {
  name: string;
  email: string;
  role: "admin" | "user";
}

/**
 * ============ TITIK INTEGRASI DENGAN lib/auth.tsx ============
 * Hook ini satu-satunya tempat panel admin membaca siapa yang sedang login.
 * Ganti isinya dengan auth milik kalian, contoh:
 *
 *   import { useAuth } from "@/lib/auth";
 *   export function useSession() {
 *     const { user, loading, logout } = useAuth();
 *     return {
 *       ready: !loading,
 *       user: user ? { name: user.name, email: user.email, role: user.role === "admin" ? "admin" : "user" } : null,
 *       logout,
 *     };
 *   }
 *
 * Selama belum diganti: di `npm run dev` panel memakai akun admin demo
 * supaya bisa langsung dicoba; di production panel TERKUNCI (redirect ke /masuk).
 *
 * PENTING: guard ini hanya menyembunyikan tampilan. Keamanan sebenarnya harus
 * dicek ulang di server (middleware / route handler / API) setiap ada aksi admin.
 */
const DEMO = process.env.NODE_ENV !== "production";

export function useSession() {
  const [state, setState] = useState<{ ready: boolean; user: SessionUser | null }>({
    ready: false,
    user: null,
  });

  useEffect(() => {
    setState({
      ready: true,
      user: DEMO ? { name: "Admin", email: "admin@reown.org", role: "admin" } : null,
    });
  }, []);

  const logout = () => {
    // panggil logout() dari lib/auth.tsx di sini
  };

  return { ...state, logout };
}
