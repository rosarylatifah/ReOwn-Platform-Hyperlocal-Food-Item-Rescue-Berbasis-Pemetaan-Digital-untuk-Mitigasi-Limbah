"use client";

import { useEffect, useRef, useState } from "react";
import AuthShell, { Highlight } from "./AuthShell";
import { requestReset, setNewPassword, verifyCode } from "@/lib/passwordReset";

const inputBase =
  "w-full rounded-xl border bg-[#FBF9F7] px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 transition-shadow focus:outline-none focus:ring-2";
const inputOk = "border-stone-200 focus:border-[#D85834] focus:ring-[#D85834]/30";
const inputBad = "border-red-400 focus:border-red-500 focus:ring-red-300/50";
const btn =
  "group flex w-full items-center justify-center gap-2 rounded-xl bg-[#D85834] py-3 text-[15px] font-semibold text-white shadow-[0_8px_20px_rgba(216,88,52,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#C24A28] active:translate-y-0 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D85834] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0";

const LEVEL_LABEL = ["", "Masih tunas 🌱", "Mulai tumbuh 🌿", "Rindang 🌳", "Pohon kokoh 🌲"];
const LEVEL_COLOR = ["", "bg-[#F24827]", "bg-[#F5A623]", "bg-[#7AD65E]", "bg-[#2FAE5B]"];
const RESEND_SECONDS = 60;

function strength(pw) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 12) s++;
  return Math.max(1, s);
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

function Err({ children }) {
  if (!children) return null;
  return <p role="alert" className="mt-1 text-xs font-medium text-red-600">{children}</p>;
}

function PasswordField({ id, label, value, onChange, error, placeholder, autoComplete }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-bold text-stone-900">{label}</label>
      <div className="relative mt-1">
        <input
          id={id}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          aria-invalid={!!error}
          className={`${inputBase} ${error ? inputBad : inputOk} pr-11`}
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
      <Err>{error}</Err>
    </div>
  );
}

function StrengthMeter({ password }) {
  const s = strength(password);
  if (!s) return null;
  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-1 gap-1.5">
        {[1, 2, 3, 4].map((n) => (
          <span key={n} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${n <= s ? LEVEL_COLOR[s] : "bg-stone-200"}`} />
        ))}
      </div>
      <span className="text-xs font-semibold text-stone-600">{LEVEL_LABEL[s]}</span>
    </div>
  );
}

function OtpInput({ digits, setDigits, error }) {
  const refs = useRef([]);
  const put = (i, v) => setDigits((d) => d.map((x, k) => (k === i ? v : x)));
  return (
    <div
      className="flex justify-center gap-2"
      onPaste={(e) => {
        const t = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (!t) return;
        e.preventDefault();
        setDigits(Array.from({ length: 6 }, (_, k) => t[k] ?? ""));
        refs.current[Math.min(t.length, 5)]?.focus();
      }}
    >
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          value={d}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          aria-label={`Digit ke-${i + 1}`}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "").slice(-1);
            put(i, v);
            if (v && i < 5) refs.current[i + 1]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
          }}
          className={`h-12 w-10 rounded-xl border bg-[#FBF9F7] text-center text-lg font-bold text-stone-900 focus:outline-none focus:ring-2 sm:w-12 ${error ? inputBad : inputOk}`}
        />
      ))}
    </div>
  );
}

