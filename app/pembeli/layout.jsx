"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { CartProvider } from "@/app/pembeli/context/cart";
import { CartDrawerProvider } from "@/app/pembeli/context/cartDrawer";
import { ChatProvider } from "@/app/pembeli/context/chat";
import { ReportProvider } from "@/app/pembeli/context/report";
import { NotificationProvider } from "@/app/context/notification";
import { ProfileDrawerProvider } from "@/lib/ProfileDrawer";
import { LocationProvider } from "@/lib/locationStore";
import BuyerNavbar from "@/components/pembeli/BuyerNavbar";
import BuyerCartDrawer from "@/components/pembeli/BuyerCartDrawer";
import LocationPrompt from "@/components/pembeli/LocationPrompt";
import ProfileDrawer from "@/components/profil/ProfileDrawer";
import Footer from "@/components/common/Footer";
import { FOOTER_LINKS } from "@/lib/navigation";

// "Jelajahi" di area pembeli mengarah ke daftar produk, bukan ke landing page
const BUYER_FOOTER_LINKS = FOOTER_LINKS.map((l) =>
  l.label === "Jelajahi" ? { ...l, href: "/pembeli/produk" } : l
);

export default function BuyerLayout({ children }) {
  const pathname = usePathname();
  const calm =
    pathname.startsWith("/pembeli/produk") ||
    pathname.startsWith("/pembeli/pesanan");

  return (
    <LocationProvider>
      <NotificationProvider>
        <ReportProvider>
          <ChatProvider>
            <CartProvider>
              <CartDrawerProvider>
                <ProfileDrawerProvider>
                  <BuyerNavbar />
                  <BuyerCartDrawer />
                  <ProfileDrawer />
                  <LocationPrompt />
                  <main
                    className={`relative min-h-screen bg-gradient-to-b ${
                      calm
                        ? "from-[#FFF7E9] via-[#FCF1DE] to-[#F4EDD6]/60"
                        : "from-[#FFF7E9] via-[#FEEBCB] to-[#EDE8B8]/70"
                    }`}
                  >
                    <div
                      aria-hidden
                      className={`pointer-events-none absolute inset-0 [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)] ${
                        calm
                          ? "bg-[radial-gradient(rgba(216,88,52,0.09)_1.5px,transparent_1.5px)]"
                          : "bg-[radial-gradient(rgba(216,88,52,0.22)_1.5px,transparent_1.5px)]"
                      }`}
                    />
                    <div className="relative z-10">{children}</div>
                  </main>
                  <div id="footer">
                    <Footer links={BUYER_FOOTER_LINKS} />
                  </div>
                </ProfileDrawerProvider>
              </CartDrawerProvider>
            </CartProvider>
          </ChatProvider>
        </ReportProvider>
      </NotificationProvider>
    </LocationProvider>
  );
}