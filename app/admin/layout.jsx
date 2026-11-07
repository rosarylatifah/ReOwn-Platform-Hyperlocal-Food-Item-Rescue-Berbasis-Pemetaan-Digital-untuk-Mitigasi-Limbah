import AdminShell from "@/components/admin/AdminShell";
import { AdminProvider } from "@/lib/admin/store";
import { NotificationProvider } from "@/app/context/notification"; // 👈 1. Import NotificationProvider kamu
import "./admin.css";

export const metadata = {
  title: "Panel Admin | ReOwn",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return (
    <NotificationProvider> {/* 👈 2. Bungkus paling luar di dalam AdminLayout */}
      <AdminProvider>
        <AdminShell>{children}</AdminShell>
      </AdminProvider>
    </NotificationProvider>
  );
}