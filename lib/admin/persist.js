import { seedActivities, seedAppeals, seedProducts, seedReports, seedUsers } from "./data";

export const ADMIN_STATE_KEY = "reown:admin-state:v1";

const seedState = () => ({
  products: seedProducts,
  users: seedUsers,
  reports: seedReports,
  appeals: seedAppeals,
  activities: seedActivities,
});

export function readAdminState() {
  try {
    const raw = localStorage.getItem(ADMIN_STATE_KEY);
    if (raw) return { ...seedState(), ...JSON.parse(raw) };
  } catch {}
  return seedState();
}

export function writeAdminState(state) {
  try {
    const str = JSON.stringify(state);
    if (localStorage.getItem(ADMIN_STATE_KEY) === str) return;
    localStorage.setItem(ADMIN_STATE_KEY, str);
  } catch {}
}

/** Daftarkan akun asli (register/login) ke daftar pengguna admin, dicocokkan lewat email. */
export function syncAdminUser({ nama, email, telepon }) {
  const s = readAdminState();
  const mail = email.toLowerCase();
  if (s.users.some((u) => u.email?.toLowerCase() === mail)) return;
  const base = (nama || mail.split("@")[0]).trim().toLowerCase().replace(/\s+/g, ".");
  let username = base;
  let i = 2;
  while (s.users.some((u) => u.username === username)) username = `${base}${i++}`;
  const id = "u" + Date.now().toString(36);
  const at = new Date().toISOString();
  writeAdminState({
    ...s,
    users: [
      ...s.users,
      { id, username, email: mail, phone: telepon || "-", joinedAt: at, status: "aktif", warnings: 0 },
    ],
    activities: [
      {
        id: "xj" + id,
        at,
        actor: username,
        actorEmail: mail,
        actorKind: "pengguna",
        category: "pengguna",
        text: "Akun baru terdaftar",
        status: "Selesai",
        href: "/admin/pengguna",
        refs: { userId: id },
      },
      ...s.activities,
    ],
  });
}

/** Cek akun suspend/banned. Suspend yang sudah lewat tanggalnya otomatis diaktifkan lagi. */
export function checkRestriction(email) {
  const s = readAdminState();
  const u = s.users.find((x) => x.email?.toLowerCase() === email.toLowerCase());
  if (!u || (u.status !== "suspend" && u.status !== "banned")) return null;

  if (u.status === "suspend" && u.sanction?.until && new Date(u.sanction.until).getTime() <= Date.now()) {
    writeAdminState({
      ...s,
      users: s.users.map((x) => (x.id === u.id ? { ...x, status: "aktif", sanction: undefined } : x)),
      products: s.products.map((p) =>
        p.sellerId === u.id && p.removal?.source === "akun" ? { ...p, status: "aktif", removal: undefined } : p,
      ),
    });
    return null;
  }

  return {
    status: u.status,
    userId: u.id,
    reason: u.sanction?.reason ?? "",
    until: u.sanction?.until ?? null,
    appealPending: s.appeals.some((a) => a.userId === u.id && a.status === "menunggu"),
  };
}

/** Banding dari halaman login. Bentuknya sama dengan seedAppeals, jadi langsung muncul di tab Banding admin. */
export function submitAppeal({ userId, message }) {
  const s = readAdminState();
  const u = s.users.find((x) => x.id === userId);
  if (!u) return { ok: false, error: "Akun tidak ditemukan." };
  if (s.appeals.some((a) => a.userId === userId && a.status === "menunggu")) {
    return { ok: false, error: "Bandingmu sebelumnya masih ditinjau admin." };
  }
  const id = "a" + Date.now().toString(36);
  const at = new Date().toISOString();
  writeAdminState({
    ...s,
    appeals: [...s.appeals, { id, createdAt: at, userId, message, evidence: [], status: "menunggu" }],
    activities: [
      {
        id: "x" + id,
        at,
        actor: u.username,
        actorEmail: u.email,
        actorKind: "pengguna",
        text: `Pengguna mengajukan banding atas ${u.status === "banned" ? "ban" : "suspend"} akun`,
        status: "Belum ditindak",
        href: "/admin/laporan",
        refs: { appealId: id, userId },
      },
      ...s.activities,
    ],
  });
  return { ok: true };
}

/* ---------- perubahan produk oleh penjual (untuk notifikasi admin) ---------- */
const FIELD_LABEL = {
  name: "nama",
  price: "harga",
  image: "foto",
  description: "deskripsi",
  category: "kategori",
  location: "lokasi",
};
// Stok sengaja tidak dicatat: berkurang tiap ada pesanan dan akan membanjiri notifikasi
export const WATCHED_FIELDS = Object.keys(FIELD_LABEL);
const MERGE_MS = 5 * 60 * 1000; // edit beruntun pada produk yang sama digabung

function productText(kind, name, fields, priceFrom, priceTo) {
  if (kind === "baru") return `Penjual menambahkan produk baru “${name}”`;
  if (kind === "hapus") return `Penjual menghapus produk “${name}”`;
  const list = fields.map((f) => FIELD_LABEL[f]).join(", ");
  const price = fields.includes("price") ? ` (harga: ${priceFrom} → ${priceTo})` : "";
  return `Penjual mengubah ${list} produk “${name}”${price}`;
}

/** kind: "baru" | "ubah" | "hapus". Dicatat sebagai aktivitas pengguna di data admin. */
export function logProductEvent({ kind, productId, name, fields = [], priceFrom, priceTo }) {
  let session = null;
  try {
    session = JSON.parse(localStorage.getItem("reown:session:v1"));
  } catch {}
  if (!session?.email) return;

  syncAdminUser({ nama: session.nama, email: session.email, telepon: session.telepon });
  const s = readAdminState();
  const u = s.users.find((x) => x.email?.toLowerCase() === session.email.toLowerCase());
  if (!u) return;

  const now = Date.now();
  const key = String(productId);
  let acts = s.activities;
  let f = fields;
  let pf = priceFrom;
  let pt = priceTo;

  if (kind === "ubah") {
    const i = acts.findIndex(
      (a) =>
        a.category === "produk" &&
        a.refs?.productKey === key &&
        a.refs?.kind === "ubah" &&
        a.actorEmail === u.email &&
        now - new Date(a.at).getTime() < MERGE_MS,
    );
    if (i >= 0) {
      const old = acts[i].refs;
      f = Array.from(new Set([...(old.fields || []), ...fields]));
      pf = old.priceFrom ?? priceFrom;
      pt = fields.includes("price") ? priceTo : old.priceTo;
      acts = acts.filter((_, k) => k !== i);
    }
  }

  const entry = {
    id: "xp" + now.toString(36) + Math.random().toString(36).slice(2, 5),
    at: new Date(now).toISOString(),
    actor: u.username,
    actorEmail: u.email,
    actorKind: "pengguna",
    category: "produk",
    text: productText(kind, name, f, pf, pt),
    status: "Selesai",
    href: "/admin/produk",
    refs: { userId: u.id, productKey: key, kind, fields: f, priceFrom: pf, priceTo: pt },
  };
  writeAdminState({ ...s, activities: [entry, ...acts] });
}