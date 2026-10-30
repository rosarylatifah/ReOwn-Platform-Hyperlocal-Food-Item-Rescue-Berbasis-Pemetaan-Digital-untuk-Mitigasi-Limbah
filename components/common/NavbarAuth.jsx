"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";

const DASHBOARD_HREF = "/pembeli/beranda";

export default function NavbarAuth({
  mobile = false,
  pillClass,
  ctaClass,
  loginHref,
  cta,
  arrow,
}) {
  const { user, hydrated } = useAuth();

  // Sebelum localStorage terbaca: sediakan ruang kosong agar tidak ada kedipan "Masuk"
  if (!hydrated) {
    return mobile ? null : <div className="h-10 w-48" aria-hidden />;
  }

  if (user) {
    if (mobile) {
      return (
        <div className="mt-2 border-t border-stone-100 pt-3">
          <Link href={DASHBOARD_HREF} className={`${ctaClass} w-full justify-center`}>
            Ke dashboard
            {arrow}
          </Link>
        </div>
      );
    }
    return (
      <Link href={DASHBOARD_HREF} className={ctaClass}>
        Ke dashboard
        {arrow}
      </Link>
    );
  }

  if (mobile) {
    return (
      <div className="mt-2 flex flex-col gap-2 border-t border-stone-100 pt-3">
        <Link
          href={loginHref}
          className="rounded-full border-[1.5px] border-stone-800 px-4 py-2.5 text-center text-base font-medium text-stone-900"
        >
          Masuk
        </Link>
        <Link href={cta.href} className={`${ctaClass} justify-center`}>
          {cta.label}
          {arrow}
        </Link>
      </div>
    );
  }

  return (
    <>
      <Link href={loginHref} className={pillClass}>
        Masuk
      </Link>
      <Link href={cta.href} className={ctaClass}>
        {cta.label}
        {arrow}
      </Link>
    </>
  );
}