import AuthForm from "@/components/auth/AuthForm";

export const metadata = {
  title: "Buat Akun | ReOwn",
  description: "Daftar ke ReOwn dan mulai selamatkan barang di sekitarmu.",
};

export default function DaftarPage() {
  return <AuthForm mode="daftar" />;
}