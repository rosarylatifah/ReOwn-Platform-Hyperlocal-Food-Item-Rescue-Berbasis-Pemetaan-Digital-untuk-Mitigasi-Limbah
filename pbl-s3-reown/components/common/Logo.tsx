import Link from "next/link";
import { Fraunces } from "next/font/google";

// Logo memakai font serif tebal seperti di prototype
const serif = Fraunces({ subsets: ["latin"], weight: ["700"] });

interface LogoProps {
  /** "light": cyan, untuk di atas latar oranye. "dark": gelap, untuk latar krem. */
  tone?: "light" | "dark";
}

export default function Logo({ tone = "dark" }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="ReOwn, ke beranda"
      className={`${serif.className} text-[28px] font-bold leading-none tracking-tight ${
        tone === "light" ? "text-[#7FF0E4]" : "text-stone-900"
      }`}
    >
      ReOwn
    </Link>
  );
}
