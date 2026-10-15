"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ADMIN_NAV, isActive } from "@/lib/admin/nav";
import { useSession } from "@/lib/admin/session";
import { useAdmin } from "@/lib/admin/store";
import { useMessages } from "@/lib/contact";
import ActionDialog from "./ActionDialog";
import LiveClock from "./LiveClock";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { counts } = useAdmin();
  const { messages } = useMessages();
  const session = useSession();
  const [confirmOut, setConfirmOut] = useState(false);
  const unreadMessages = messages.filter((m) => m.status === "baru").length;

  const badgeFor = (href) =>
    href === "/admin/laporan" ? counts.inbox : href === "/admin/pesan" ? unreadMessages : 0;

  return (
    <aside className="adm-side">
      {/* Ganti dengan <Logo /> dari components/common/Logo.tsx bila cocok dengan latar gelap */}
      <div className="adm-logo">ReOwn</div>
      <LiveClock />
      <div className="adm-who">
        <div className="adm-avatar" aria-hidden>A</div>
        <div>
          Admin
          <small>{session.user?.email}</small>
        </div>
      </div>
      <nav className="adm-nav" aria-label="Menu admin">
        {ADMIN_NAV.map((n) => {
          const badge = badgeFor(n.href);
          return (
            <Link key={n.href} href={n.href} aria-current={isActive(pathname, n.href) ? "page" : undefined}>
              {n.label}
              {badge > 0 && <span className="adm-badge" aria-label={`${badge} baru`}>{badge}</span>}
            </Link>
          );
        })}
      </nav>
      <button type="button" className="adm-logout" onClick={() => setConfirmOut(true)}>Keluar</button>
      {confirmOut && (
        <ActionDialog
          title="Keluar dari akunmu?"
          description="Kamu perlu masuk lagi untuk membuka panel admin."
          confirmLabel="Keluar"
          onConfirm={() => {
            session.logout();
            router.push("/masuk");
          }}
          onClose={() => setConfirmOut(false)}
        />
      )}
    </aside>
  );
}