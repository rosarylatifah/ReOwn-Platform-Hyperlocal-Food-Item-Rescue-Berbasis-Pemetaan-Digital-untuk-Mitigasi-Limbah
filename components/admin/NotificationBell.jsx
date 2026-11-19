"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { fmtDateTime } from "@/lib/admin/format";
import { useAdmin } from "@/lib/admin/store";
import { KIND_LABEL, useMessages } from "@/lib/contact";

const READ_KEY = "reown:admin-notif-read:v1";
const DAY = 86_400_000;
const KEEP_READ_DAYS = 30; // yang sudah dibaca disembunyikan setelah 30 hari

const CATS = [
  { id: "semua", label: "Semua" },
  { id: "laporan", label: "Laporan" },
  { id: "pesan", label: "Pesan" },
  { id: "produk", label: "Produk" },
  { id: "pengguna", label: "Pengguna" },
];
const CAT_LABEL = Object.fromEntries(CATS.map((c) => [c.id, c.label]));

const STATUS = [
  { id: "semua", label: "Semua" },
  { id: "belum", label: "Belum dibaca" },
  { id: "sudah", label: "Sudah dibaca" },
];

const EMPTY = {
  semua: "Belum ada notifikasi.",
  belum: "Semua sudah dibaca.",
  sudah: "Belum ada notifikasi yang dibaca.",
};

// Aktivitas lama tanpa field category ditebak dari isinya
const catOf = (a) => a.category ?? (a.refs?.reportId || a.refs?.appealId ? "laporan" : "pengguna");

