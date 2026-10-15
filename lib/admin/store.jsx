"use client";

import { createContext, useContext, useRef, useState } from "react";
import { seedActivities, seedAppeals, seedProducts, seedReports, seedUsers } from "./data";
import { SANCTION_LABEL } from "./labels";

export const ADMIN = { name: "Admin", email: "admin@reown.org" };

const uid = () => Math.random().toString(36).slice(2, 9);
const nowISO = () => new Date().toISOString();

const Ctx = createContext(null);

export function useAdmin() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAdmin harus dipakai di dalam <AdminProvider>");
  return v;
}

export function AdminProvider({ children }) {
  const [products, setProducts] = useState(seedProducts);
  const [users, setUsers] = useState(seedUsers);
  const [reports, setReports] = useState(seedReports);
  const [appeals, setAppeals] = useState(seedAppeals);
  const [activities, setActivities] = useState(seedActivities);
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  const notify = (msg) => {
    setToast(msg);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 3200);
  };

  const log = (text, href, refs, note) =>
    setActivities((p) => [
      { id: uid(), at: nowISO(), actor: ADMIN.name, actorEmail: ADMIN.email, actorKind: "admin", text, status: "Selesai", href, refs, note: note || undefined },
      ...p,
    ]);

  const getUser = (id) => users.find((u) => u.id === id);
  const getProduct = (id) => products.find((p) => p.id === id);
  const handle = (id) => getUser(id)?.username ?? "pengguna";

  /* ---------- helper internal (tanpa log) ---------- */
  const removeProducts = (match, reason, source) =>
    setProducts((prev) =>
      prev.map((p) =>
        p.status === "aktif" && match(p)
          ? { ...p, status: "diturunkan", removal: { reason, by: ADMIN.name, at: nowISO(), source } }
          : p,
      ),
    );

  const applyUserStatus = (id, status, reason) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id !== id
          ? u
          : {
              ...u,
              status,
              warnings: status === "peringatan" ? u.warnings + 1 : u.warnings,
              sanction: status === "aktif" ? undefined : { reason, at: nowISO() },
            },
      ),
    );
    if (status === "suspend" || status === "banned") {
      removeProducts(
        (p) => p.sellerId === id,
        status === "banned" ? "Akun diban" : "Akun disuspend",
        status === "banned" ? "ban" : "akun",
      );
    }
    if (status === "aktif") {
      setProducts((prev) =>
        prev.map((p) =>
          p.sellerId === id && p.removal?.source === "akun" ? { ...p, status: "aktif", removal: undefined } : p,
        ),
      );
    }
  };

  /* ---------- produk ---------- */
  const takedownProduct = (id, reason) => {
    const p = getProduct(id);
    if (!p || p.status !== "aktif") return;
    removeProducts((x) => x.id === id, reason, "langsung");
    log(`Admin menurunkan produk “${p.name}” (${reason})`, "/admin/dihapus", { productId: id, userId: p.sellerId }, reason);
    notify("Produk diturunkan. Penjual akan diberi tahu.");
  };

  const restoreProduct = (id) => {
    const p = getProduct(id);
    if (!p || p.status !== "diturunkan") return;
    setProducts((prev) => prev.map((x) => (x.id === id ? { ...x, status: "aktif", removal: undefined } : x)));
    log(`Admin memulihkan produk “${p.name}”`, "/admin/produk", { productId: id, userId: p.sellerId });
    notify("Produk dipulihkan.");
  };

  /* ---------- laporan ---------- */
  const startReview = (reportId) =>
    setReports((prev) => prev.map((r) => (r.id === reportId && r.status === "baru" ? { ...r, status: "diproses" } : r)));

  const acceptReport = (id, sanction, note) => {
    const r = reports.find((x) => x.id === id);
    if (!r || r.status === "selesai") return;
    const reason = note || r.category;
    if (sanction === "turunkan_produk" && r.productId) removeProducts((p) => p.id === r.productId, r.category, "laporan");
    if (sanction === "peringatan") applyUserStatus(r.reportedUserId, "peringatan", reason);
    if (sanction === "suspend") applyUserStatus(r.reportedUserId, "suspend", reason);
    if (sanction === "ban") applyUserStatus(r.reportedUserId, "banned", reason);
    setReports((prev) =>
      prev.map((x) =>
        x.id === id ? { ...x, status: "selesai", outcome: "diterima", sanction, adminNote: note, handledAt: nowISO() } : x,
      ),
    );
    log(`Admin menerima laporan terhadap @${handle(r.reportedUserId)} (${SANCTION_LABEL[sanction]})`, "/admin/laporan", { reportId: id, userId: r.reportedUserId, productId: r.productId }, note);
    notify("Laporan diterima. Sanksi diterapkan.");
  };

  const rejectReport = (id, note) => {
    const r = reports.find((x) => x.id === id);
    if (!r || r.status === "selesai") return;
    setReports((prev) =>
      prev.map((x) =>
        x.id === id ? { ...x, status: "selesai", outcome: "ditolak", adminNote: note, handledAt: nowISO() } : x,
      ),
    );
    log(`Admin menolak laporan terhadap @${handle(r.reportedUserId)}`, "/admin/laporan", { reportId: id, userId: r.reportedUserId, productId: r.productId }, note);
    notify("Laporan ditolak.");
  };

  /* ---------- banding ---------- */
  const acceptAppeal = (id, note) => {
    const a = appeals.find((x) => x.id === id);
    if (!a || a.status !== "menunggu") return;
    if (a.productId) {
      setProducts((prev) => prev.map((p) => (p.id === a.productId ? { ...p, status: "aktif", removal: undefined } : p)));
    } else {
      applyUserStatus(a.userId, "aktif", "");
    }
    setAppeals((prev) => prev.map((x) => (x.id === id ? { ...x, status: "diterima", adminNote: note, handledAt: nowISO() } : x)));
    log(`Admin menerima banding dari @${handle(a.userId)}`, "/admin/laporan", { appealId: id, userId: a.userId, productId: a.productId }, note);
    notify("Banding diterima. Pemulihan dilakukan.");
  };

  const rejectAppeal = (id, note) => {
    const a = appeals.find((x) => x.id === id);
    if (!a || a.status !== "menunggu") return;
    setAppeals((prev) => prev.map((x) => (x.id === id ? { ...x, status: "ditolak", adminNote: note, handledAt: nowISO() } : x)));
    log(`Admin menolak banding dari @${handle(a.userId)}`, "/admin/laporan", { appealId: id, userId: a.userId, productId: a.productId }, note);
    notify("Banding ditolak. Sanksi tetap berlaku.");
  };

  /* ---------- pengguna ---------- */
  const changeUserStatus = (id, status, reason) => {
    const u = getUser(id);
    if (!u) return;
    applyUserStatus(id, status, reason);
    const verb = {
      peringatan: "memberi peringatan kepada",
      suspend: "men-suspend",
      banned: "mem-ban",
      aktif: "memulihkan akun",
    };
    log(
      status === "aktif"
        ? `Admin memulihkan akun @${u.username}`
        : `Admin ${verb[status]} @${u.username} (${reason})`,
      "/admin/pengguna",
      { userId: id },
      reason,
    );
    notify(status === "aktif" ? "Akun dipulihkan." : "Tindakan pada akun berhasil.");
  };

  const newReports = reports.filter((r) => r.status === "baru").length;
  const openReports = reports.filter((r) => r.status !== "selesai").length;
  const pendingAppeals = appeals.filter((a) => a.status === "menunggu").length;

  const value = {
    products, users, reports, appeals, activities, toast,
    counts: { newReports, openReports, pendingAppeals, inbox: openReports + pendingAppeals },
    getUser, getProduct, takedownProduct, restoreProduct, startReview,
    acceptReport, rejectReport, acceptAppeal, rejectAppeal, changeUserStatus,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}