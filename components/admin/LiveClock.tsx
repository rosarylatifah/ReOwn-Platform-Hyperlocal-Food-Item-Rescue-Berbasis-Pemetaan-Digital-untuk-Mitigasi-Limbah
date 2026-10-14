"use client";

import { useEffect, useState } from "react";

function nowWIB() {
  const d = new Date();
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(d);
  const date = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jakarta", day: "2-digit", month: "2-digit", year: "2-digit",
  }).format(d);
  return { time: time + " WIB", date };
}

/** Jam WIB. Dirender setelah mount supaya tidak terjadi hydration mismatch. */
export default function LiveClock() {
  const [now, setNow] = useState<{ time: string; date: string } | null>(null);

  useEffect(() => {
    const tick = () => setNow(nowWIB());
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="adm-clock">
      <b>{now?.time ?? "--:-- WIB"}</b>
      <span>{now?.date ?? "--/--/--"}</span>
    </div>
  );
}
