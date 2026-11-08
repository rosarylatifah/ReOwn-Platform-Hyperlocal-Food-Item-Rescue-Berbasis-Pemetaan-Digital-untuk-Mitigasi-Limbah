"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function AdminGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, hydrated } = useAuth();

  const isLoginPage = pathname === "/admin/masuk";
  const allowed = user?.role === "admin";

  useEffect(() => {
    if (!isLoginPage && hydrated && !allowed) router.replace("/admin/masuk");
  }, [isLoginPage, hydrated, allowed, router]);

  if (isLoginPage) return children;
  if (!hydrated || !allowed) return null; // cegah konten admin sempat tampil
  return children;
}