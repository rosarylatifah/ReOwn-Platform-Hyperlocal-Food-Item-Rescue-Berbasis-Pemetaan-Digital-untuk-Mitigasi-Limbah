import type { ReactNode } from "react";
import type { Tone } from "@/lib/admin/labels";

export default function StatusChip({ tone, children }: { tone: Tone; children: ReactNode }) {
  return <span className={"adm-chip adm-chip--" + tone}>{children}</span>;
}
