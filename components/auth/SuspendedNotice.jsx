"use client";

import { useState } from "react";
import { submitAppeal } from "@/lib/admin/persist";

const fmt = (iso) =>
  new Date(iso).toLocaleString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta",
  });

export default function SuspendedNotice({ info, onBack }) {
  const banned = info.status === "banned";
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(info.appealPending);

  const send = () => {
    if (message.trim().length < 10) {
      setError("Jelaskan alasanmu minimal 10 karakter.");
      return;
    }
    const res = submitAppeal({ userId: info.userId, message: message.trim() });
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setSent(true);
    setOpen(false);
  };

  return (
    <div className="space-y-3">
      <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5">
        <p className="text-[15px] font-bold text-red-700">
          {banned ? "Akunmu diblokir permanen." : "Akunmu sedang disuspend."}
        </p>
        {!banned && (
          <p className="mt-1 text-sm font-semibold text-stone-800">
            {info.until ? `Aktif kembali pada ${fmt(info.until)} WIB.` : "Suspend berlaku sampai ada keputusan admin."}
          </p>
        )}
        {info.reason && <p className="mt-1 text-sm text-stone-600">Alasan: {info.reason}</p>}
      </div>

      {sent ? (
        <p role="status" className="rounded-xl bg-green-50 px-3.5 py-2.5 text-sm font-medium text-green-700">
          Bandingmu sudah masuk dan sedang ditinjau admin. Kami akan mengabari lewat email.
        </p>
      ) : open ? (
        <div className="space-y-2">
          <label htmlFor="appeal-msg" className="block text-[13px] font-bold text-stone-900">
            Jelaskan kenapa kamu merasa ini keliru
          </label>
          <textarea
            id="appeal-msg"
            rows={4}
            value={message}
            onChange={(e) => { setMessage(e.target.value); setError(""); }}
            placeholder="Contoh: laporan itu salah paham, pembayaran sudah saya kembalikan."
            className="w-full rounded-xl border border-stone-200 bg-[#FBF9F7] px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#D85834] focus:outline-none focus:ring-2 focus:ring-[#D85834]/30"
          />
          {error && <p role="alert" className="text-xs font-medium text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button type="button" onClick={send} className="flex-1 rounded-xl bg-[#D85834] py-2.5 text-sm font-semibold text-white hover:bg-[#C24A28]">
              Kirim banding
            </button>
            <button type="button" onClick={() => setOpen(false)} className="rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50">
              Batal
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full text-center text-sm font-semibold text-[#E0452A] underline underline-offset-2 hover:text-[#C24A28]"
        >
          Ada kesalahan? Kontak kami
        </button>
      )}

      <button type="button" onClick={onBack} className="w-full text-center text-xs font-semibold text-stone-500 hover:text-stone-800">
        Kembali ke halaman masuk
      </button>
    </div>
  );
}