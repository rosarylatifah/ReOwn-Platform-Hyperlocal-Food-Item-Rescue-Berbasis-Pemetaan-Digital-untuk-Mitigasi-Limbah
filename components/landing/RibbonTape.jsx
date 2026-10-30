"use client";

export default function RibbonTape() {
  const textItems = [
    "MASIH BERGUNA",
    "TERLUPAKAN",
    "DISELAMATKAN OLEHMU",
    "MASIH BERGUNA",
    "TERLUPAKAN",
    "DISELAMATKAN OLEHMU",
  ];

  return (
    <div className="relative w-full overflow-hidden bg-[#E84118] py-3 -rotate-2 shadow-md my-8">
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-ribbon-marquee {
          display: flex;
          width: max-content;
          animation: marquee 22s linear infinite;
        }
      `}</style>

      <div className="animate-ribbon-marquee items-center">
        {/* Render dua kali untuk efek infinite loop yang mulus */}
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="flex items-center space-x-6 px-3 text-white font-bold tracking-wider uppercase text-sm md:text-base"
          >
            {textItems.map((item, idx) => (
              <span key={idx} className="flex items-center">
                <span>{item}</span>
                <span className="mx-6 text-white/70">·</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}