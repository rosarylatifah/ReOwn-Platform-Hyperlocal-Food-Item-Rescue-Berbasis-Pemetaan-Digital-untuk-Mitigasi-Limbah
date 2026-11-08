"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";

export default function AdminFrame({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, hydrated } = useAuth();

  const isLoginPage = pathname === "/admin/masuk";
  const allowed = user?.role === "admin";

  useEffect(() => {
    if (!isLoginPage && hydrated && !allowed) router.replace("/admin/masuk");
  }, [isLoginPage, hydrated, allowed, router]);

  // Halaman login: tanpa sidebar dan panel
  if (isLoginPage) return children;

  // Belum terbukti admin: jangan tampilkan apa pun
  if (!hydrated || !allowed) return null;

  return <AdminShell>{children}</AdminShell>;
}