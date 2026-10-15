"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ADMIN_NAV, isActive } from "@/lib/admin/nav";
import { useSession } from "@/lib/admin/session";
import HelpButton from "./HelpButton";
import NotificationBell from "./NotificationBell";
import Sidebar from "./Sidebar";
import Toast from "./Toast";

/** Kerangka semua halaman admin + penjaga akses (hanya role admin). */
export default function AdminShell({ children }) {
  const { user, ready } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const allowed = ready && user?.role === "admin";

  useEffect(() => {
    if (ready && !allowed) router.replace("/masuk");
  }, [ready, allowed, router]);

  if (!allowed) {
    return (
      <div className="adm-root adm-boot" aria-busy="true">
        Memeriksa akses…
      </div>
    );
  }

  const current = ADMIN_NAV.find((n) => isActive(pathname, n.href)) ?? ADMIN_NAV[0];

  return (
    <div className="adm-root">
      <div className="adm-app">
        <Sidebar />
        <main className="adm-main">
          <header className="adm-top">
            <h1 className="adm-title"><span className="adm-mark">{current.title}</span></h1>
            <div className="adm-top-actions">
              <HelpButton pathname={pathname} />
              <NotificationBell />
            </div>
          </header>
          {children}
        </main>
      </div>
      <Toast />
    </div>
  );
}