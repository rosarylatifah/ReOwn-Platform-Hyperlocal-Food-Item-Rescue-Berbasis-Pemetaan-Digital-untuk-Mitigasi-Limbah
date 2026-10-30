"use client";

import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { fraunces } from '@/lib/fonts';

// Data simulasi pendapatan rescue (Puluhan Ribu)
const yearlyRevenueData = {
  '2026': [
    { month: 'Jan', makanan: 45000, barang: 30000, formattedMakanan: 'Rp 45.000', formattedBarang: 'Rp 30.000' },
    { month: 'Feb', makanan: 85000, barang: 60000, formattedMakanan: 'Rp 85.000', formattedBarang: 'Rp 60.000' },
    { month: 'Mar', makanan: 120000, barang: 95000, formattedMakanan: 'Rp 120.000', formattedBarang: 'Rp 95.000' },
    { month: 'Apr', makanan: 110000, barang: 140000, formattedMakanan: 'Rp 110.000', formattedBarang: 'Rp 140.000' },
    { month: 'Mei', makanan: 175000, barang: 130000, formattedMakanan: 'Rp 175.000', formattedBarang: 'Rp 130.000' },
    { month: 'Jun', makanan: 210000, barang: 180000, formattedMakanan: 'Rp 210.000', formattedBarang: 'Rp 180.000' },
    { month: 'Jul', makanan: 190000, barang: 230000, formattedMakanan: 'Rp 190.000', formattedBarang: 'Rp 230.000' },
    { month: 'Agu', makanan: 250000, barang: 210000, formattedMakanan: 'Rp 250.000', formattedBarang: 'Rp 210.000' },
    { month: 'Sep', makanan: 280000, barang: 260000, formattedMakanan: 'Rp 280.000', formattedBarang: 'Rp 260.000' },
    { month: 'Okt', makanan: 260000, barang: 290000, formattedMakanan: 'Rp 260.000', formattedBarang: 'Rp 290.000' },
    { month: 'Nov', makanan: 295000, barang: 270000, formattedMakanan: 'Rp 295.000', formattedBarang: 'Rp 270.000' },
    { month: 'Des', makanan: 300000, barang: 285000, formattedMakanan: 'Rp 300.000', formattedBarang: 'Rp 285.000' },
  ],
  '2025': [
    { month: 'Jan', makanan: 25000, barang: 20000, formattedMakanan: 'Rp 25.000', formattedBarang: 'Rp 20.000' },
    { month: 'Feb', makanan: 40000, barang: 45000, formattedMakanan: 'Rp 40.000', formattedBarang: 'Rp 45.000' },
    { month: 'Mar', makanan: 65000, barang: 70000, formattedMakanan: 'Rp 65.000', formattedBarang: 'Rp 70.000' },
    { month: 'Apr', makanan: 80000, barang: 60000, formattedMakanan: 'Rp 80.000', formattedBarang: 'Rp 60.000' },
    { month: 'Mei', makanan: 95000, barang: 110000, formattedMakanan: 'Rp 95.000', formattedBarang: 'Rp 110.000' },
    { month: 'Jun', makanan: 130000, barang: 125000, formattedMakanan: 'Rp 130.000', formattedBarang: 'Rp 125.000' },
    { month: 'Jul', makanan: 120000, barang: 150000, formattedMakanan: 'Rp 120.000', formattedBarang: 'Rp 150.000' },
    { month: 'Agu', makanan: 145000, barang: 140000, formattedMakanan: 'Rp 145.000', formattedBarang: 'Rp 140.000' },
    { month: 'Sep', makanan: 170000, barang: 165000, formattedMakanan: 'Rp 170.000', formattedBarang: 'Rp 165.000' },
    { month: 'Okt', makanan: 190000, barang: 180000, formattedMakanan: 'Rp 190.000', formattedBarang: 'Rp 180.000' },
    { month: 'Nov', makanan: 210000, barang: 200000, formattedMakanan: 'Rp 210.000', formattedBarang: 'Rp 200.000' },
    { month: 'Des', makanan: 240000, barang: 230000, formattedMakanan: 'Rp 240.000', formattedBarang: 'Rp 230.000' },
  ]
};

