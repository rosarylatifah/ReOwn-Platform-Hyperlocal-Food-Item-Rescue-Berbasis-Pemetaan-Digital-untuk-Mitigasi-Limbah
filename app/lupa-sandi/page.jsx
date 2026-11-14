import ForgotPasswordFlow from "@/components/auth/ForgotPasswordFlow";

export const metadata = {
  title: "Lupa Kata Sandi | ReOwn",
  description: "Pulihkan akun ReOwn-mu dengan kode yang dikirim ke email.",
};

export default function LupaSandiPage() {
  return <ForgotPasswordFlow variant="user" />;
}