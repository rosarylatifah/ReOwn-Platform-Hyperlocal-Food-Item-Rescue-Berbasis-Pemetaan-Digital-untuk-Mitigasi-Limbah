import type { Metadata } from "next";
import PageShell from "@/components/common/PageShell";
import Reveal from "@/components/ui/Reveal";
import { fraunces } from "@/lib/fonts";
import { CONTACT } from "@/lib/site";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Hubungi Kami | ReOwn",
  description: "Punya pertanyaan, saran, atau kendala? Hubungi tim ReOwn.",
};

export default function HubungiPage() {
  const channels = [
    CONTACT.email && {
      label: "Email",
      value: CONTACT.email,
      href: `mailto:${CONTACT.email}`,
      emoji: "✉️",
    },
    CONTACT.whatsapp && {
      label: "WhatsApp",
      value: `+${CONTACT.whatsapp}`,
      href: `https://wa.me/${CONTACT.whatsapp}`,
      emoji: "💬",
    },
    CONTACT.instagram && {
      label: "Instagram",
      value: `@${CONTACT.instagram}`,
      href: `https://instagram.com/${CONTACT.instagram}`,
      emoji: "📸",
    },
  ].filter(Boolean) as { label: string; value: string; href: string; emoji: string }[];

  return (
    <PageShell
      width="wide"
      title="Hubungi kami"
      desc="Punya pertanyaan, saran, atau kendala saat memakai ReOwn? Kami senang mendengarnya."
    >
      {channels.length > 0 ? (
        <ul className="grid gap-5 sm:grid-cols-3">
          {channels.map((c, i) => (
            <Reveal as="li" key={c.label} delay={i * 100}>
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-[22px] bg-white p-6 shadow-[0_12px_30px_rgba(120,70,30,0.10)] ring-1 ring-stone-100 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_rgba(120,70,30,0.2)]"
              >
                <span aria-hidden className="text-3xl">{c.emoji}</span>
                <p className={`${fraunces.className} mt-4 text-lg font-extrabold text-stone-900`}>{c.label}</p>
                <p className="mt-1 break-all text-sm text-stone-600 transition-colors group-hover:text-[#D85834]">
                  {c.value}
                </p>
              </a>
            </Reveal>
          ))}
        </ul>
      ) : null}

      <Reveal className="mt-10">
        <ContactForm />
      </Reveal>
    </PageShell>
  );
}
