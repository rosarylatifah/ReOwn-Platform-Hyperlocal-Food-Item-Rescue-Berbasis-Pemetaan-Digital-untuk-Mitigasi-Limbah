import type { Metadata } from "next";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Buat Akun | ReOwn",
  description: "Daftar ke ReOwn dan mulai selamatkan barang di sekitarmu.",
};

export default function DaftarPage() {
  return <AuthForm mode="daftar" />;
}