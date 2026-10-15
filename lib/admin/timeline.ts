import { REMOVAL_SOURCE_LABEL, type Tone } from "./labels";
import type { Activity, Appeal, AppUser, Product, Report } from "./types";

export interface TimelineEvent {
  id: string;
  at: string;
  text: string;
  tone: Tone;
}

export interface TimelineSource {
  users: AppUser[];
  products: Product[];
  reports: Report[];
  appeals: Appeal[];
  activities: Activity[];
}

const sortAsc = (a: TimelineEvent, b: TimelineEvent) => new Date(a.at).getTime() - new Date(b.at).getTime();
const nameOf = (s: TimelineSource, id: string) => s.users.find((u) => u.id === id)?.username ?? "pengguna";
const adminTone = (text: string): Tone =>
  text.includes("memulihkan") ? "ok" : text.includes("menolak") ? "muted" : "bad";

function appealEvents(a: Appeal, subject: string): TimelineEvent[] {
  const ev: TimelineEvent[] = [{ id: "ac" + a.id, at: a.createdAt, text: `Banding diajukan ${subject}`, tone: "info" }];
  if (a.status !== "menunggu" && a.handledAt) {
    ev.push({
      id: "ah" + a.id,
      at: a.handledAt,
      text: a.status === "diterima" ? "Banding diterima, pemulihan dilakukan" : "Banding ditolak, sanksi tetap berlaku",
      tone: a.status === "diterima" ? "ok" : "muted",
    });
  }
  return ev;
}

/** Kronologi satu akun: laporan, sanksi admin, banding, pemulihan. */
/** Riwayat satu akun: bergabung, unggahan produk, laporan (diterima/dibuat), sanksi, banding, pemulihan. */
export function userTimeline(userId: string, s: TimelineSource): TimelineEvent[] {
  const u = s.users.find((x) => x.id === userId);
  if (!u) return [];
  const ev: TimelineEvent[] = [{ id: "join", at: u.joinedAt, text: "Bergabung di ReOwn", tone: "muted" }];

  // produk milik akun: unggahan dan penurunan
  s.products
    .filter((p) => p.sellerId === userId)
    .forEach((p) => {
      ev.push({ id: "up" + p.id, at: p.uploadedAt, text: `Mengunggah produk “${p.name}”`, tone: "muted" });
      if (p.removal) {
        ev.push({
          id: "rm" + p.id,
          at: p.removal.at,
          text: `Produk “${p.name}” diturunkan: ${p.removal.reason} (${REMOVAL_SOURCE_LABEL[p.removal.source]})`,
          tone: "bad",
        });
      }
    });

  // laporan terhadap akun ini dan laporan yang dibuat akun ini
  s.reports
    .filter((r) => r.reportedUserId === userId)
    .forEach((r) =>
      ev.push({ id: "rc" + r.id, at: r.createdAt, text: `Dilaporkan oleh ${nameOf(s, r.reporterId)}: ${r.category}`, tone: "warn" }),
    );
  s.reports
    .filter((r) => r.reporterId === userId)
    .forEach((r) =>
      ev.push({ id: "rf" + r.id, at: r.createdAt, text: `Melaporkan ${nameOf(s, r.reportedUserId)}: ${r.category}`, tone: "info" }),
    );

  // banding
  s.appeals
    .filter((a) => a.userId === userId)
    .forEach((a) => {
      const p = a.productId ? s.products.find((x) => x.id === a.productId) : undefined;
      ev.push(...appealEvents(a, p ? `atas produk “${p.name}”` : "atas sanksi akun"));
    });

  // keputusan admin: tercatat di riwayat aktivitas dengan format "@username"
  s.activities
    .filter((a) => a.actorKind === "admin" && a.text.includes("@" + u.username) && !a.text.includes("banding"))
    .forEach((a) => ev.push({ id: "x" + a.id, at: a.at, text: a.text, tone: adminTone(a.text) }));

  // pemulihan produk milik akun
  s.activities
    .filter((a) => a.actorKind === "admin" && a.refs?.userId === userId && a.text.includes("memulihkan produk"))
    .forEach((a) => ev.push({ id: "xr" + a.id, at: a.at, text: a.text, tone: "ok" }));

  return ev.sort(sortAsc);
}

/** Kronologi satu produk: unggah, laporan, penurunan, banding, pemulihan. */
export function productTimeline(productId: string, s: TimelineSource): TimelineEvent[] {
  const p = s.products.find((x) => x.id === productId);
  if (!p) return [];
  const ev: TimelineEvent[] = [
    { id: "up", at: p.uploadedAt, text: `Diunggah oleh ${nameOf(s, p.sellerId)}`, tone: "muted" },
  ];

  s.reports
    .filter((r) => r.productId === productId)
    .forEach((r) => {
      ev.push({ id: "rc" + r.id, at: r.createdAt, text: `Dilaporkan oleh ${nameOf(s, r.reporterId)}: ${r.category}`, tone: "warn" });
      if (r.status === "selesai" && r.handledAt) {
        ev.push({
          id: "rh" + r.id,
          at: r.handledAt,
          text: r.outcome === "diterima" ? "Laporan diterima admin" : "Laporan ditolak admin",
          tone: r.outcome === "diterima" ? "bad" : "muted",
        });
      }
    });

  if (p.removal) {
    ev.push({
      id: "rm",
      at: p.removal.at,
      text: `Diturunkan: ${p.removal.reason} (${REMOVAL_SOURCE_LABEL[p.removal.source]})`,
      tone: "bad",
    });
  }

  s.appeals
    .filter((a) => a.productId === productId)
    .forEach((a) => ev.push(...appealEvents(a, `oleh ${nameOf(s, a.userId)}`)));

  s.activities
    .filter((a) => a.actorKind === "admin" && a.text.includes(`“${p.name}”`) && a.text.includes("memulihkan"))
    .forEach((a) => ev.push({ id: "x" + a.id, at: a.at, text: a.text, tone: "ok" }));

  return ev.sort(sortAsc);
}