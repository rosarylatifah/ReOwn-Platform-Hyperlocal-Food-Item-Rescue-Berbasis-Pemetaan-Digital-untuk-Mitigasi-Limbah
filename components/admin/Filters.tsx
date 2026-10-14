"use client";

import type { ReactNode } from "react";

export function Toolbar({ children }: { children: ReactNode }) {
  return <div className="adm-toolbar">{children}</div>;
}

export function SearchInput({
  value, onChange, placeholder,
}: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <input
      type="search"
      className="adm-input"
      value={value}
      placeholder={placeholder}
      aria-label={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function SelectFilter({
  value, onChange, label, options,
}: { value: string; onChange: (v: string) => void; label: string; options: { value: string; label: string }[] }) {
  return (
    <select className="adm-select" value={value} aria-label={label} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export function DateFilter({
  value, onChange, label,
}: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <label className="adm-datef">
      <span>{label}</span>
      <input type="date" className="adm-input" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
