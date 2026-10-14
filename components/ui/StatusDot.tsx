/**
 * Titik kecil yang warnanya berganti pelan-pelan (hijau, kuning, merah, biru)
 * dalam siklus 8 detik. Keyframes disertakan di sini supaya tidak perlu edit globals.css.
 */
export default function StatusDot({ className = "" }: { className?: string }) {
  return (
    <>
      <style>{`
        @keyframes reown-dot-cycle {
          0%, 100% { background-color: #22c55e; }
          25% { background-color: #f59e0b; }
          50% { background-color: #ef4444; }
          75% { background-color: #06b6d4; }
        }
        .reown-dot { animation: reown-dot-cycle 8s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .reown-dot { animation: none; } }
      `}</style>
      <span aria-hidden className={`reown-dot inline-block h-[7px] w-[7px] shrink-0 rounded-full bg-emerald-500 ${className}`} />
    </>
  );
}
