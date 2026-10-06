const TEXT = "MASIH BERGUNA • TERLUPAKAN • DISELAMATKAN OLEHMU • ";

export default function RibbonTape() {
  return (
    <div aria-hidden className="overflow-hidden py-10">
      <div className="-rotate-2 whitespace-nowrap bg-[#E05A47] py-3 font-display text-lg font-semibold tracking-widest text-white">
        {TEXT.repeat(6)}
      </div>
    </div>
  );
}
