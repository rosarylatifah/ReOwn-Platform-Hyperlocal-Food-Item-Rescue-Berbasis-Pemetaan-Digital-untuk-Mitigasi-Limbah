import type { Metadata } from "next";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Masuk | ReOwn",
  description: "Masuk ke akun ReOwn-mu.",
};

export default function MasukPage() {
  return <AuthForm mode="masuk" />;
}