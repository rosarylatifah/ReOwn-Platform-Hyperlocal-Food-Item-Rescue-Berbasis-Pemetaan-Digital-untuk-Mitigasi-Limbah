"use client";

import { useEffect, useState } from "react";

interface LiveCounterProps {
  unit: string;
  tonnesPerYear: number;
}

export const YEAR_SECONDS = 365 * 24 * 3600;

// Perkiraan akumulasi sejak 1 Januari tahun ini
function estimate(tonnesPerYear: number) {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const elapsed = (now.getTime() - start.getTime()) / 1000;
  return Math.floor(elapsed * (tonnesPerYear / YEAR_SECONDS));
}

export default function LiveCounter({ unit, tonnesPerYear }: LiveCounterProps) {
  const [value, setValue] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setValue(estimate(tonnesPerYear));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tonnesPerYear]);

  return (
    <div className="rounded-[22px] bg-[#16A34A] p-[7px]">
      <div className="rounded-2xl bg-[#FFF9F2] px-3 py-3 text-center font-mono text-stone-900">
        <p className="text-[11px]">sebanyak</p>
        <p className="my-1 text-2xl font-bold tabular-nums">{value === null ? "0" : value.toLocaleString("en-US")}</p>
        <p className="text-[11px] leading-tight">
          {unit}
          <br />
          Global secara Real-time
        </p>
      </div>
    </div>
  );
}
