"use client";

import { useState } from "react";
import { fmtDateTime } from "@/lib/admin/format";
import { ADMIN } from "@/lib/admin/store";
import {
  KIND_LABEL, replyTo, setMessageStatus, useMessages,
} from "@/lib/contact";
import Modal from "./Modal";
import StatusChip from "./StatusChip";
import UserCell from "./UserCell";

export const KIND_TONE = { pertanyaan: "info", saran: "ok", kendala: "warn" };
export const STATUS_TONE = { baru: "warn", dibaca: "muted", dibalas: "ok", selesai: "muted" };
export const ADMIN_STATUS_LABEL = {
  baru: "Baru", dibaca: "Dibaca", dibalas: "Dibalas", selesai: "Selesai",
};

/** Detail satu pesan: isi, balasan admin (tampil ke pengguna di halaman Hubungi), dan penutupan. */
export default function MessageDetailModal({ messageId, onClose }) {
  const { messages } = useMessages();
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const m = messages.find((x) => x.id === messageId);
  if (!m) return null;
  const closed = m.status === "selesai";

  const send = () => {
    if (text.trim().length < 3) {
      setError("Tulis balasan terlebih dahulu.");
      return;
    }
    replyTo(m.id, text, ADMIN.name);
    setText("");
    setError("");
  };

  return (
    <Modal
      title="Detail pesan"
      onClose={onClose}
      wide
      footer={
        closed ? (
          <>
            <button type="button" className="adm-btn" onClick={onClose}>Tutup</button>
            <button type="button" className="adm-btn" onClick={() => setMessageStatus(m.id, m.reply ? "dibalas" : "dibaca")}>Buka kembali</button>
          </>
        ) : (
          <>
            <button type="button" className="adm-btn" onClick={() => { setMessageStatus(m.id, "selesai"); onClose(); }}>Tandai selesai</button>
            <button type="button" className="adm-btn adm-btn--primary" onClick={send}>
              {m.reply ? "Kirim balasan lagi" : "Kirim balasan"}
            </button>
          </>
        )
      }
    >
      <dl className="adm-dl">
        <dt>Nomor pesan</dt><dd>{m.id}</dd>
        <dt>Waktu</dt><dd>{fmtDateTime(m.createdAt)} WIB</dd>
        <dt>Pengirim</dt><dd><UserCell username={m.userName} email={m.userEmail} /></dd>
        <dt>Jenis</dt><dd><StatusChip tone={KIND_TONE[m.kind]}>{KIND_LABEL[m.kind]}</StatusChip></dd>
        <dt>Status</dt><dd><StatusChip tone={STATUS_TONE[m.status]}>{ADMIN_STATUS_LABEL[m.status]}</StatusChip></dd>
        <dt>Subjek</dt><dd>{m.subject}</dd>
      </dl>

      <section className="adm-sec">
        <h3>Isi pesan</h3>
        <p className="adm-msgbody">{m.body}</p>
      </section>

      {m.reply && (
        <section className="adm-sec">
          <h3>Balasan terakhir ({m.reply.by}, {fmtDateTime(m.reply.at)} WIB)</h3>
          <p className="adm-msgbody">{m.reply.text}</p>
        </section>
      )}

      {!closed && (
        <div className="adm-field">
          <label htmlFor="adm-reply">Balasan untuk pengguna</label>
          <textarea
            id="adm-reply" rows={4} value={text}
            placeholder="Tulis balasan. Pengguna akan melihatnya di halaman Hubungi."
            aria-invalid={error ? true : undefined}
            onChange={(e) => { setText(e.target.value); setError(""); }}
          />
          {error && <div className="adm-err" role="alert">{error}</div>}
        </div>
      )}
    </Modal>
  );
}