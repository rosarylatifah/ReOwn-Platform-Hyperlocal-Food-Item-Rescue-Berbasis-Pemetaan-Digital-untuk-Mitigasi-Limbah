"use client";

import { useAuth } from "@/lib/auth";
import { useSyncExternalStore } from "react";

/* ============================================================================
   PESAN DARI HALAMAN HUBUNGI  ->  PANEL ADMIN

   File ini adalah PENGGANTI BACKEND sementara: pesan disimpan di localStorage
   browser, jadi hanya terlihat oleh admin yang membuka panel di browser yang sama.
   ============================================================================ */

export const KIND_LABEL = {
  pertanyaan: "Pertanyaan",
  saran: "Saran",
  kendala: "Kendala",
};

export const KIND_HINT = {
  pertanyaan: "Ada yang ingin kamu ketahui",
  saran: "Ide untuk membuat ReOwn lebih baik",
  kendala: "Ada yang tidak berjalan semestinya",
};

export const STATUS_LABEL = {
  baru: "Terkirim",
  dibaca: "Dibaca admin",
  dibalas: "Sudah dibalas",
  selesai: "Selesai",
};

export const MAX_BODY = 2000;

/* ------------------------------- Penyimpanan ------------------------------- */
const KEY = "reown_contact_messages";
const EVT = "reown:contact-messages";
const EMPTY = [];
let cacheRaw = null;
let cacheVal = EMPTY;

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === cacheRaw) return cacheVal;
    cacheRaw = raw;
    cacheVal = raw ? JSON.parse(raw) : EMPTY;
    return cacheVal;
  } catch {
    return EMPTY;
  }
}

function write(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* penyimpanan penuh atau diblokir */
  }
  window.dispatchEvent(new Event(EVT));
}

function update(id, fn) {
  write(read().map((m) => (m.id === id ? fn(m) : m)));
}

function subscribe(cb) {
  window.addEventListener("storage", cb);
  window.addEventListener(EVT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(EVT, cb);
  };
}

/** Daftar semua pesan (terbaru di atas), selalu sinkron antar halaman dan tab. */
export function useMessages() {
  const messages = useSyncExternalStore(subscribe, read, () => EMPTY);
  return { messages };
}

/** Dipanggil dari halaman Hubungi. Pengirim wajib sudah login. */
export function sendMessage(input, user) {
  const msg = {
    id: "P" + Math.random().toString(36).slice(2, 8).toUpperCase(),
    createdAt: new Date().toISOString(),
    userName: user.name,
    userEmail: user.email,
    kind: input.kind,
    subject: input.subject.trim(),
    body: input.body.trim(),
    status: "baru",
  };
  write([msg, ...read()]);
  return msg;
}

/** Dipanggil dari panel admin. */
export function markRead(id) {
  update(id, (m) => (m.status === "baru" ? { ...m, status: "dibaca" } : m));
}

export function replyTo(id, text, by) {
  update(id, (m) => ({
    ...m,
    status: "dibalas",
    reply: { text: text.trim(), at: new Date().toISOString(), by },
  }));
}

export function setMessageStatus(id, status) {
  update(id, (m) => ({ ...m, status }));
}

/* ------------------------------ Sesi pengguna ------------------------------ */
/** Membaca user yang sedang login dari lib/auth.jsx. */
export function useContactUser() {
  const { user, hydrated } = useAuth();
  return {
    ready: hydrated,
    user: user ? { name: user.nama, email: user.email } : null,
  };
}