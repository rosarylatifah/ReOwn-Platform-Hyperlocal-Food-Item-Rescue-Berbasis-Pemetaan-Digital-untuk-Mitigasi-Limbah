"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Bell, MessageSquare, User } from "lucide-react";

import Logo from "@/components/common/Logo";
import ScrollAwareHeader from "@/components/common/ScrollAwareHeader";
import { delaGothic } from "@/lib/fonts";
import { styles, pillBase } from "@/lib/navStyles";

import { useCart } from "@/app/pembeli/context/cart";
import { useChat } from "@/app/pembeli/context/chat";
import { useNotification } from "@/app/context/notification"; 
import { useCartDrawer } from "@/app/pembeli/context/cartDrawer";

import NotificationPopover from "@/components/pembeli/NotificationPopover";
import ChatPopover from "@/components/pembeli/ChatPopover";
import ProfilePopover from "@/components/profil/ProfilePopover";

const s = styles.overlay;
const pill = s.pill;
const pillActive = "border-white bg-white text-[#F24827] focus-visible:outline-white";

const iconBase =
  "relative grid h-11 w-11 shrink-0 place-items-center rounded-full border-[1.5px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 md:h-[41px] md:w-[41px]";

const NAV_ITEMS = [
  { id: "beranda", path: "/pembeli/beranda", label: "Beranda" },
  { id: "produk", path: "/pembeli/produk", label: "Produk" },
  { id: "pesanan", path: "/pembeli/pesanan", label: "Pesanan" },
  { id: "tentang", label: "Tentang Kami", footer: true },
];

function Badge({ value }) {
  if (!value) return null;
  return (
    <motion.span
      key={value}
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 14 }}
      className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-[#95F57C] px-1 text-[11px] font-bold leading-none text-stone-900 ring-2 ring-stone-900"
    >
      {value}
    </motion.span>
  );
}

function CartIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 7h12l1 13H5L6 7Z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
  );
}

export default function BuyerNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePopover, setActivePopover] = useState(null);
  
  // State tambahan buat nyimpen ID chat aktif kalau dipicu dari tombol "Hubungi Penjual" di halaman lain
  const [externalChatId, setExternalChatId] = useState(null);

  const { totalCartItems } = useCart();
  const { unreadChatCount } = useChat();
  const { notifications } = useNotification();
  const { open: openCart } = useCartDrawer();
  const pathname = usePathname();

  // Efek listener buat nangkep event jika ada halaman lain yang nyuruh buka chat / profil
  useEffect(() => {
    const handleOpenChatEvent = (e) => {
      if (e.detail && e.detail.chatId) {
        setExternalChatId(e.detail.chatId);
      }
      setActivePopover("chat");
    };

    window.addEventListener("open-buyer-chat", handleOpenChatEvent);
    return () => {
      window.removeEventListener("open-buyer-chat", handleOpenChatEvent);
    };
  }, []);

  // Hitung jumlah unread khusus untuk pembeli
  const buyerUnreadCount = notifications.filter(
    (item) => item.role === 'pembeli' || !item.role
  ).filter((item) => item.unread === true).length;

  const togglePopover = (name) => {
    setMenuOpen(false);
    if (name !== "chat") setExternalChatId(null); // Reset external chat kalau buka menu lain
    setActivePopover((prev) => (prev === name ? null : name));
  };

  const iconClass = (active) => `${iconBase} ${active ? pillActive : pill}`;

  const handleOpenCart = () => {
    setMenuOpen(false);
    setActivePopover(null);
    openCart();
  };

  const scrollToFooter = () => {
    setMenuOpen(false);
    setActivePopover(null);
    setTimeout(() => {
      const el = document.getElementById("footer") || document.querySelector("footer");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "end" });
      else window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
    }, 50);
  };

  const quickActions = [
    { id: "chat", label: "Chat", Icon: MessageSquare, count: unreadChatCount },
    { id: "notif", label: "Notifikasi", Icon: Bell, count: buyerUnreadCount },
    { id: "profile", label: "Profil", Icon: User, count: 0 },
  ];

  const cartLabel = totalCartItems ? `Buka keranjang, ${totalCartItems} barang` : "Buka keranjang";

  return (
    <>
      <ScrollAwareHeader variant="overlay">
        <nav aria-label="Navigasi pembeli" className="flex w-full items-center justify-between gap-6 bg-[#F24827] px-7 py-3.5">
          <Logo tone={s.logo} />

          {/* Menu tengah (desktop) */}
          <ul className={`${delaGothic.className} hidden items-center gap-3 lg:flex`}>
            {NAV_ITEMS.map((item) => {
              if (item.footer) {
                return (
                  <li key={item.id}>
                    <button type="button" onClick={scrollToFooter} className={`${pillBase} ${pill}`}>
                      {item.label}
                    </button>
                  </li>
                );
              }

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
          <div className="hidden items-center gap-2.5 lg:flex">
            {quickActions.slice(0, 2).map(({ id, label, Icon, count }) => (
              <button
                key={id}
                type="button"
                onClick={() => togglePopover(id)}
                aria-label={label}
                className={iconClass(activePopover === id)}
              >
                <Icon size={19} strokeWidth={2} />
                <Badge value={count} />
              </button>
            ))}

            <button type="button" onClick={handleOpenCart} aria-label={cartLabel} className={`${iconBase} ${pill}`}>
              <CartIcon />
              <Badge value={totalCartItems} />
            </button>

            <button
              type="button"
              onClick={() => togglePopover("profile")}
              aria-label="Profil"
              className={iconClass(activePopover === "profile")}
            >
              <User size={19} strokeWidth={2} />
            </button>
          </div>

          {/* Mobile: keranjang + burger */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <button type="button" onClick={handleOpenCart} aria-label={cartLabel} className={`${iconBase} ${pill}`}>
              <CartIcon />
              <Badge value={totalCartItems} />
            </button>

            <div className="relative">
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
                    {NAV_ITEMS.map((item) =>
                      item.footer ? (
                        <button
                          key={item.id}
                          type="button"
                          onClick={scrollToFooter}
                          className="block w-full rounded-xl px-4 py-3 text-left text-base font-medium text-stone-800 hover:bg-orange-50"
                        >
                          {item.label}
                        </button>
                      ) : (
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
                      )
                    )}
                    <div className="mt-2 flex flex-col gap-1 border-t border-stone-100 pt-3">
                      {quickActions.map(({ id, label, Icon, count }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => togglePopover(id)}
                          className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-stone-800 hover:bg-orange-50"
                        >
                          <span className="flex items-center gap-2.5">
                            <Icon size={18} /> {label}
                          </span>
                          {count > 0 && (
                            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#95F57C] px-1 text-[11px] font-bold text-stone-900 ring-2 ring-stone-900">
                              {count}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </nav>
      </ScrollAwareHeader>

      {/* Popover dengan sinkronisasi externalChatId */}
      <ChatPopover 
        isOpen={activePopover === "chat"} 
        onClose={() => { setActivePopover(null); setExternalChatId(null); }} 
        externalActiveChatId={externalChatId}
        onClearActiveChat={() => setExternalChatId(null)}
      />
      <NotificationPopover isOpen={activePopover === "notif"} onClose={() => setActivePopover(null)} />
      <ProfilePopover isOpen={activePopover === "profile"} onClose={() => setActivePopover(null)} />
    </>
  );
}