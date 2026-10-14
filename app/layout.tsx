import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { AuthProvider } from "@/lib/auth";
import { CartProvider } from "@/lib/cart";
import CartDrawer from "@/components/cart/CartDrawer";
// NOTE: globals.css is imported by Next.js app-router conventions. If your editor
// still reports a missing-module error for the CSS side-effect import, keep the
// import but suppress the TypeScript diagnostic locally.
// @ts-expect-error - CSS side-effect import is resolved by Next.js at build time.
import "./globals.css";

const body = DM_Sans({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "ReOwn | Beri kesempatan kedua",
  description:
    "Platform hyper-lokal untuk menyelamatkan makanan berlebih dan barang layak pakai di sekitarmu.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" style={{ backgroundColor: "#FFF7E9" }}>
      <body
        style={{ backgroundColor: "#FFF7E9" }}
        className={`${body.variable} bg-[#FFF7E9] font-[family-name:var(--font-body)] text-stone-900 antialiased`}
      >
        <AuthProvider>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}