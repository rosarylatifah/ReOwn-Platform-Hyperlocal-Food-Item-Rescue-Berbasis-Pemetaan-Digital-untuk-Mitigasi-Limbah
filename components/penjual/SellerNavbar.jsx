"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, MessageSquare, User } from "lucide-react";

import Logo from "@/components/common/Logo";
import ScrollAwareHeader from "@/components/common/ScrollAwareHeader";
import ProfilePopover from "@/components/profil/ProfilePopover";
import SellerNotificationPopover from "@/components/penjual/NotificationPopover";
import ChatPopover from "@/components/ChatPopover"; // 👈 Cukup import sekali dari folder penjual

import { useNotification } from "@/app/context/notification";
import { useChat } from "@/lib/chatStore"; // 👈 Gunakan chatStore yang seragam
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
  const [notifOpen, setNotifOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const pathname = usePathname();

  const { notifications } = useNotification();
  const { chats } = useChat(); 
  
  const sellerUnreadCount = notifications.filter(item => item.role === 'penjual' && item.unread).length;
  const sellerUnreadChatCount = chats.filter(c => c.unread).length;

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
            {/* Tombol Chat Desktop */}
            <button 
              type="button" 
              aria-label="Chat" 
              onClick={() => setChatOpen(true)} 
              className={`${iconBase} ${chatOpen ? pillActive : pill}`}
            >
              <MessageSquare size={19} strokeWidth={2} />
              {sellerUnreadChatCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#4ADE80] text-[11px] font-bold text-stone-900 shadow-md border-[1.5px] border-black">
                  {sellerUnreadChatCount}
                </span>
              )}
            </button>
            
            {/* Tombol Notifikasi Desktop */}
            <button 
              type="button" 
              aria-label="Notifikasi" 
              onClick={() => setNotifOpen(true)} 
              className={`${iconBase} ${notifOpen ? pillActive : pill}`}
            >
              <Bell size={19} strokeWidth={2} />
              {sellerUnreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#4ADE80] text-[11px] font-bold text-stone-900 shadow-md border-[1.5px] border-black">
                  {sellerUnreadCount}
                </span>
              )}
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
                    {/* Tombol Chat Mobile */}
                    <button
                      type="button"
                      onClick={() => { setMenuOpen(false); setChatOpen(true); }}
                      className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-stone-800 hover:bg-orange-50 w-full"
                    >
                      <span className="flex items-center gap-2.5">
                        <MessageSquare size={18} /> Chat
                      </span>
                      {sellerUnreadChatCount > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#4ADE80] text-[11px] font-bold text-stone-900 border border-black">
                          {sellerUnreadChatCount}
                        </span>
                      )}
                    </button>
                    
                    {/* Tombol Notifikasi Mobile */}
                    <button
                      type="button"
                      onClick={() => { setMenuOpen(false); setNotifOpen(true); }}
                      className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-stone-800 hover:bg-orange-50 w-full"
                    >
                      <span className="flex items-center gap-2.5">
                        <Bell size={18} /> Notifikasi
                      </span>
                      {sellerUnreadCount > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#4ADE80] text-[11px] font-bold text-stone-900 border border-black">
                          {sellerUnreadCount}
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => { setMenuOpen(false); setProfileOpen(true); }}
                      className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-base font-medium text-stone-800 hover:bg-orange-50"
                    >
                      <User size={18} /> Profil
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </nav>
      </ScrollAwareHeader>

      {/* Popover Profil, Notifikasi, & Chat Seller */}
      <ProfilePopover isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
      <SellerNotificationPopover isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
      <ChatPopover isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}