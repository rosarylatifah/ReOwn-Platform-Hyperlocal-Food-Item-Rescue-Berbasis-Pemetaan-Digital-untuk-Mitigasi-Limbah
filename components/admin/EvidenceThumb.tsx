"use client";

import { useState } from "react";
import Modal from "./Modal";

/** Thumbnail bukti laporan; klik untuk memperbesar. */
export default function EvidenceThumb({ url, label }: { url?: string; label: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="adm-evidence" aria-label={"Perbesar bukti: " + label} onClick={() => setOpen(true)}>
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" />
        ) : (
          <span aria-hidden>🖼️</span>
        )}
      </button>
      {open && (
        <Modal title="Bukti laporan" onClose={() => setOpen(false)} wide>
          <div className="adm-evidence-big">
            {url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={url} alt={label} />
            ) : (
              <p className="adm-muted">Belum ada berkas bukti terlampir pada data contoh ini.</p>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
