"use client";

import { useState } from "react";
import Modal from "./Modal";

/** Deretan thumbnail bukti (bisa lebih dari satu). Klik untuk memperbesar, ada tombol sebelumnya/berikutnya. */
export default function EvidenceGallery({
  urls, label, emptyText = "Tanpa bukti",
}: { urls: string[]; label: string; emptyText?: string }) {
  const [idx, setIdx] = useState<number | null>(null);
  if (urls.length === 0) return <span className="adm-muted">{emptyText}</span>;

  return (
    <>
      <div className="adm-evgal">
        {urls.map((u, i) => (
          <button
            key={i}
            type="button"
            className="adm-evidence"
            aria-label={`Perbesar ${label} ${i + 1} dari ${urls.length}`}
            onClick={() => setIdx(i)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={u} alt="" />
          </button>
        ))}
      </div>
      {idx !== null && (
        <Modal
          title={`${label} (${idx + 1} dari ${urls.length})`}
          onClose={() => setIdx(null)}
          wide
          footer={
            urls.length > 1 ? (
              <>
                <button type="button" className="adm-btn" onClick={() => setIdx((idx - 1 + urls.length) % urls.length)}>Sebelumnya</button>
                <button type="button" className="adm-btn" onClick={() => setIdx((idx + 1) % urls.length)}>Berikutnya</button>
              </>
            ) : undefined
          }
        >
          <div className="adm-evidence-big">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={urls[idx]} alt={`${label} ${idx + 1}`} />
          </div>
        </Modal>
      )}
    </>
  );
}