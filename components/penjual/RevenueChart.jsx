"use client";

import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

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
  const svgHeight = 200; // Ditambah sedikit tingginya biar lega untuk 7 tingkatan kelipatan

  // 💡 OPSIONAL DYNAMIC: Mencari nilai tertinggi otomatis dari data
  const highestValue = Math.max(
    ...rawData.map(d => Math.max(d.makanan, d.barang))
  );

  // Jika nilai tertinggi di bawah 300k, patokan plafon di 300k. Kalau lebih, bulatkan ke kelipatan 50k
  const maxVal = Math.max(300000, Math.ceil(highestValue / 50000) * 50000);

  // Skala sumbu Y kelipatan 50k (0, 50k, 100k, 150k, 200k, 250k, 300k)
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

  return (
    <div style={{
      backgroundColor: '#FFF',
      borderRadius: '20px',
      padding: '24px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      border: '1px solid rgba(217, 90, 54, 0.1)',
      position: 'relative',
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      {/* HEADER, LEGENDA KATEGORI, & FILTER TAHUN */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1A1A1A', margin: 0 }}>
              Pendapatan Penyelamatan
            </h3>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
              style={{
                backgroundColor: '#FAF0EC',
                color: '#D95A36',
                border: '1px solid #FFDBCC',
                borderRadius: '8px',
                padding: '4px 8px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
            <span style={{ fontSize: '12px', color: '#D95A36', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#D95A36', display: 'inline-block' }}></span>
              Makanan Terselamatkan
            </span>
            <span style={{ fontSize: '12px', color: '#0EA5E9', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#0EA5E9', display: 'inline-block' }}></span>
              Barang Terselamatkan
            </span>
          </div>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#D95A36', fontFamily: 'Fraunces, serif', display: 'block' }}>
            {activeTooltip ? activeTooltip.formattedMakanan : chartData[chartData.length - 1].formattedMakanan}
          </span>
          <button 
            onClick={() => onOpenModal('pendapatan')}
            style={{
              backgroundColor: '#FAF0EC',
              color: '#D95A36',
              border: 'none',
              padding: '5px 12px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginTop: '4px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            Halaman Pendapatan <ArrowUpRight size={13} />
          </button>
        </div>
      </div>

      {/* CONTAINER GRAFIK DENGAN SKALA KELIPATAN 50K */}
      <div style={{ display: 'flex', width: '100%', alignItems: 'stretch', backgroundColor: '#FAFAFA', borderRadius: '12px', overflow: 'hidden' }}>
        
        {/* SKALA ANGKA SUMBU Y (0, 50k, 100k, 150k, 200k, 250k, 300k) */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between', 
          padding: '12px 10px 30px 10px', 
          fontSize: '10px', 
          fontWeight: '600', 
          color: '#999', 
          borderRight: '1px solid #E5E7EB',
          backgroundColor: '#F3F4F6',
          userSelect: 'none'
        }}>
          {yAxisTicks.map((tick, i) => (
            <span key={i}>{tick.label}</span>
          ))}
        </div>

        {/* AREA GRAFIK SCROLL */}
        <div 
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setActiveTooltip(null)}
          style={{ 
            flex: 1,
            overflowX: 'auto', 
            overflowY: 'hidden',
            padding: '12px 0 16px 0',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ width: `${svgWidth}px`, minWidth: `${svgWidth}px`, height: '240px', position: 'relative' }}>
            <svg 
              viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
              style={{ 
                width: '100%', 
                height: '200px', 
                overflow: 'visible'
              }}
            >
              <defs>
                <linearGradient id="gradientMakanan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D95A36" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#D95A36" stopOpacity="0.05" />
                </linearGradient>

                <linearGradient id="gradientBarang" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* GARIS HORIZONTAL GRID LINES (KELIPATAN 50K) */}
              {yAxisTicks.map((tick, i) => {
                const yPos = svgHeight - 20 - (tick.value / maxVal) * (svgHeight - 40);
                return (
                  <line 
                    key={i}
                    x1="0" 
                    y1={yPos} 
                    x2={svgWidth} 
                    y2={yPos} 
                    stroke="#E5E7EB" 
                    strokeWidth="1" 
                    strokeDasharray="4 4" 
                  />
                );
              })}

              {/* AREA & GARIS BARANG */}
              <path d={areaPathBarang} fill="url(#gradientBarang)" />
              <path d={linePathBarang} fill="none" stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

              {/* AREA & GARIS MAKANAN */}
              <path d={areaPathMakanan} fill="url(#gradientMakanan)" />
              <path d={linePathMakanan} fill="none" stroke="#D95A36" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

              {/* TITIK-TITIK CHART */}
              {chartData.map((item, idx) => (
                <React.Fragment key={idx}>
                  <circle 
                    cx={item.x} 
                    cy={item.yBarang} 
                    r={activeTooltip && activeTooltip.month === item.month ? 6 : 4} 
                    fill={activeTooltip && activeTooltip.month === item.month ? '#0EA5E9' : '#FFF'} 
                    stroke="#0EA5E9" 
                    strokeWidth="2.5" 
                  />
                  <circle 
                    cx={item.x} 
                    cy={item.yMakanan} 
                    r={activeTooltip && activeTooltip.month === item.month ? 6 : 4} 
                    fill={activeTooltip && activeTooltip.month === item.month ? '#D95A36' : '#FFF'} 
                    stroke="#D95A36" 
                    strokeWidth="2.5" 
                  />
                </React.Fragment>
              ))}

              {/* GARIS BANTU HOVER */}
              {activeTooltip && (
                <line 
                  x1={activeTooltip.x} 
                  y1="0" 
                  x2={activeTooltip.x} 
                  y2={svgHeight} 
                  stroke="#888" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 4" 
                  opacity="0.5"
                />
              )}
            </svg>

            {/* LABEL BULAN (JAN - DES) */}
            <div style={{ position: 'absolute', bottom: '0', left: 0, width: '100%', display: 'flex' }}>
              {chartData.map((item) => (
                <span 
                  key={item.month} 
                  style={{ 
                    position: 'absolute', 
                    left: `${item.x}px`, 
                    transform: 'translateX(-50%)', 
                    fontSize: '11px', 
                    color: activeTooltip && activeTooltip.month === item.month ? '#D95A36' : '#888', 
                    fontWeight: activeTooltip && activeTooltip.month === item.month ? 'bold' : '600' 
                  }}
                >
                  {item.month}
                </span>
              ))}
            </div>

            {/* TOOLTIP MELAYANG */}
            {activeTooltip && (
              <div style={{
                position: 'absolute',
                top: '10px',
                left: `${activeTooltip.x}px`,
                transform: 'translateX(-50%)',
                backgroundColor: '#FFF',
                padding: '8px 12px',
                borderRadius: '10px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                border: '1px solid rgba(0,0,0,0.1)',
                pointerEvents: 'none',
                fontSize: '11px',
                zIndex: 10,
                whiteSpace: 'nowrap'
              }}>
                <div style={{ fontWeight: 'bold', color: '#1A1A1A', marginBottom: '4px', textAlign: 'center' }}>
                  Bulan {activeTooltip.month} ({selectedYear})
                </div>
                <div style={{ color: '#D95A36', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D95A36' }}></span>
                  Makanan: {activeTooltip.formattedMakanan}
                </div>
                <div style={{ color: '#0EA5E9', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0EA5E9' }}></span>
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