import type { ReactNode } from "react";

export default function EmptyState({ title, hint, children }: { title: string; hint?: string; children?: ReactNode }) {
  return (
    <div className="adm-empty">
      <b>{title}</b>
      {hint && <p>{hint}</p>}
      {children}
    </div>
  );
}
