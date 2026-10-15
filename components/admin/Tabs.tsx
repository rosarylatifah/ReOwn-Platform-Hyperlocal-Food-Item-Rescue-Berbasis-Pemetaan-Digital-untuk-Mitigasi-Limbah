"use client";

interface TabsProps<T extends string> {
  tabs: { id: T; label: string; count?: number }[];
  active: T;
  onChange: (id: T) => void;
}

export default function Tabs<T extends string>({ tabs, active, onChange }: TabsProps<T>) {
  return (
    <div className="adm-tabs" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={t.id === active}
          className="adm-tab"
          onClick={() => onChange(t.id)}
        >
          {t.label}
          {t.count !== undefined && <span className="adm-tab-n">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}
