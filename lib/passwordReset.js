// Logika reset kata sandi VERSI DUMMY (localStorage + sessionStorage).
// Saat backend siap, ganti isi tiga fungsi ini dengan pemanggilan API. Komponen tidak perlu diubah.

const USERS_KEY = "reown:users:v1";
const RESET_KEY = "reown:reset:v1";
const TTL_MS = 10 * 60 * 1000; // kode berlaku 10 menit

async function hash(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

const readUsers = () => {
  try {
    const v = JSON.parse(localStorage.getItem(USERS_KEY));
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
};

const readReset = () => {
  try {
    return JSON.parse(sessionStorage.getItem(RESET_KEY));
  } catch {
    return null;
  }
};

/** role: "admin" hanya untuk akun admin, selain itu hanya akun pengguna. */
const findAccount = (email, role) =>
  readUsers().find((u) => u.email === email && (role === "admin") === (u.role === "admin"));

/**
 * Minta kode pemulihan.
 * TODO backend: POST /api/auth/forgot { email } lalu server mengirim email. Respons SELALU sama
 * (supaya orang tidak bisa menebak email terdaftar). `demoCode` hanya untuk kotak "Email simulasi".
 */
export async function requestReset(email, role) {
  const mail = email.trim().toLowerCase();
  if (!findAccount(mail, role)) return { ok: true, demoCode: null };
  const code = String(Math.floor(100000 + Math.random() * 900000));
  sessionStorage.setItem(RESET_KEY, JSON.stringify({ email: mail, code, expires: Date.now() + TTL_MS, verified: false }));
  // Hanya terlihat di console saat `npm run dev`, supaya alurnya bisa dites. Tidak ada tampilan di halaman.
  if (process.env.NODE_ENV === "development") console.info("[DEV] Kode reset:", code);
  return { ok: true };
}

/** TODO backend: POST /api/auth/verify-code { email, code } */
export async function verifyCode(email, code) {
  const r = readReset();
  const mail = email.trim().toLowerCase();
  if (!r || r.email !== mail || r.code !== code) return { ok: false, error: "Kode salah. Periksa lagi." };
  if (Date.now() > r.expires) return { ok: false, error: "Kode sudah kedaluwarsa. Kirim ulang kode." };
  sessionStorage.setItem(RESET_KEY, JSON.stringify({ ...r, verified: true }));
  return { ok: true };
}

/** TODO backend: POST /api/auth/reset-password { email, code, password } */
export async function setNewPassword(email, role, password) {
  const r = readReset();
  const mail = email.trim().toLowerCase();
  if (!r || r.email !== mail || !r.verified) return { ok: false, error: "Sesi pemulihan tidak valid. Mulai lagi dari awal." };
  const users = readUsers();
  const passwordHash = await hash(password);
  const next = users.map((u) =>
    u.email === mail && (role === "admin") === (u.role === "admin") ? { ...u, passwordHash } : u,
  );
  localStorage.setItem(USERS_KEY, JSON.stringify(next));
  sessionStorage.removeItem(RESET_KEY);
  return { ok: true };
}