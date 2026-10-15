"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell, { Highlight } from "./AuthShell";
import { useAuth } from "@/lib/auth";

const inputBase =
  "w-full rounded-xl border bg-[#FBF9F7] px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 transition-shadow focus:outline-none focus:ring-2";
const inputOk = "border-stone-200 focus:border-[#D85834] focus:ring-[#D85834]/30";
const inputBad = "border-red-400 focus:border-red-500 focus:ring-red-300/50";

const LEVEL_LABEL = ["", "Masih tunas 🌱", "Mulai tumbuh 🌿", "Rindang 🌳", "Pohon kokoh 🌲"];
const LEVEL_COLOR = ["", "bg-[#F24827]", "bg-[#F5A623]", "bg-[#7AD65E]", "bg-[#2FAE5B]"];

function strength(pw) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 12) s++;
  return Math.max(1, s);
}

/** Setelah login, kembali ke ?next=/halaman (hanya path internal) */
function nextPath() {
  const n = new URLSearchParams(window.location.search).get("next");
  return n && n.startsWith("/") && !n.startsWith("//") ? n : "/";
}

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-bold text-stone-900">
        {label}
      </label>
      <div className="mt-1">{children}</div>
      {error && (
        <p id={`${id}-err`} role="alert" className="mt-1 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function TextInput({ error, className = "", ...props }) {
  return (
    <input
      {...props}
      aria-invalid={!!error}
      aria-describedby={error ? `${props.id}-err` : undefined}
      className={`${inputBase} ${error ? inputBad : inputOk} ${className}`}
    />
  );
}

function EyeIcon({ off }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
      {off && <path d="m3 3 18 18" />}
    </svg>
  );
}

function PasswordInput({ error, ...props }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <TextInput {...props} error={error} type={show ? "text" : "password"} className="pr-11" />
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
  );
}

function StrengthMeter({ password }) {
  const s = strength(password);
  if (!s) return null;
  return (
    <div className="mt-1.5 flex items-center gap-3">
      <div className="flex flex-1 gap-1.5">
        {[1, 2, 3, 4].map((n) => (
          <span
            key={n}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${n <= s ? LEVEL_COLOR[s] : "bg-stone-200"}`}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-stone-600">{LEVEL_LABEL[s]}</span>
    </div>
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

export default function AuthForm({ mode }) {
  const router = useRouter();
  const { register, login } = useAuth();
  const isRegister = mode === "daftar";

  const [form, setForm] = useState({ nama: "", telepon: "", email: "", password: "", konfirmasi: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const bind = (k) => ({
    value: form[k],
    error: errors[k],
    onChange: (e) => {
      setForm((f) => ({ ...f, [k]: e.target.value }));
      if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
    },
  });

  const validate = () => {
    const e = {};
    if (isRegister) {
      if (form.nama.trim().length < 2) e.nama = "Nama minimal 2 karakter.";
      if (!/^(\+62|62|0)8\d{7,11}$/.test(form.telepon.replace(/[\s-]/g, ""))) {
        e.telepon = "Nomor belum benar. Contoh: 0812 3456 7890.";
      }
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = "Format email belum benar.";
    if (isRegister) {
      if (form.password.length < 8) e.password = "Kata sandi minimal 8 karakter.";
      if (form.konfirmasi !== form.password) e.konfirmasi = "Konfirmasi kata sandi tidak sama.";
    } else if (!form.password) {
      e.password = "Kata sandi wajib diisi.";
    }
    return e;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = isRegister
        ? await register({ nama: form.nama, telepon: form.telepon, email: form.email, password: form.password })
        : await login({ email: form.email, password: form.password });
      if (res.ok) {
        router.push(nextPath());
        router.refresh();
        return; // loading tetap true selama pindah halaman
      }
      setErrors({ form: res.error });
    } catch {
      setErrors({ form: "Terjadi kendala. Coba lagi sebentar." });
    }
    setLoading(false);
  };

  return (
    <AuthShell
      heading={
        isRegister ? (
          <>
            Mulai aksi <Highlight>hijaumu</Highlight>!
          </>
        ) : (
          <>
            Hi, siap bikin <Highlight>perubahan</Highlight> lagi?
          </>
        )
      }
      desc={
        isRegister
          ? "Mari wujudkan lingkungan yang lebih bersih dan ramah. Buat akunmu dan mulai berbagi."
          : "Cek barang layak pakai di sekitar tempat tinggalmu sekarang."
      }
      switchText={isRegister ? "Sudah punya akun?" : "Belum punya akun?"}
      switchLabel={isRegister ? "Masuk ke Akunmu" : "Daftar disini"}
      switchHref={isRegister ? "/masuk" : "/daftar"}
    >
      <form onSubmit={onSubmit} noValidate className="space-y-3">
        {isRegister && (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field id="nama" label="Nama Lengkap" error={errors.nama}>
              <TextInput id="nama" type="text" autoComplete="name" placeholder="Nama lengkapmu" {...bind("nama")} />
            </Field>
            <Field id="telepon" label="No. Telepon" error={errors.telepon}>
              <TextInput
                id="telepon"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="0812 3456 7890"
                {...bind("telepon")}
              />
            </Field>
          </div>
        )}

        <Field id="email" label="Alamat Email" error={errors.email}>
          <TextInput id="email" type="email" autoComplete="email" placeholder="rescuer@reown.org" {...bind("email")} />
        </Field>

        <div className={isRegister ? "grid gap-3 sm:grid-cols-2" : ""}>
          <Field id="password" label="Kata Sandi" error={errors.password}>
            <PasswordInput
              id="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              placeholder={isRegister ? "Minimal 8 karakter" : "Kata sandimu"}
              {...bind("password")}
            />
            {isRegister && <StrengthMeter password={form.password} />}
            {!isRegister && (
              <div className="mt-1.5 text-right">
                <Link
                  href="/hubungi"
                  className="text-xs font-semibold text-[#E0452A] underline underline-offset-2 hover:text-[#C24A28]"
                >
                  Lupa Kata Sandi?
                </Link>
              </div>
            )}
          </Field>

          {isRegister && (
            <Field id="konfirmasi" label="Konfirmasi Kata Sandi" error={errors.konfirmasi}>
              <PasswordInput
                id="konfirmasi"
                autoComplete="new-password"
                placeholder="Ketik ulang kata sandi"
                {...bind("konfirmasi")}
              />
            </Field>
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
              {isRegister ? "Daftar" : "Masuk"}
              <ArrowIcon />
            </>
          )}
        </button>

        {isRegister && (
          <p className="text-center text-[11px] leading-snug text-stone-500">
            Dengan mendaftar, kamu menyetujui{" "}
            <Link href="/syarat" className="font-semibold text-[#D85834] hover:underline">
              Syarat &amp; Ketentuan
            </Link>{" "}
            dan{" "}
            <Link href="/privasi" className="font-semibold text-[#D85834] hover:underline">
              Kebijakan Privasi
            </Link>
            .
          </p>
        )}
      </form>
    </AuthShell>
  );
}