export default function RevenueChart({ onOpenModal, activeTooltip, setActiveTooltip }) {
  const [selectedYear, setSelectedYear] = useState('2026');

  const rawData = yearlyRevenueData[selectedYear] || yearlyRevenueData['2026'];

  const svgWidth = 1000;
  const svgHeight = 200;

  const highestValue = Math.max(
    ...rawData.map(d => Math.max(d.makanan, d.barang))
  );

  const maxVal = Math.max(300000, Math.ceil(highestValue / 50000) * 50000);

  const step = 50000;
  const yAxisTicks = [];
  for (let val = maxVal; val >= 0; val -= step) {
    yAxisTicks.push({
      value: val,
      label: val === 0 ? '0' : `${val / 1000}k`
    });
  }

  const chartData = rawData.map((item, idx) => {
    const marginHorizontal = 12;
    const x = marginHorizontal + (idx / (rawData.length - 1)) * (svgWidth - marginHorizontal * 2);
    const yMakanan = svgHeight - 20 - (item.makanan / maxVal) * (svgHeight - 40);
    const yBarang = svgHeight - 20 - (item.barang / maxVal) * (svgHeight - 40);
    return { ...item, x, yMakanan, yBarang };
  });

  const createPath = (points, keyY) => {
    return points.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x} ${pt[keyY]}` : `${acc} L ${pt.x} ${pt[keyY]}`;
    }, '');
  };

  const linePathMakanan = createPath(chartData, 'yMakanan');
  const areaPathMakanan = `${linePathMakanan} L ${chartData[chartData.length - 1].x} ${svgHeight} L ${chartData[0].x} ${svgHeight} Z`;

  const linePathBarang = createPath(chartData, 'yBarang');
  const areaPathBarang = `${linePathBarang} L ${chartData[chartData.length - 1].x} ${svgHeight} L ${chartData[0].x} ${svgHeight} Z`;

  const handleMouseMove = (e) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left + container.scrollLeft;
    const svgX = (mouseX / container.scrollWidth) * svgWidth;

    let closest = chartData[0];
    let minDistance = Math.abs(svgX - closest.x);

    chartData.forEach(item => {
      const dist = Math.abs(svgX - item.x);
      if (dist < minDistance) {
        minDistance = dist;
        closest = item;
      }
    });

    setActiveTooltip(closest);
  };

  const COLOR_FOOD = '#F23A10';
  const COLOR_ITEM = '#16A34A';

  return (
    <div className="relative flex w-full max-w-full flex-col justify-between overflow-hidden rounded-[22px] bg-white p-6 shadow-[6px_8px_8px_-2px_rgba(0,0,0,0.25)]">
      {/* HEADER, LEGENDA, FILTER TAHUN */}
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <h3 className={`${fraunces.className} m-0 text-lg font-extrabold uppercase tracking-tight text-stone-900`}>
              Pendapatan Penyelamatan
            </h3>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="cursor-pointer rounded-lg border-2 border-[#F23A10] bg-white px-2 py-1 text-xs font-bold text-[#E0452A] outline-none focus-visible:ring-4 focus-visible:ring-[#16A34A]/40"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
          </div>

          <div className="mt-1.5 flex gap-4">
            <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: COLOR_FOOD }}>
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLOR_FOOD }} />
              Makanan Terselamatkan
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: COLOR_ITEM }}>
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLOR_ITEM }} />
              Barang Terselamatkan
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className={`${fraunces.className} block text-xl font-extrabold text-[#F23A10]`}>
            {activeTooltip ? activeTooltip.formattedMakanan : chartData[chartData.length - 1].formattedMakanan}
          </span>
          <button
            onClick={() => onOpenModal('pendapatan')}
            className="mt-1 inline-flex items-center gap-1 rounded-xl bg-white px-3 py-1.5 text-[11px] font-semibold text-stone-900 shadow-sm ring-1 ring-stone-200 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#95F57C] hover:shadow-lg"
          >
            Halaman Pendapatan <ArrowUpRight size={13} />
          </button>
        </div>
      </div>

      {/* CONTAINER GRAFIK */}
      <div className="flex w-full items-stretch overflow-hidden rounded-2xl bg-[#FFF7E9]/60">
        {/* Skala Y */}
        <div className="flex select-none flex-col justify-between border-r border-stone-200 bg-[#FFF7E9] px-2.5 pb-[30px] pt-3 text-[10px] font-semibold text-stone-500">
          {yAxisTicks.map((tick, i) => (
            <span key={i}>{tick.label}</span>
          ))}
        </div>

        {/* Area grafik scroll */}
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setActiveTooltip(null)}
          className="box-border flex-1 overflow-x-auto overflow-y-hidden pb-4 pt-3"
        >
          <div
            className="relative h-[240px]"
            style={{ width: `${svgWidth}px`, minWidth: `${svgWidth}px` }}
          >
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="h-[200px] w-full overflow-visible"
            >
              <defs>
                <linearGradient id="gradientMakanan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLOR_FOOD} stopOpacity="0.35" />
                  <stop offset="100%" stopColor={COLOR_FOOD} stopOpacity="0.05" />
                </linearGradient>
                <linearGradient id="gradientBarang" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLOR_ITEM} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={COLOR_ITEM} stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {yAxisTicks.map((tick, i) => {
                const yPos = svgHeight - 20 - (tick.value / maxVal) * (svgHeight - 40);
                return (
                  <line key={i} x1="0" y1={yPos} x2={svgWidth} y2={yPos} stroke="#E7E0D6" strokeWidth="1" strokeDasharray="4 4" />
                );
              })}

              <path d={areaPathBarang} fill="url(#gradientBarang)" />
              <path d={linePathBarang} fill="none" stroke={COLOR_ITEM} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

              <path d={areaPathMakanan} fill="url(#gradientMakanan)" />
              <path d={linePathMakanan} fill="none" stroke={COLOR_FOOD} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

              {chartData.map((item, idx) => {
                const active = activeTooltip && activeTooltip.month === item.month;
                return (
                  <React.Fragment key={idx}>
                    <circle cx={item.x} cy={item.yBarang} r={active ? 6 : 4} fill={active ? COLOR_ITEM : '#FFF'} stroke={COLOR_ITEM} strokeWidth="2.5" />
                    <circle cx={item.x} cy={item.yMakanan} r={active ? 6 : 4} fill={active ? COLOR_FOOD : '#FFF'} stroke={COLOR_FOOD} strokeWidth="2.5" />
                  </React.Fragment>
                );
              })}

              {activeTooltip && (
                <line x1={activeTooltip.x} y1="0" x2={activeTooltip.x} y2={svgHeight} stroke="#78716C" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
              )}
            </svg>

            {/* Label bulan */}
            <div className="absolute bottom-0 left-0 flex w-full">
              {chartData.map((item) => {
                const active = activeTooltip && activeTooltip.month === item.month;
                return (
                  <span
                    key={item.month}
                    className={`absolute -translate-x-1/2 text-[11px] ${active ? 'font-bold text-[#F23A10]' : 'font-semibold text-stone-500'}`}
                    style={{ left: `${item.x}px` }}
                  >
                    {item.month}
                  </span>
                );
              })}
            </div>

            {/* Tooltip */}
            {activeTooltip && (
              <div
                className="pointer-events-none absolute top-2.5 z-10 -translate-x-1/2 whitespace-nowrap rounded-xl bg-white px-3 py-2 text-[11px] shadow-[4px_6px_8px_-2px_rgba(0,0,0,0.25)]"
                style={{ left: `${activeTooltip.x}px` }}
              >
                <div className="mb-1 text-center font-bold text-stone-900">
                  Bulan {activeTooltip.month} ({selectedYear})
                </div>
                <div className="flex items-center gap-1 font-bold" style={{ color: COLOR_FOOD }}>
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLOR_FOOD }} />
                  Makanan: {activeTooltip.formattedMakanan}
                </div>
                <div className="mt-0.5 flex items-center gap-1 font-bold" style={{ color: COLOR_ITEM }}>
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLOR_ITEM }} />
                  Barang: {activeTooltip.formattedBarang}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}