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
      role: 'pembeli', // registrasi publik tidak boleh membuat admin
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
      role: found.role || 'pembeli',
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
    localStorage.removeItem('reown:current_user:v1');
    setUser(null);
  }, []);

  // TAMBAHAN: Fungsi untuk Mengedit Profil (Nama, Telepon, Nama Toko, dll)
  const updateProfile = useCallback(async (updatedData) => {
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
  }, [user]);

  // TAMBAHAN: Fungsi untuk Switch Peran / Update Sesi
  const switchRole = useCallback((newRoleData) => {
    if (!user) return;
    const updated = { ...user, ...newRoleData };
    startSession(updated);
  }, [user]);

  const value = useMemo(
    () => ({ user, hydrated, register, login, adminLogin, logout, updateProfile, switchRole }),
    [user, hydrated, register, login, adminLogin, logout, updateProfile, switchRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  return ctx;
}