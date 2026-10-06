import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "800"],
  variable: "--font-display",
});
const body = DM_Sans({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "ReOwn | Beri kesempatan kedua",
  description:
    "Platform hyper-lokal untuk menyelamatkan makanan berlebih dan barang layak pakai di sekitarmu.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body
        className={`${display.variable} ${body.variable} bg-[#FFF7E9] font-[family-name:var(--font-body)] text-stone-900 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
