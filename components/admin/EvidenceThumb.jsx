"use client";

export default function EvidenceThumb({ url, label = "Bukti" }) {
  if (!url) return <span className="adm-muted">-</span>;
  return (
    <a href={url} target="_blank" rel="noreferrer" aria-label={`Lihat bukti: ${label}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={label}
        style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 8 }}
      />
    </a>
  );
}