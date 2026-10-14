"use client";

import { useAdmin } from "@/lib/admin/store";

export default function Toast() {
  const { toast } = useAdmin();
  if (!toast) return null;
  return (
    <div className="adm-toast" role="status" aria-live="polite">
      {toast}
    </div>
  );
}
