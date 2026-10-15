import Link from "next/link";

interface StatCardProps {
  label: string;
  value: number;
  note: string;
  href: string;
  cta: string;
  hot?: boolean;
}

export default function StatCard({ label, value, note, href, cta, hot }: StatCardProps) {
  return (
    <Link href={href} className={"adm-stat" + (hot ? " adm-stat--hot" : "")}>
      <div className="adm-stat-label">{label}</div>
      <div className="adm-stat-num">{value}</div>
      <div className="adm-stat-note">{note}</div>
      <span className="adm-stat-cta">{cta}</span>
    </Link>
  );
}
