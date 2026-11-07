"use client";

/** Baris alat di atas tabel (pencarian, filter). */
export function Toolbar({ children }) {
  return <div className="adm-tb">{children}</div>;
}

/** Kolom pencarian. onChange menerima string, bukan event. */
export function SearchInput({ value, onChange, placeholder = "Cari…", label = "Cari" }) {
  return (
    <label className="adm-tb-search">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </svg>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        aria-label={label}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

/** Dropdown filter. options: [{ value, label }]. onChange menerima string. */
export function SelectFilter({ value, onChange, options = [], label = "Filter" }) {
  return (
    <select
      className="adm-tb-select"
      value={value}
      aria-label={label}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

/** Filter tanggal. value berformat "YYYY-MM-DD". onChange menerima string. */
export function DateFilter({ label, value, onChange }) {
  return (
    <label className="adm-tb-date">
      <span>{label}</span>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}