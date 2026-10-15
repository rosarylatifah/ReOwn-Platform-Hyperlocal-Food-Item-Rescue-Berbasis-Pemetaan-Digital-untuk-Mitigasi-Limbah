import { DM_Sans } from "next/font/google";
import { AuthProvider } from "@/lib/auth";
import { CartProvider } from "@/lib/cart";
import CartDrawer from "@/components/cart/CartDrawer";
import "./globals.css";

const body = DM_Sans({ subsets: ["latin"], variable: "--font-body" });

export const metadata = {
  title: "ReOwn | Beri kesempatan kedua",
  description:
    "Platform hyper-lokal untuk menyelamatkan makanan berlebih dan barang layak pakai di sekitarmu.",
};

export default function RootLayout({ children }) {
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