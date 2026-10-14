"use client";

import { useState, type ReactNode } from "react";
import Modal from "./Modal";

export interface Option {
  value: string;
  label: string;
}

interface ActionDialogProps {
  title: string;
  description?: ReactNode;
  confirmLabel: string;
  danger?: boolean;
  optionLabel?: string;
  options?: Option[];
  noteLabel?: string;
  noteRequired?: boolean;
  notePlaceholder?: string;
  onConfirm: (result: { value: string; note: string }) => void;
  onClose: () => void;
}

/**
 * Dialog konfirmasi serba guna. Dipakai untuk: keluar, turunkan produk, pulihkan,
 * terima/tolak laporan, terima/tolak banding, suspend/ban akun.
 * - `options`  -> dropdown pilihan (alasan / jenis sanksi)
 * - `noteLabel` -> kolom catatan (wajib bila noteRequired)
 */
export default function ActionDialog({
  title, description, confirmLabel, danger, optionLabel, options,
  noteLabel, noteRequired, notePlaceholder, onConfirm, onClose,
}: ActionDialogProps) {
  const [value, setValue] = useState(options?.[0]?.value ?? "");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    if (noteLabel && noteRequired && !note.trim()) {
      setError("Isi " + noteLabel.toLowerCase() + " terlebih dahulu.");
      return;
    }
    onConfirm({ value, note: note.trim() });
    onClose();
  };

  return (
    <Modal
      title={title}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="adm-btn" onClick={onClose}>Batal</button>
          <button type="button" className={"adm-btn " + (danger ? "adm-btn--danger" : "adm-btn--primary")} onClick={submit}>
            {confirmLabel}
          </button>
        </>
      }
    >
      {description && <p className="adm-muted adm-gap">{description}</p>}
      {options && (
        <div className="adm-field">
          <label htmlFor="adm-opt">{optionLabel ?? "Pilihan"}</label>
          <select id="adm-opt" value={value} onChange={(e) => setValue(e.target.value)}>
            {options.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      )}
      {noteLabel && (
        <div className="adm-field">
          <label htmlFor="adm-note">{noteLabel}{noteRequired ? "" : " (opsional)"}</label>
          <textarea
            id="adm-note"
            rows={3}
            value={note}
            placeholder={notePlaceholder}
            aria-invalid={error ? true : undefined}
            onChange={(e) => { setNote(e.target.value); setError(""); }}
          />
          {error && <div className="adm-err" role="alert">{error}</div>}
        </div>
      )}
    </Modal>
  );
}
