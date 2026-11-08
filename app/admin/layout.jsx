import AdminFrame from "@/components/admin/AdminFrame";
import { AdminProvider } from "@/lib/admin/store";
import { NotificationProvider } from "@/app/context/notification";
import "./admin.css";

export const metadata = {
  title: "Panel Admin | ReOwn",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return (
    <NotificationProvider>
      <AdminProvider>
        <AdminFrame>{children}</AdminFrame>
      </AdminProvider>
    </NotificationProvider>
  );
}