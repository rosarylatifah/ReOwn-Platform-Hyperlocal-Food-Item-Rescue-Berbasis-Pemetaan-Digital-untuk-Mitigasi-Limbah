"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/lib/ProfileContext";

export default function ProfileRedirect() {
  const router = useRouter();
  const { profile } = useProfile();

  useEffect(() => {
    router.replace(profile.isSellerActive ? "/penjual/beranda" : "/pembeli/beranda");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}