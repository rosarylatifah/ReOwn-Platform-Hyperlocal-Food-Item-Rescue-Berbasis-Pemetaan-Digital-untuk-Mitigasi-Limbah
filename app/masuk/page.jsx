import AuthForm from "@/components/auth/AuthForm";

export const metadata = {
  title: "Masuk | ReOwn",
  description: "Masuk ke ReOwn dan lanjutkan aksi menyelamatkan barang di sekitarmu.",
};

export default function MasukPage() {
  return <AuthForm mode="masuk" />;
}