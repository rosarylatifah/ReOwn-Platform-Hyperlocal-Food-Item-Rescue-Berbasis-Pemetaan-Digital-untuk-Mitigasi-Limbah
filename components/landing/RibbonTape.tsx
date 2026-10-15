const TEXT = "TERLUPAKAN • DISELAMATKAN OLEHMU • MASIH BERGUNA • ";

export default function RibbonTape() {
  return (
    <div aria-hidden className="overflow-hidden py-14 md:py-20">
      <div className="-mx-8 flex w-[calc(100%+4rem)] -rotate-[2deg] overflow-hidden bg-[#EC4424] py-3.5 shadow-sm">
        <div className="animate-marquee flex shrink-0">
          <span className="shrink-0 whitespace-nowrap text-sm font-light tracking-[0.3em] text-white px-4">
            {TEXT.repeat(6)}
          </span>
          <span className="shrink-0 whitespace-nowrap text-sm font-light tracking-[0.3em] text-white px-4">
            {TEXT.repeat(6)}
          </span>
        </div>
      </div>
    </div>
  );
}