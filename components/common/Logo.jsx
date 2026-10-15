import Link from "next/link";
import { fraunces } from "@/lib/fonts";

export default function Logo({ tone = "dark", size = "md" }) {
  const light = tone === "light";
  return (
    <Link
      href="/"
      aria-label="ReOwn, ke beranda"
      className={`${fraunces.className} font-extrabold leading-none tracking-tight ${
        size === "sm" ? "text-[24px]" : "text-[32px]"
      } ${light ? "text-white" : "text-stone-900"}`}
    >
      Re<span className={light ? "text-[#95F57C]" : ""}>Own</span>
    </Link>
  );
}