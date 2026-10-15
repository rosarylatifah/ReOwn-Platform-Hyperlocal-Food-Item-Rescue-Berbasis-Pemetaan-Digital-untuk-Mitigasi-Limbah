"use client";

import { useAuth } from "@/lib/auth";
import { useSyncExternalStore } from "react";

/* ============================================================================
   PESAN DARI HALAMAN HUBUNGI  ->  PANEL ADMIN

   File ini adalah PENGGANTI BACKEND sementara: pesan disimpan di localStorage
   browser, jadi hanya terlihat oleh admin yang membuka panel di browser yang sama.
   Saat backend siap, ganti isi fungsi di bagian "Penyimpanan" dengan panggilan API
   (mis. POST /api/pesan, GET /api/admin/pesan, PATCH /api/admin/pesan/:id).
   Komponen UI tidak perlu diubah. Server HARUS memeriksa bahwa pengirim sudah login.
   ============================================================================ */

export type MessageKind = "pertanyaan" | "saran" | "kendala";
export type MessageStatus = "baru" | "dibaca" | "dibalas" | "selesai";

export interface ContactMessage {
  id: string;
  createdAt: string; // ISO
  userName: string;
  userEmail: string;
  kind: MessageKind;
  subject: string;
  body: string;
  status: MessageStatus;
  reply?: { text: string; at: string; by: string };
}

export interface ContactUser {
  name: string;
  email: string;
}

export const KIND_LABEL: Record<MessageKind, string> = {
  pertanyaan: "Pertanyaan",
  saran: "Saran",
  kendala: "Kendala",
};
export const KIND_HINT: Record<MessageKind, string> = {
  pertanyaan: "Ada yang ingin kamu ketahui",
  saran: "Ide untuk membuat ReOwn lebih baik",
  kendala: "Ada yang tidak berjalan semestinya",
};
export const STATUS_LABEL: Record<MessageStatus, string> = {
  baru: "Terkirim",
  dibaca: "Dibaca admin",
  dibalas: "Sudah dibalas",
  selesai: "Selesai",
};
export const MAX_BODY = 2000;

/* ------------------------------- Penyimpanan ------------------------------- */
const KEY = "reown_contact_messages";
const EVT = "reown:contact-messages";
const EMPTY: ContactMessage[] = [];
let cacheRaw: string | null = null;
let cacheVal: ContactMessage[] = EMPTY;

function read(): ContactMessage[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === cacheRaw) return cacheVal;
    cacheRaw = raw;
    cacheVal = raw ? (JSON.parse(raw) as ContactMessage[]) : EMPTY;
    return cacheVal;
  } catch {
    return EMPTY;
  }
}

function write(list: ContactMessage[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* penyimpanan penuh atau diblokir */
  }
  window.dispatchEvent(new Event(EVT));
}

function update(id: string, fn: (m: ContactMessage) => ContactMessage) {
  write(read().map((m) => (m.id === id ? fn(m) : m)));
}

function subscribe(cb: () => void) {
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

/** Dipanggil dari halaman Hubungi. Pengirim wajib sudah login (dicek di UI, ulangi di server). */
export function sendMessage(
  input: { kind: MessageKind; subject: string; body: string },
  user: ContactUser,
): ContactMessage {
  const msg: ContactMessage = {
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
export function markRead(id: string) {
  update(id, (m) => (m.status === "baru" ? { ...m, status: "dibaca" } : m));
}
export function replyTo(id: string, text: string, by: string) {
  update(id, (m) => ({ ...m, status: "dibalas", reply: { text: text.trim(), at: new Date().toISOString(), by } }));
}
export function setMessageStatus(id: string, status: MessageStatus) {
  update(id, (m) => ({ ...m, status }));
}

/* ------------------------------ Sesi pengguna ------------------------------ */
/** Membaca user yang sedang login dari lib/auth.tsx (AuthProvider harus membungkus halaman). */
export function useContactUser(): { ready: boolean; user: ContactUser | null } {
  const { user, hydrated } = useAuth();
  return {
    ready: hydrated,
    user: user ? { name: user.nama, email: user.email } : null,
  };
}