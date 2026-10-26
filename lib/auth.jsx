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
      storeName: `${nama.trim()}'s Store`, // Default nama toko untuk penjual
      role: 'pembeli', // Default role awal
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, created]));
    startSession({ 
      nama: created.nama, 
      email: created.email, 
      telepon: created.telepon, 
      storeName: created.storeName, 
      role: created.role 
    });
    return { ok: true };
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const mail = email.trim().toLowerCase();
    const users = readUsers();
    const found = users.find((u) => u.email === mail);
    const passwordHash = await hash(password);
    if (!found || found.passwordHash !== passwordHash) {
      return { ok: false, error: "Email atau kata sandi salah." };
    }
    startSession({ 
      nama: found.nama, 
      email: found.email, 
      telepon: found.telepon,
      storeName: found.storeName || `${found.nama}'s Store`,
      role: found.role || 'pembeli'
    });
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
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
    () => ({ user, hydrated, register, login, logout, updateProfile, switchRole }),
    [user, hydrated, register, login, logout, updateProfile, switchRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  return ctx;
}