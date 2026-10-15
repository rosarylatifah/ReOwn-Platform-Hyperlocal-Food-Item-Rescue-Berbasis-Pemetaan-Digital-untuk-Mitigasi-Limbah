"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import {
  KIND_HINT, KIND_LABEL, MAX_BODY, STATUS_LABEL,
  sendMessage, useContactUser, useMessages,
  type ContactMessage, type MessageKind,
} from "@/lib/contact";
import "./contact.css";

const DRAFT_KEY = "reown_contact_draft";
const KINDS: MessageKind[] = ["pertanyaan", "saran", "kendala"];

const when = (iso: string) =>
  new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(new Date(iso));

/**
 * Kotak pesan di halaman Hubungi. Siapa pun bisa mengetik, tetapi MENGIRIM butuh akun:
 * bila belum login, tulisan disimpan sebagai draf dan pengunjung diarahkan masuk/daftar.
 * Pesan yang terkirim langsung muncul di panel admin (halaman Pesan Masuk).
 */
export default function ContactForm() {
  const { ready, user } = useContactUser();
  const { messages } = useMessages();
  const [kind, setKind] = useState<MessageKind>("pertanyaan");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState<{ subject?: string; body?: string }>({});
  const [gate, setGate] = useState(false);
  const [sent, setSent] = useState<ContactMessage | null>(null);
  const [restored, setRestored] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // pulihkan draf (mis. setelah pengunjung kembali dari halaman masuk/daftar)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const d = JSON.parse(raw) as { kind?: MessageKind; subject?: string; body?: string };
        if (d.subject || d.body) {
          setKind(d.kind && KINDS.includes(d.kind) ? d.kind : "pertanyaan");
          setSubject(d.subject ?? "");
          setBody(d.body ?? "");
          setRestored(true);
        }
      }
    } catch {}
    setHydrated(true);
  }, []);

  // simpan draf otomatis
  useEffect(() => {
    if (!hydrated) return;
    try {
      if (subject || body) localStorage.setItem(DRAFT_KEY, JSON.stringify({ kind, subject, body }));
      else localStorage.removeItem(DRAFT_KEY);
    } catch {}
  }, [hydrated, kind, subject, body]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: { subject?: string; body?: string } = {};
    if (subject.trim().length < 3) errs.subject = "Tulis subjek singkat, minimal 3 huruf.";
    if (body.trim().length < 10) errs.body = "Pesan terlalu singkat. Ceritakan minimal 10 karakter.";
    setErrors(errs);
    setSent(null);
    if (errs.subject || errs.body) return;
    if (!user) {
      setGate(true);
      return;
    }
    const msg = sendMessage({ kind, subject, body }, user);
    setSent(msg);
    setGate(false);
    setSubject("");
    setBody("");
    setRestored(false);
  };

  const mine = user ? messages.filter((m) => m.userEmail.toLowerCase() === user.email.toLowerCase()) : [];
  const currentUser = user as { name: string; email: string } | null;
  const isDemo = false;
  const demoLogout = () => undefined;

  return (
    <div className="ct">
      <form className="ct-card" onSubmit={submit} noValidate>
        <h2 className="ct-title">Kirim pesan ke kami</h2>
        <p className="ct-sub">Punya pertanyaan, saran, atau kendala? Tulis di sini. Pesanmu langsung masuk ke tim admin ReOwn.</p>

        <fieldset className="ct-kinds">
          <legend className="ct-label">Tentang apa?</legend>
          {KINDS.map((k) => (
            <label key={k} className="ct-kind">
              <input type="radio" name="kind" value={k} checked={kind === k} onChange={() => setKind(k)} />
              <span><b>{KIND_LABEL[k]}</b><small>{KIND_HINT[k]}</small></span>
            </label>
          ))}
        </fieldset>

        <div className="ct-field">
          <label className="ct-label" htmlFor="ct-subject">Subjek</label>
          <input
            id="ct-subject" className="ct-input" maxLength={80} value={subject}
            placeholder="Ringkasan singkat pesanmu"
            aria-invalid={errors.subject ? true : undefined}
            onChange={(e) => { setSubject(e.target.value); setErrors((x) => ({ ...x, subject: undefined })); }}
          />
          {errors.subject && <div className="ct-err" role="alert">{errors.subject}</div>}
        </div>

        <div className="ct-field">
          <label className="ct-label" htmlFor="ct-body">Pesan</label>
          <textarea
            id="ct-body" className="ct-input ct-textarea" rows={6} maxLength={MAX_BODY} value={body}
            placeholder="Ceritakan selengkapnya. Untuk kendala, sebutkan halaman dan langkah yang kamu lakukan."
            aria-invalid={errors.body ? true : undefined}
            onChange={(e) => { setBody(e.target.value); setErrors((x) => ({ ...x, body: undefined })); }}
          />
          <div className="ct-count">{body.length}/{MAX_BODY}</div>
          {errors.body && <div className="ct-err" role="alert">{errors.body}</div>}
        </div>

        {restored && !sent && <p className="ct-note">Draf pesanmu yang tadi sudah dipulihkan.</p>}

        {gate && !user && (
          <div className="ct-gate" role="alert">
            <b>Masuk dulu untuk mengirim</b>
            <p>Supaya pesanmu bisa kami balas, kamu perlu punya akun. Tulisanmu sudah tersimpan sebagai draf dan akan muncul lagi saat kamu kembali ke halaman ini.</p>
            <div className="ct-gate-actions">
              <Link href="/masuk" className="ct-btn">Masuk</Link>
              <Link href="/daftar" className="ct-btn ct-btn--ghost">Buat akun</Link>
            </div>
          <span className="ct-who">
            {currentUser ? (
              <>Dikirim sebagai <b>{currentUser.name}</b> ({currentUser.email})</>
            ) : (
              <>Untuk mengirim, kamu perlu akun.</>
            )}
          </span>
          </div>
        )}

        {sent && (
          <div className="ct-ok" role="status">
            <b>Pesan terkirim. Terima kasih!</b>
            <p>Nomor pesanmu <code>{sent.id}</code>. Tim admin akan menanggapi, dan balasannya muncul di bagian &ldquo;Pesanmu&rdquo; di bawah.</p>
          </div>
        )}

        <div className="ct-foot">
          <span className="ct-who">
            {currentUser ? (
              <>Dikirim sebagai <b>{currentUser.name}</b> ({currentUser.email})
                {isDemo && <> · <button type="button" className="ct-link" onClick={demoLogout}>Keluar akun uji</button></>}</>
            ) : (
              <>Untuk mengirim, kamu perlu akun.</>
            )}
          </span>
          <button type="submit" className="ct-send" disabled={!ready}>Kirim pesan</button>
        </div>
      </form>

      {user && mine.length > 0 && (
        <section className="ct-mine" aria-label="Pesanmu">
          <h3 className="ct-mine-title">Pesanmu</h3>
          <ul>
            {mine.map((m) => (
              <li key={m.id}>
                <div className="ct-mine-head">
                  <b>{m.subject}</b>
                  <span className={"ct-chip ct-chip--" + m.status}>{STATUS_LABEL[m.status]}</span>
                </div>
                <small>{KIND_LABEL[m.kind]} · {when(m.createdAt)} WIB · {m.id}</small>
                <p>{m.body}</p>
                {m.reply && (
                  <div className="ct-reply">
                    <b>Balasan dari {m.reply.by}</b> <small>{when(m.reply.at)} WIB</small>
                    <p>{m.reply.text}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}