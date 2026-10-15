"use client";

import { useEffect, useRef, useState } from "react";

const HIDE_AFTER = 96; // px: navbar baru boleh hilang setelah scroll sejauh ini
const THRESHOLD = 6; // px: abaikan gerakan scroll yang sangat kecil

export default function ScrollAwareHeader({ variant, children }) {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastY.current = window.scrollY;

    const update = () => {
      const y = Math.max(window.scrollY, 0);
      const delta = y - lastY.current;

      setScrolled(y > 8);

      if (y <= 8) {
        setHidden(false); // di paling atas: selalu tampil
        lastY.current = y;
      } else if (Math.abs(delta) > THRESHOLD) {
        // scroll turun -> sembunyi, scroll naik -> tampil
        setHidden(delta > 0 && y > HIDE_AFTER);
        lastY.current = y;
      }
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const base =
    "z-40 border-b will-change-transform transition-[transform,background-color,box-shadow] duration-300 ease-out";

  const look =
    variant === "overlay"
      ? `fixed inset-x-0 top-0 ${
          scrolled
            ? "border-white/20 bg-[#F24827]/95 shadow-lg shadow-black/10 backdrop-blur-md"
            : "border-white/40 bg-transparent"
        }`
      : `sticky top-0 border-stone-300 ${
          scrolled ? "bg-[#FFF7E9]/95 shadow-md backdrop-blur-md" : "bg-[#FFF7E9]"
        }`;

  return (
    <header
      className={`${base} ${look} ${hidden ? "-translate-y-full" : "translate-y-0"}`}
      onFocusCapture={() => setHidden(false)} // pengguna keyboard: tampil saat ada fokus
    >
      {children}
    </header>
  );
}