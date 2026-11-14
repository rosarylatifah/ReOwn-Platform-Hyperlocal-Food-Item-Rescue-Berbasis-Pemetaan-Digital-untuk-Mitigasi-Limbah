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
  writeAdminState({
    ...s,
    users: [
      ...s.users,
      {
        id: "u" + Date.now().toString(36),
        username,
        email: mail,
        phone: telepon || "-",
        joinedAt: new Date().toISOString(),
        status: "aktif",
        warnings: 0,
      },
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