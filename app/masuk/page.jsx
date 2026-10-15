import AuthForm from "@/components/auth/AuthForm";

export const metadata = {
  title: "Masuk | ReOwn",
  description: "Masuk ke akun ReOwn-mu.",
};

export default function MasukPage() {
  return <AuthForm mode="masuk" />;
}