function loadRead() {
  try {
    const v = JSON.parse(localStorage.getItem(READ_KEY));
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

function timeAgo(iso, now) {
  const min = Math.floor((now - new Date(iso).getTime()) / 60_000);
  if (min < 1) return "Baru saja";
  if (min < 60) return `${min} menit lalu`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} jam lalu`;
  const d = Math.floor(hr / 24);
  if (d === 1) return "Kemarin";
  if (d < 7) return `${d} hari lalu`;
  return `${fmtDateTime(iso)} WIB`;
}

const pill = (on, small) => ({
  fontSize: small ? "11px" : "12px",
  fontWeight: 600,
  padding: small ? "3px 9px" : "5px 10px",
  borderRadius: "999px",
  cursor: "pointer",
  whiteSpace: "nowrap",
  border: on ? "1px solid #D95A36" : "1px solid #E5E5E5",
  background: on ? "#FFF3ED" : "#fff",
  color: on ? "#D95A36" : "#555",
});

export default function NotificationBell() {
  const router = useRouter();
  const { activities } = useAdmin();
  const { messages } = useMessages();
  const [open, setOpen] = useState(false);
  const [cat, setCat] = useState("semua");
  const [status, setStatus] = useState("semua");
  const [readIds, setReadIds] = useState([]);
  const [now, setNow] = useState(() => Date.now());
  const box = useRef(null);

  useEffect(() => {
    setReadIds(loadRead());
    const onStorage = (e) => {
      if (e.key === READ_KEY) setReadIds(loadRead());
    };
    window.addEventListener("storage", onStorage);
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(t);
    };
  }, []);

  const persist = (ids) => {
    const next = Array.from(new Set(ids));
    setReadIds(next);
    try {
      localStorage.setItem(READ_KEY, JSON.stringify(next));
    } catch {}
  };

  // Sumber: aktivitas pengguna (laporan, banding, produk, akun baru) + pesan dari halaman Hubungi
  const items = useMemo(() => {
    const read = new Set(readIds);
    const fromActivities = activities
      .filter((a) => a.actorKind === "pengguna")
      .map((a) => ({ id: a.id, cat: catOf(a), text: a.text, actor: a.actor, at: a.at, href: a.href, seen: false }));
    const fromMessages = messages.map((m) => ({
      id: "msg-" + m.id,
      cat: "pesan",
      text: `Pesan ${(KIND_LABEL[m.kind] ?? "baru").toLowerCase()} baru: ${m.subject}`,
      actor: m.userName,
      at: m.createdAt,
      href: "/admin/pesan",
      seen: m.status !== "baru", // sudah dibuka di halaman Pesan Masuk
    }));
    return [...fromActivities, ...fromMessages]
      .map((n) => ({ ...n, unread: !n.seen && !read.has(n.id) }))
      .filter((n) => n.unread || now - new Date(n.at).getTime() <= KEEP_READ_DAYS * DAY)
      .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  }, [activities, messages, readIds, now]);

  const unreadCount = items.filter((n) => n.unread).length;
  const unreadBy = (id) => items.filter((n) => n.unread && (id === "semua" || n.cat === id)).length;

  const inCat = items.filter((n) => cat === "semua" || n.cat === cat);
  const shown = inCat.filter((n) => (status === "belum" ? n.unread : status === "sudah" ? !n.unread : true));

  const markAll = () => persist([...readIds, ...inCat.map((n) => n.id)]);

  const openItem = (n) => {
    if (n.unread) persist([...readIds, n.id]);
    setOpen(false);
    if (n.href) router.push(n.href);
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (box.current && !box.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="adm-bell-wrap" ref={box} style={{ position: "relative" }}>
      <button
        type="button"
        className="adm-bell"
        aria-label={`Notifikasi, ${unreadCount} belum dibaca`}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        style={{ position: "relative", cursor: "pointer", background: "none", border: "none" }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" />
        </svg>
        {unreadCount > 0 && <span className="adm-bell-dot">{unreadCount}</span>}
      </button>

      {open && (
        <div
          className="adm-notif"
          role="dialog"
          aria-label="Notifikasi"
          style={{ position: "absolute", right: 0, top: "40px", width: "440px", maxWidth: "92vw", background: "#fff", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", zIndex: 999, padding: "14px" }}
        >
          <div role="tablist" aria-label="Kategori notifikasi" style={{ display: "flex", flexWrap: "wrap", gap: "6px", paddingBottom: "10px", marginBottom: "10px", borderBottom: "1px solid #EDEDED" }}>
            {CATS.map((c) => {
              const n = unreadBy(c.id);
              return (
                <button key={c.id} type="button" role="tab" aria-selected={cat === c.id} onClick={() => setCat(c.id)} style={pill(cat === c.id)}>
                  {c.label}
                  {n > 0 ? ` (${n})` : ""}
                </button>
              );
            })}
          </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <div role="group" aria-label="Status baca" style={{ display: "flex", gap: "5px" }}>
              {STATUS.map((s) => (
                <button key={s.id} type="button" aria-pressed={status === s.id} onClick={() => setStatus(s.id)} style={pill(status === s.id, true)}>
                  {s.label}
                </button>
              ))}
            </div>
            {unreadBy(cat) > 0 && (
              <button
                type="button"
                onClick={markAll}
                style={{ fontSize: "11px", color: "#D95A36", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
              >
                Tandai dibaca
              </button>
            )}
          </div>

          {shown.length === 0 ? (
            <p className="adm-notif-empty" style={{ textAlign: "center", color: "#888", fontSize: "13px", padding: "20px 0" }}>
              {EMPTY[status]}
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "320px", overflowY: "auto" }}>
              {shown.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => openItem(n)}
                  className="adm-notif-item"
                  style={{
                    textAlign: "left",
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    background: n.unread ? "#FFF8F6" : "#FFFFFF",
                    border: "none",
                    borderBottom: "1px solid #F0F0F0",
                    cursor: "pointer",
                  }}
                >
                  <p style={{ margin: "0 0 4px 0", fontSize: "13px", fontWeight: n.unread ? 700 : 500, color: "#1A1A1A" }}>
                    {n.unread && (
                      <span aria-hidden style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#D95A36", marginRight: 6 }} />
                    )}
                    {n.text}
                  </p>
                  <small style={{ fontSize: "11px", color: "#888" }}>
                    {cat === "semua" && <b style={{ color: "#D95A36", fontWeight: 600 }}>{CAT_LABEL[n.cat]} · </b>}
                    @{n.actor} · {timeAgo(n.at, now)}
                  </small>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}