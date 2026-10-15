"use client";

export default function Tabs({ tabs, active, onChange }) {
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