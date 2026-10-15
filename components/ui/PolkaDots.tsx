export interface Dot {
  left: number;
  top: number;
  width: number;
}

// Posisi & lebar dalam persen dari lebar/tinggi wadah (wadah harus relative + overflow-hidden)
export const DEFAULT_DOTS: Dot[] = [
  { left: 4, top: -32, width: 20 },
  { left: 39, top: -1, width: 23 },
  { left: 67, top: -12, width: 22 },
  { left: 92, top: 26, width: 16 },
  { left: -7, top: 52, width: 15 },
  { left: 13, top: 54, width: 22 },
  { left: 53, top: 80, width: 18 },
  { left: 82, top: 89, width: 15 },
];

export default function PolkaDots({ dots = DEFAULT_DOTS }: { dots?: Dot[] }) {
  return (
    <>
      {dots.map((c, i) => (
        <span
          key={i}
          aria-hidden
          className="pointer-events-none absolute aspect-square rounded-full bg-[#FDD9B9]/80"
          style={{ left: `${c.left}%`, top: `${c.top}%`, width: `${c.width}%` }}
        />
      ))}
    </>
  );
}