export default function ForgotPasswordFlow({ variant = "user" }) {
  const isAdmin = variant === "admin";
  const loginHref = isAdmin ? "/admin/masuk" : "/masuk";

  const [step, setStep] = useState("email"); // email | kode | baru | selesai
  const [email, setEmail] = useState("");
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [demoCode, setDemoCode] = useState(null);
  const [left, setLeft] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (step !== "kode" || left <= 0) return;
    const t = setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [step, left]);

  const send = async () => {
    await requestReset(email, variant);
    setLeft(RESEND_SECONDS);
  };

  const onEmail = async (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setErrors({ email: "Format email belum benar." });
      return;
    }
    setErrors({});
    setLoading(true);
    await send();
    setLoading(false);
    setStep("kode");
  };

  const onResend = async () => {
    setDigits(["", "", "", "", "", ""]);
    setErrors({});
    await send();
  };

  const onCode = async (e) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < 6) {
      setErrors({ code: "Isi 6 digit kode dulu." });
      return;
    }
    setLoading(true);
    const res = await verifyCode(email, code);
    setLoading(false);
    if (!res.ok) {
      setErrors({ code: res.error });
      return;
    }
    setErrors({});
    setStep("baru");
  };

  const onPassword = async (e) => {
    e.preventDefault();
    const errs = {};
    if (pw.length < 8) errs.pw = "Kata sandi minimal 8 karakter.";
    if (confirm !== pw) errs.confirm = "Konfirmasi kata sandi tidak sama.";
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    const res = await setNewPassword(email, variant, pw);
    setLoading(false);
    if (!res.ok) {
      setErrors({ form: res.error });
      return;
    }
    setErrors({});
    setStep("selesai");
  };

  const heading = {
    email: (<>Lupa <Highlight>kata sandi</Highlight>?</>),
    kode: (<>Cek <Highlight>kodemu</Highlight></>),
    baru: (<>Sandi <Highlight>baru</Highlight></>),
    selesai: (<>Beres, <Highlight>aman</Highlight>!</>),
  }[step];

  const desc = {
    email: isAdmin
      ? "Masukkan email akun admin, kami kirim kode pemulihan."
      : "Masukkan email akunmu, kami kirim kode pemulihan.",
    kode: "Masukkan 6 digit kode yang kami kirim ke emailmu. Kode berlaku 10 menit.",
    baru: "Buat kata sandi baru yang kuat dan mudah kamu ingat.",
    selesai: "Kata sandimu sudah diperbarui.",
  }[step];

  return (
    <AuthShell
      heading={heading}
      desc={desc}
      switchText="Ingat kata sandimu?"
      switchLabel="Kembali masuk"
      switchHref={loginHref}
    >
      {step === "email" && (
        <form onSubmit={onEmail} noValidate className="space-y-3">
          <div>
            <label htmlFor="fp-email" className="block text-[13px] font-bold text-stone-900">Alamat Email</label>
            <div className="mt-1">
              <input
                id="fp-email"
                type="email"
                autoComplete="email"
                  placeholder="nama@email.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors({}); }}
                aria-invalid={!!errors.email}
                className={`${inputBase} ${errors.email ? inputBad : inputOk}`}
              />
            </div>
            <Err>{errors.email}</Err>
          </div>
          <button type="submit" disabled={loading} className={btn}>
            {loading ? "Mengirim..." : "Kirim kode"}
          </button>
          <p className="text-center text-[11px] leading-snug text-stone-500">
            Jika email terdaftar, kode pemulihan akan dikirim.
          </p>
        </form>
      )}

      {step === "kode" && (
        <form onSubmit={onCode} noValidate className="space-y-4">
          <p className="text-center text-sm text-stone-600">
            Kode dikirim ke <span className="font-bold text-stone-900">{email.trim()}</span>
          </p>

          <OtpInput digits={digits} setDigits={(v) => { setDigits(v); setErrors({}); }} error={errors.code} />
          <Err>{errors.code}</Err>

          <button type="submit" disabled={loading} className={btn}>
            {loading ? "Memeriksa..." : "Verifikasi"}
          </button>

          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => { setStep("email"); setErrors({}); setDigits(["", "", "", "", "", ""]); }}
              className="font-semibold text-stone-500 hover:text-stone-800"
            >
              ← Ganti email
            </button>
            {left > 0 ? (
              <span className="text-stone-500">Kirim ulang kode ({left} detik)</span>
            ) : (
              <button type="button" onClick={onResend} className="font-semibold text-[#E0452A] underline underline-offset-2 hover:text-[#C24A28]">
                Kirim ulang kode
              </button>
            )}
          </div>
        </form>
      )}

      {step === "baru" && (
        <form onSubmit={onPassword} noValidate className="space-y-3">
          <div className="space-y-1.5">
            <PasswordField
              id="fp-pw"
              label="Kata Sandi Baru"
              value={pw}
              onChange={(e) => { setPw(e.target.value); setErrors({}); }}
              error={errors.pw}
              placeholder="Minimal 8 karakter"
              autoComplete="new-password"
            />
            <StrengthMeter password={pw} />
          </div>
          <PasswordField
            id="fp-confirm"
            label="Konfirmasi Kata Sandi"
            value={confirm}
            onChange={(e) => { setConfirm(e.target.value); setErrors({}); }}
            error={errors.confirm}
            placeholder="Ketik ulang kata sandi"
            autoComplete="new-password"
          />
          {errors.form && (
            <p role="alert" className="rounded-xl bg-red-50 px-3.5 py-2 text-sm font-medium text-red-700">{errors.form}</p>
          )}
          <button type="submit" disabled={loading} className={btn}>
            {loading ? "Menyimpan..." : "Simpan kata sandi"}
          </button>
        </form>
      )}

      {step === "selesai" && (
        <div className="space-y-4 py-2 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-100 text-green-600">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="m5 12.5 4.5 4.5L19 7.5" />
            </svg>
          </span>
          <p className="text-sm text-stone-600">Kata sandi diperbarui. Silakan masuk dengan kata sandi barumu.</p>
          <a href={loginHref} className={btn}>Masuk sekarang</a>
        </div>
      )}
    </AuthShell>
  );
}