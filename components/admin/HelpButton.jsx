"use client";

import { Fragment, useState } from "react";
import { LEGEND, helpFor } from "@/lib/admin/help";
import Modal from "./Modal";
import StatusChip from "./StatusChip";

/** Tombol “?” di bilah atas: penjelasan halaman + arti semua status. */
export default function HelpButton({ pathname }) {
  const [open, setOpen] = useState(false);
  const help = helpFor(pathname);

  return (
    <>
      <button type="button" className="adm-bell adm-help" aria-label="Bantuan halaman ini" onClick={() => setOpen(true)}>
        ?
      </button>
      {open && (
        <Modal
          title={"Bantuan: " + help.title}
          onClose={() => setOpen(false)}
          wide
          footer={
            <button type="button" className="adm-btn adm-btn--primary" onClick={() => setOpen(false)}>
              Mengerti
            </button>
          }
        >
          <p className="adm-gap">{help.about}</p>
          <h3 className="adm-h3">Cara memakai</h3>
          <ol className="adm-steps">
            {help.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          {help.tips && (
            <div className="adm-note">
              <b>Tips</b>
              <ul>
                {help.tips.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          )}
          <h3 className="adm-h3">Arti status</h3>
          <dl className="adm-dl">
            {LEGEND.map((l) => (
              <Fragment key={l.term}>
                <dt><StatusChip tone={l.tone}>{l.term}</StatusChip></dt>
                <dd>{l.meaning}</dd>
              </Fragment>
            ))}
          </dl>
        </Modal>
      )}
    </>
  );
}