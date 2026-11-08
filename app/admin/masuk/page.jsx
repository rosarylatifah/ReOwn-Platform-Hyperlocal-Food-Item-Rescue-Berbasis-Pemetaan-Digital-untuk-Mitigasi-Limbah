"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthShell, { Highlight } from "@/components/auth/AuthShell";
import { useAuth } from "@/lib/auth";

const ADMIN_HOME = "/admin";

const inputBase =
  "w-full rounded-xl border bg-[#FBF9F7] px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 transition-shadow focus:outline-none focus:ring-2";
const inputOk = "border-stone-200 focus:border-[#D85834] focus:ring-[#D85834]/30";
const inputBad = "border-red-400 focus:border-red-500 focus:ring-red-300/50";

function EyeIcon({ off }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
      {off && <path d="m3 3 18 18" />}
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, hydrated, adminLogin } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sudah login sebagai admin: langsung ke dashboard
  useEffect(() => {
    if (hydrated && user?.role === "admin") router.replace(ADMIN_HOME);
  }, [hydrated, user, router]);

  const setField = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k] || errors.form) setErrors({});
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errs.email = "Format email belum benar.";
    if (!form.password) errs.password = "Kata sandi wajib diisi.";
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await adminLogin(form);
      if (!res.ok) {
        setErrors({ form: res.error });
        return;
      }
      router.replace(ADMIN_HOME);
    } catch (err) {
      console.error("Admin login error:", err);
      setErrors({ form: "Terjadi kesalahan pada sistem. Coba lagi sebentar." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      heading={
        <>
          Masuk <Highlight>Admin</Highlight>
        </>
      }
      desc="Halaman khusus pengelola ReOwn. Masuk untuk meninjau laporan dan aktivitas platform."
      switchText="Bukan admin?"
      switchLabel="Masuk sebagai pengguna"
      switchHref="/masuk"
    >
      <form onSubmit={onSubmit} noValidate className="space-y-3">
        <div>
          <label htmlFor="admin-email" className="block text-[13px] font-bold text-stone-900">
            Alamat Email
          </label>
          <div className="mt-1">
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              placeholder="admin@reown.org"
              value={form.email}
              onChange={setField("email")}
              aria-invalid={!!errors.email}
              className={`${inputBase} ${errors.email ? inputBad : inputOk}`}
            />
          </div>
          {errors.email && (
            <p role="alert" className="mt-1 text-xs font-medium text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="admin-pass" className="block text-[13px] font-bold text-stone-900">
            Kata Sandi
          </label>
          <div className="relative mt-1">
            <input
              id="admin-pass"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Kata sandi admin"
              value={form.password}
              onChange={setField("password")}
              aria-invalid={!!errors.password}
              className={`${inputBase} ${errors.password ? inputBad : inputOk} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              aria-pressed={show}
              className="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-stone-500 transition-colors hover:text-[#D85834]"
            >
              <EyeIcon off={!show} />
            </button>
          </div>
          {errors.password && (
            <p role="alert" className="mt-1 text-xs font-medium text-red-600">{errors.password}</p>
          )}
        </div>

        {errors.form && (
          <p role="alert" className="rounded-xl bg-red-50 px-3.5 py-2 text-sm font-medium text-red-700">
            {errors.form}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#D85834] py-3 text-[15px] font-semibold text-white shadow-[0_8px_20px_rgba(216,88,52,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#C24A28] active:translate-y-0 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D85834] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {loading ? (
            "Memproses..."
          ) : (
            <>
              Masuk
              <ArrowIcon />
            </>
          )}
        </button>
      </form>
    </AuthShell>
  );
}