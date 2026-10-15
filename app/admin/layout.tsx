import type { Metadata } from "next";
import type { ReactNode } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { AdminProvider } from "@/lib/admin/store";
import "./admin.css";

export const metadata: Metadata = {
  title: "Panel Admin | ReOwn",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}
