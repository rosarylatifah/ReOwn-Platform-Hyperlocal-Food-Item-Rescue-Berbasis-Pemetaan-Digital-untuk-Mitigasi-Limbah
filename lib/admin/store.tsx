"use client";

import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import { seedActivities, seedAppeals, seedProducts, seedReports, seedUsers } from "./data";
import { SANCTION_LABEL } from "./labels";
import type {
  Activity, ActivityRefs, Appeal, AppUser, Product, RemovalSource, Report, Sanction, UserStatus,
} from "./types";

export const ADMIN = { name: "Admin", email: "admin@reown.org" };

const uid = () => Math.random().toString(36).slice(2, 9);
const nowISO = () => new Date().toISOString();

interface Counts {
  newReports: number;
  openReports: number;
  pendingAppeals: number;
  inbox: number; // laporan belum selesai + banding menunggu
}

interface AdminStore {
  products: Product[];
  users: AppUser[];
  reports: Report[];
  appeals: Appeal[];
  activities: Activity[];
  counts: Counts;
  toast: string | null;
  getUser: (id: string) => AppUser | undefined;
  getProduct: (id: string) => Product | undefined;
  takedownProduct: (id: string, reason: string) => void;
  restoreProduct: (id: string) => void;
  startReview: (reportId: string) => void;
  acceptReport: (id: string, sanction: Sanction, note: string) => void;
  rejectReport: (id: string, note: string) => void;
  acceptAppeal: (id: string, note: string) => void;
  rejectAppeal: (id: string, note: string) => void;
  changeUserStatus: (id: string, status: UserStatus, reason: string) => void;
}

const Ctx = createContext<AdminStore | null>(null);

export function useAdmin(): AdminStore {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAdmin harus dipakai di dalam <AdminProvider>");
  return v;
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [users, setUsers] = useState<AppUser[]>(seedUsers);
  const [reports, setReports] = useState<Report[]>(seedReports);
  const [appeals, setAppeals] = useState<Appeal[]>(seedAppeals);
  const [activities, setActivities] = useState<Activity[]>(seedActivities);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notify = (msg: string) => {
    setToast(msg);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 3200);
  };

  const log = (text: string, href?: string, refs?: ActivityRefs, note?: string) =>
    setActivities((p) => [
      { id: uid(), at: nowISO(), actor: ADMIN.name, actorEmail: ADMIN.email, actorKind: "admin", text, status: "Selesai", href, refs, note: note || undefined },
      ...p,
    ]);

  const getUser = (id: string) => users.find((u) => u.id === id);
  const getProduct = (id: string) => products.find((p) => p.id === id);
  const handle = (id: string) => getUser(id)?.username ?? "pengguna";

  /* ---------- helper internal (tanpa log) ---------- */
  const removeProducts = (match: (p: Product) => boolean, reason: string, source: RemovalSource) =>
    setProducts((prev) =>
      prev.map((p) =>
        p.status === "aktif" && match(p)
          ? { ...p, status: "diturunkan", removal: { reason, by: ADMIN.name, at: nowISO(), source } }
          : p,
      ),
    );

  const applyUserStatus = (id: string, status: UserStatus, reason: string) => {
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
  const takedownProduct = (id: string, reason: string) => {
    const p = getProduct(id);
    if (!p || p.status !== "aktif") return;
    removeProducts((x) => x.id === id, reason, "langsung");
        log(`Admin menurunkan produk “${p.name}” (${reason})`, "/admin/dihapus", { productId: id, userId: p.sellerId }, reason);
    notify("Produk diturunkan. Penjual akan diberi tahu.");
  };

  const restoreProduct = (id: string) => {
    const p = getProduct(id);
    if (!p || p.status !== "diturunkan") return;
    setProducts((prev) => prev.map((x) => (x.id === id ? { ...x, status: "aktif", removal: undefined } : x)));
        log(`Admin memulihkan produk “${p.name}”`, "/admin/produk", { productId: id, userId: p.sellerId });
    notify("Produk dipulihkan.");
  };

  /* ---------- laporan ---------- */
  const startReview = (reportId: string) =>
    setReports((prev) => prev.map((r) => (r.id === reportId && r.status === "baru" ? { ...r, status: "diproses" } : r)));

  const acceptReport = (id: string, sanction: Sanction, note: string) => {
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

  const rejectReport = (id: string, note: string) => {
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
  const acceptAppeal = (id: string, note: string) => {
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

  const rejectAppeal = (id: string, note: string) => {
    const a = appeals.find((x) => x.id === id);
    if (!a || a.status !== "menunggu") return;
    setAppeals((prev) => prev.map((x) => (x.id === id ? { ...x, status: "ditolak", adminNote: note, handledAt: nowISO() } : x)));
        log(`Admin menolak banding dari @${handle(a.userId)}`, "/admin/laporan", { appealId: id, userId: a.userId, productId: a.productId }, note);
    notify("Banding ditolak. Sanksi tetap berlaku.");
  };

  /* ---------- pengguna ---------- */
  const changeUserStatus = (id: string, status: UserStatus, reason: string) => {
    const u = getUser(id);
    if (!u) return;
    applyUserStatus(id, status, reason);
    const verb: Record<UserStatus, string> = {
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

  const value: AdminStore = {
    products, users, reports, appeals, activities, toast,
    counts: { newReports, openReports, pendingAppeals, inbox: openReports + pendingAppeals },
    getUser, getProduct, takedownProduct, restoreProduct, startReview,
    acceptReport, rejectReport, acceptAppeal, rejectAppeal, changeUserStatus,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
