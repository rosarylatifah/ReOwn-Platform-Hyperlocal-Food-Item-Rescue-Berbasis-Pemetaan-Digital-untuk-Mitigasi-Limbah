"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// DUMMY: akun disimpan di localStorage. Ganti isi register/login/logout ke API saat backend siap.
const USERS_KEY = "reown:users:v1";
const SESSION_KEY = "reown:session:v1";

const AuthContext = createContext(null);

async function hash(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const u = JSON.parse(raw);
    return u && typeof u.email === "string" ? u : null;
  } catch {
    return null;
  }
}

// Helper baca/tulis JSON untuk data lain di localStorage (dipakai fitur hapus akun)
const readJson = (k, fb) => {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : fb;
  } catch {
    return fb;
  }
};
const writeJson = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

const ADMIN_SEED = {
  nama: "Admin ReOwn",
  email: "admin@reown.org",
  password: "admin12345", // DUMMY: ganti sesuai keinginan
};

// Buat akun admin sekali saja kalau belum ada
async function ensureAdmin() {
  const users = readUsers();
  if (users.some((u) => u.role === "admin")) return;
  const passwordHash = await hash(ADMIN_SEED.password);
  localStorage.setItem(
    USERS_KEY,
    JSON.stringify([
      ...users,
      {
        nama: ADMIN_SEED.nama,
        telepon: "",
        email: ADMIN_SEED.email,
        passwordHash,
        storeName: "ReOwn Admin",
        role: "admin",
      },
    ])
  );
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setUser(readSession());
    setHydrated(true);

    const onStorage = (e) => {
      if (e.key === SESSION_KEY) setUser(readSession());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const startSession = (u) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    setUser(u);
  };

  const register = useCallback(async ({ nama, telepon, email, password }) => {
    const mail = email.trim().toLowerCase();
    const users = readUsers();
    if (users.some((u) => u.email === mail)) {
      return { ok: false, error: "Email ini sudah terdaftar. Coba masuk saja." };
    }
    const passwordHash = await hash(password);
    const created = {
      nama: nama.trim(),
      telepon: telepon.trim(),
      email: mail,
      passwordHash,
      storeName: `${nama.trim()}'s Store`,
      role: "pembeli", // registrasi publik tidak boleh membuat admin
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, created]));
    // Sengaja TIDAK startSession: user harus login dulu setelah daftar
    return { ok: true };
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const mail = email.trim().toLowerCase();
    const users = readUsers();
    const found = users.find((u) => u.email === mail);
    if (!found) {
      return { ok: false, field: "email", error: "Email ini belum terdaftar. Periksa penulisannya atau daftar dulu." };
    }
    const passwordHash = await hash(password);
    if (found.passwordHash !== passwordHash) {
      return { ok: false, field: "password", error: "Kata sandi salah. Coba lagi." };
    }

    const session = {
      nama: found.nama,
      email: found.email,
      telepon: found.telepon,
      storeName: found.storeName || `${found.nama}'s Store`,
      role: found.role || "pembeli",
    };
    startSession(session);
    return { ok: true, role: session.role, user: session };
  }, []);

  const adminLogin = useCallback(async ({ email, password }) => {
    await ensureAdmin();
    const mail = email.trim().toLowerCase();
    const found = readUsers().find((u) => u.email === mail && u.role === "admin");
    const passwordHash = await hash(password);
    if (!found || found.passwordHash !== passwordHash) {
      return { ok: false, error: "Email atau kata sandi admin salah." };
    }
    const session = {
      nama: found.nama,
      email: found.email,
      telepon: found.telepon,
      storeName: found.storeName,
      role: "admin",
    };
    startSession(session);
    return { ok: true, role: "admin", user: session };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem("reown:current_user:v1");
    setUser(null);
  }, []);

  // Edit Profil (Nama, Telepon, Nama Toko, dll)
  const updateProfile = useCallback(
    async (updatedData) => {
      if (!user) return { ok: false, error: "Belum login" };

      const users = readUsers();
      const updatedUsers = users.map((u) => {
        if (u.email === user.email) {
          return { ...u, ...updatedData };
        }
        return u;
      });

      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));

      const newSession = { ...user, ...updatedData };
      startSession(newSession);
      return { ok: true };
    },
    [user]
  );

  // Switch Peran / Update Sesi
  const switchRole = useCallback(
    (newRoleData) => {
      if (!user) return;
      const updated = { ...user, ...newRoleData };
      startSession(updated);
    },
    [user]
  );

  // HAPUS AKUN: konfirmasi kata sandi, akun admin tidak bisa dihapus,
  // riwayat pesanan dipertahankan dengan nama "Akun dihapus".
  const deleteAccount = useCallback(
    async ({ password }) => {
      if (!user) return { ok: false, error: "Belum login." };
      if (user.role === "admin") return { ok: false, error: "Akun admin tidak bisa dihapus." };

      const found = readUsers().find((u) => u.email === user.email);
      if (!found) return { ok: false, error: "Akun tidak ditemukan." };
      if (found.passwordHash !== (await hash(password || ""))) {
        return { ok: false, error: "Kata sandi salah." };
      }

      const email = found.email;
      const profile = readJson("reown_user_profile", {});
      const ownProfile = (profile.ownerEmail || profile.email) === email;
      const buyerNames = new Set([found.nama, ownProfile ? profile.name : null].filter(Boolean));
      const storeNames = new Set([found.storeName, ownProfile ? profile.storeName : null].filter(Boolean));

      // Pesanan baru punya buyerEmail/storeId (pasti). Pesanan lama hanya nama, dicocokkan lewat nama.
      const isBuyer = (o) => (o.buyerEmail ? o.buyerEmail === email : buyerNames.has(o.buyerName));
      const isSeller = (o) => (o.storeId ? o.storeId === email : storeNames.has(o.storeName));

      // Tolak jika masih ada pesanan aktif
      const orders = readJson("reown_orders", []);
      const active = orders.filter(
        (o) => (o.status === "Menunggu Konfirmasi" || o.status === "Dalam Proses") && (isBuyer(o) || isSeller(o))
      );
      if (active.length) {
        return { ok: false, error: `Masih ada ${active.length} pesanan aktif. Selesaikan atau batalkan dulu.` };
      }

      // Riwayat pesanan dipertahankan, identitas diganti "Akun dihapus"
      const anonymize = (list) =>
        list.map((o) => {
          let n = o;
          if (isBuyer(o)) n = { ...n, buyerName: "Akun dihapus", buyerEmail: "" };
          if (isSeller(o)) n = { ...n, storeName: "Akun dihapus", storeId: null };
          return n;
        });
      writeJson("reown_orders", anonymize(orders));
      writeJson("reown_order_history", anonymize(readJson("reown_order_history", [])));

      // Produk milik akun ini + stoknya
      const PKEY = "reown:seller-products:v1";
      const allProducts = readJson(PKEY, []);
      const mineP = (p) => (p.storeId ? p.storeId === email : !!p.isSeller && storeNames.has(p.store));
      const stocks = readJson("reown_product_stocks", {});
      allProducts.filter(mineP).forEach((p) => delete stocks[String(p.id)]);
      writeJson("reown_product_stocks", stocks);
      writeJson(PKEY, allProducts.filter((p) => !mineP(p)));

      // Chat milik toko akun ini (chat sebagai pembeli tidak bisa dipisahkan)
      const chat = readJson("reown_chat", { chats: [], messages: {} });
      const mineC = (c) => c.storeId === email || storeNames.has(c.storeId) || storeNames.has(c.storeName);
      const gone = chat.chats.filter(mineC).map((c) => c.id);
      writeJson("reown_chat", {
        chats: chat.chats.filter((c) => !gone.includes(c.id)),
        messages: Object.fromEntries(
          Object.entries(chat.messages || {}).filter(([id]) => !gone.includes(id))
        ),
      });

      // Profil hanya dihapus kalau memang milik akun ini
      if (ownProfile) localStorage.removeItem("reown_user_profile");
      localStorage.removeItem("reown:current_user:v1");

      // Akun dan sesi
      writeJson(USERS_KEY, readUsers().filter((u) => u.email !== email));
      localStorage.removeItem(SESSION_KEY);
      setUser(null);
      return { ok: true };
    },
    [user]
  );

  const value = useMemo(
    () => ({ user, hydrated, register, login, adminLogin, logout, updateProfile, switchRole, deleteAccount }),
    [user, hydrated, register, login, adminLogin, logout, updateProfile, switchRole, deleteAccount]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  return ctx;
}
