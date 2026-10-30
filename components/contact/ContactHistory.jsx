"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { fraunces } from "@/lib/fonts";
import {
  KIND_LABEL,
  STATUS_LABEL,
  useContactUser,
  useMessages,
} from "@/lib/contact";

const CHIP = {
  baru: "bg-stone-100 text-stone-700",
  dibaca: "bg-amber-100 text-amber-800",
  dibalas: "bg-emerald-100 text-emerald-800",
  selesai: "bg-stone-800 text-white",
};

function fmt(iso) {
  try {
    return new Date(iso).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return "";
  }
}

/** Dropdown kategori buatan sendiri (menggantikan <select> bawaan browser). */
function CategorySelect({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const current = options.find((o) => o.value === value) ?? options[0];

  // Tutup saat klik di luar
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div
      ref={wrapRef}
      className="relative"
      onKeyDown={(e) => {
        // Esc hanya menutup dropdown, bukan seluruh pop-up
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          setOpen(false);
        }
      }}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex min-w-[170px] items-center justify-between gap-3 rounded-full border-[1.5px] border-stone-800 bg-white py-1.5 pl-4 pr-3 text-sm font-semibold text-stone-900 transition-colors hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D85834]"
      >
        <span>{current.label}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-full z-20 mt-2 min-w-full overflow-hidden rounded-2xl border border-stone-200 bg-white p-1.5 shadow-[0_16px_40px_rgba(120,70,30,0.18)]"
        >
          {options.map((o) => {
            const active = o.value === value;
            return (
              <li key={o.value} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-4 whitespace-nowrap rounded-xl px-3.5 py-2 text-left text-sm transition-colors ${
                    active
                      ? "bg-[#95F57C]/40 font-bold text-stone-900"
                      : "font-medium text-stone-700 hover:bg-orange-50"
                  }`}
                >
                  <span>{o.label}</span>
                  <span className="flex items-center gap-2">
                    <span className="text-xs text-stone-500">{o.count}</span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                      className={active ? "opacity-100" : "opacity-0"}
                    >
                      <path d="m5 12 5 5L20 7" />
                    </svg>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function MessageCard({ m }) {
  return (
    <li className="rounded-2xl border border-stone-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#D85834]">
            {KIND_LABEL[m.kind] ?? m.kind}
          </p>
          <p className="mt-0.5 break-words text-[15px] font-bold text-stone-900">
            {m.subject}
          </p>
          <p className="mt-0.5 text-xs text-stone-500">
            {fmt(m.createdAt)} · #{m.id}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
            CHIP[m.status] ?? CHIP.baru
          }`}
        >
          {STATUS_LABEL[m.status] ?? m.status}
        </span>
      </div>

      <p className="mt-3 whitespace-pre-wrap break-words rounded-xl bg-stone-50 px-3.5 py-3 text-sm leading-relaxed text-stone-800">
        {m.body}
      </p>

      {m.reply ? (
        <div className="mt-3 rounded-xl border-l-4 border-[#95F57C] bg-[#F3FDEF] px-3.5 py-3">
          <p className="text-xs font-semibold text-stone-600">
            Balasan {m.reply.by || "admin"} · {fmt(m.reply.at)}
          </p>
          <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-stone-900">
            {m.reply.text}
          </p>
        </div>
      ) : (
        <p className="mt-3 text-xs italic text-stone-500">
          Belum ada balasan dari admin.
        </p>
      )}
    </li>
  );
}

export default function ContactHistory() {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState("semua");
  const { ready, user } = useContactUser();
  const { messages } = useMessages();

  // Tutup dengan Esc + kunci scroll halaman saat modal terbuka
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!ready || !user) return null;

  const mine = messages.filter((m) => m.userEmail === user.email);
  const shown = kind === "semua" ? mine : mine.filter((m) => m.kind === kind);
  const options = [
    { value: "semua", label: "Semua", count: mine.length },
    ...Object.entries(KIND_LABEL).map(([k, label]) => ({
      value: k,
      label,
      count: mine.filter((m) => m.kind === k).length,
    })),
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-stone-900 px-5 py-2 text-sm font-semibold text-stone-900 transition-all duration-200 hover:-translate-y-0.5 hover:bg-stone-900 hover:text-white active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D85834]"
      >
        Buka riwayat pesan
        <span className="rounded-full bg-[#95F57C] px-2 py-0.5 text-xs text-stone-900">
          {mine.length}
        </span>
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/50 p-4"
            onClick={() => setOpen(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Riwayat pesan"
              onClick={(e) => e.stopPropagation()}
              className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-[#FFF7E9] shadow-2xl"
            >
              <div className="flex items-center justify-between gap-4 border-b border-stone-200 px-6 py-4">
                <div>
                  <h2
                    className={`${fraunces.className} text-xl font-extrabold text-stone-900`}
                  >
                    Riwayat pesan
                  </h2>
                  <p className="text-xs text-stone-500">
                    {shown.length} pesan
                    {kind === "semua" ? " ke admin ReOwn" : ` · ${KIND_LABEL[kind]}`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Tutup"
                  className="flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-stone-800 text-stone-900 transition-colors hover:bg-stone-900 hover:text-white"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    aria-hidden
                  >
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>

              {/* Filter kategori */}
              <div className="flex items-center gap-3 border-b border-stone-200 px-6 py-3">
                <span className="text-xs font-semibold text-stone-600">Kategori</span>
                <CategorySelect value={kind} onChange={setKind} options={options} />
              </div>

              {/* min-h supaya daftar dropdown tidak terpotong saat pesan masih sedikit */}
              <div className="min-h-[220px] overflow-y-auto px-6 py-5">
                {shown.length === 0 ? (
                  <p className="py-10 text-center text-sm text-stone-600">
                    {mine.length === 0
                      ? "Belum ada pesan. Kirim lewat formulir di halaman ini."
                      : `Belum ada pesan kategori ${KIND_LABEL[kind].toLowerCase()}.`}
                  </p>
                ) : (
                  <ul className="flex flex-col gap-4">
                    {shown.map((m) => (
                      <MessageCard key={m.id} m={m} />
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}