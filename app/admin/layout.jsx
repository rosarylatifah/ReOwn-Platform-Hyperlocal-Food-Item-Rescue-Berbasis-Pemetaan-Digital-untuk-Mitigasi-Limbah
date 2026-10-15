import AdminShell from "@/components/admin/AdminShell";
import { AdminProvider } from "@/lib/admin/store";
import "./admin.css";

export const metadata = {
  title: "Panel Admin | ReOwn",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}