"use client";

import { useChat } from "@/lib/chatStore";
import ChatPopover from "@/components/pembeli/ChatPopover";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, MessageSquare, User } from "lucide-react";

import Logo from "@/components/common/Logo";
import ScrollAwareHeader from "@/components/common/ScrollAwareHeader";
import ProfilePopover from "@/components/profil/ProfilePopover";
import { delaGothic } from "@/lib/fonts";
import { styles, pillBase } from "@/lib/navStyles";

const s = styles.overlay;
const pill = s.pill;
const pillActive = "border-white bg-white text-[#F24827] focus-visible:outline-white";

const iconBase =
  "relative grid h-11 w-11 shrink-0 place-items-center rounded-full border-[1.5px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 md:h-[41px] md:w-[41px]";

const NAV_ITEMS = [
  { id: "beranda", path: "/penjual/beranda", label: "Beranda" },
  { id: "kelola-produk", path: "/penjual/kelola-produk", label: "Kelola Produk" },
  { id: "pesanan", path: "/penjual/pesanan", label: "Pesanan" },
];

export default function SellerNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const { unreadChatCount } = useChat();
  const pathname = usePathname();

  return (
    <>
      <ScrollAwareHeader variant="overlay">
        <nav aria-label="Navigasi penjual" className="flex w-full items-center justify-between gap-6 bg-[#F24827] px-7 py-3.5">
          <Logo tone={s.logo} />

          {/* Menu tengah (desktop) */}
          <ul className={`${delaGothic.className} hidden items-center gap-2.5 xl:flex`}>
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li key={item.id}>
                  <Link
                    href={item.path}
                    aria-current={isActive ? "page" : undefined}
                    className={`${pillBase} ${isActive ? pillActive : pill}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Aksi kanan (desktop) */}
          <div className="hidden items-center gap-2.5 xl:flex">
<button type="button" aria-label="Chat" onClick={() => setChatOpen((v) => !v)} className={`${iconBase} ${chatOpen ? pillActive : pill}`}>
  <MessageSquare size={19} strokeWidth={2} />
  {unreadChatCount > 0 && (
    <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-[#95F57C] px-1 text-[11px] font-bold leading-none text-stone-900 ring-2 ring-stone-900">
      {unreadChatCount}
    </span>
  )}
</button>
            <button type="button" aria-label="Notifikasi" onClick={() => alert("Tidak ada notifikasi baru.")} className={`${iconBase} ${pill}`}>
              <Bell size={19} strokeWidth={2} />
            </button>
            <button
              type="button"
              aria-label="Profil"
              onClick={() => setProfileOpen(true)}
              className={`${iconBase} ${profileOpen ? pillActive : pill}`}
            >
              <User size={19} strokeWidth={2} />
            </button>
          </div>

          {/* Mobile: burger */}
          <div className="relative xl:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={menuOpen}
              className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-[1.5px] ${s.burger}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                {menuOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 -z-10" onClick={() => setMenuOpen(false)} aria-hidden />
                <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white p-3 shadow-xl">
                  {NAV_ITEMS.map((item) => (
                    <Link
                      key={item.id}
                      href={item.path}
                      onClick={() => setMenuOpen(false)}
                      aria-current={pathname === item.path ? "page" : undefined}
                      className={`block rounded-xl px-4 py-3 text-base font-medium hover:bg-orange-50 ${
                        pathname === item.path ? "bg-[#95F57C]/40 text-stone-900" : "text-stone-800"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="mt-2 flex flex-col gap-1 border-t border-stone-100 pt-3">
                    {[
                      { label: "Chat", Icon: MessageSquare, onClick: () => alert("Fitur Chat Seller akan datang!") },
                      { label: "Notifikasi", Icon: Bell, onClick: () => alert("Tidak ada notifikasi baru.") },
                      { label: "Profil", Icon: User, onClick: () => { setMenuOpen(false); setProfileOpen(true); } },
                    ].map(({ label, Icon, onClick }) => (
                      <button
                        key={label}
                        type="button"
                        onClick={onClick}
                        className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-base font-medium text-stone-800 hover:bg-orange-50"
                      >
                        <Icon size={18} /> {label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </nav>
      </ScrollAwareHeader>

      <ProfilePopover isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
        <ChatPopover isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}