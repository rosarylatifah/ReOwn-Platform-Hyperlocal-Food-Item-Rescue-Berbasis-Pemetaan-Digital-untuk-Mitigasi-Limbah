"use client";

import React, { useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { fraunces } from "@/lib/fonts";
import { useOrders } from "@/lib/ordersStore";

ChartJS.register(ArcElement, Tooltip, Legend);

const LIST_BULAN = [
  { value: "all", label: "Semua Bulan" },
  { value: "0", label: "Januari" },
  { value: "1", label: "Februari" },
  { value: "2", label: "Maret" },
  { value: "3", label: "April" },
  { value: "4", label: "Mei" },
  { value: "5", label: "Juni" },
  { value: "6", label: "Juli" },
  { value: "7", label: "Agustus" },
  { value: "8", label: "September" },
  { value: "9", label: "Oktober" },
  { value: "10", label: "November" },
  { value: "11", label: "Desember" },
];

export default function DonutChart() {
  const { orders } = useOrders();
  const [activeCategory, setActiveCategory] = useState("food");

  // 📅 State untuk filter Tanggal, Bulan, dan Tahun
  const [selectedTanggal, setSelectedTanggal] = useState("all"); // 'all' atau '1' - '31'
  const [selectedBulan, setSelectedBulan] = useState(String(new Date().getMonth())); // Default bulan sekarang
  const [selectedTahun, setSelectedTahun] = useState(String(new Date().getFullYear())); // Default tahun sekarang

  // 🔍 Fungsi helper untuk membaca berbagai format tanggal pesanan
  const parseOrderDate = (dateStr) => {
    if (!dateStr) return null;
    
    // Coba parse langsung jika format standar (ISO / YYYY-MM-DD)
    let d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d;

    // Jika format lokal teks (contoh: "7 Nov 2026, 16.18" atau "7 Nov 2026")
    const monthsMap = {
      jan: 0, feb: 1, mar: 2, apr: 3, mei: 4, jun: 5,
      jul: 6, agu: 7, sep: 8, okt: 9, nov: 10, des: 11
    };

    const cleanStr = dateStr.toLowerCase();
    for (const [mName, mIndex] of Object.entries(monthsMap)) {
      if (cleanStr.includes(mName)) {
        // Ekstrak angka dari string (cari tanggal dan tahun)
        const numbers = cleanStr.match(/\d+/g);
        if (numbers && numbers.length >= 2) {
          const day = parseInt(numbers[0], 10);
          const year = parseInt(numbers.find(num => num.length === 4) || new Date().getFullYear(), 10);
          return new Date(year, mIndex, day);
        }
      }
    }
    return null;
  };

  // 🔍 Filter pesanan berstatus "Selesai" berdasarkan Tanggal, Bulan, & Tahun
  const completedOrders = orders.filter((order) => {
    const isCompleted = (order.status || "").toLowerCase() === "selesai";
    if (!isCompleted) return false;

    const orderDateStr = order.completedAt || order.createdAt || order.orderDate;
    const orderDate = parseOrderDate(orderDateStr);
    
    // Jika tanggal tidak valid, lewati agar tidak error
    if (!orderDate) return false;

    const matchTahun = orderDate.getFullYear().toString() === selectedTahun;
    const matchBulan = selectedBulan === "all" || orderDate.getMonth().toString() === selectedBulan;
    const matchTanggal = selectedTanggal === "all" || orderDate.getDate().toString() === selectedTanggal;

    return matchTahun && matchBulan && matchTanggal;
  });

  let totalFood = 0;
  let totalItem = 0;

  completedOrders.forEach((order) => {
    const qty = Number(order.quantity) || 1;
    const category = (order.category || "").toLowerCase();

    if (category.includes("makanan") || category.includes("food")) {
      totalFood += qty;
    } else {
      totalItem += qty;
    }
  });

  // Jika pada tanggal/bulan tersebut tidak ada data sama sekali, tampilkan 0 (bukan data dummy statis lagi)
  const foodCount = totalFood;
  const itemCount = totalItem;
  const totalCount = foodCount + itemCount > 0 ? foodCount + itemCount : 1; // Mencegah pembagian dengan nol

  const foodPercentage = Math.round((foodCount / totalCount) * 100);
  const itemPercentage = Math.round((itemCount / totalCount) * 100);

  const data = {
    labels: ["Makanan Terselamatkan", "Barang Terselamatkan"],
    datasets: [
      {
        data: [foodCount > 0 ? foodCount : 0.001, itemCount > 0 ? itemCount : 0.001], // Biar chart tidak error kalau kosong
        backgroundColor: [
          "#D95A36", // 🍊 Oranye untuk Makanan
          "#22C55E", // 🍏 Hijau untuk Barang
        ],
        borderColor: ["#FFFFFF", "#FFFFFF"],
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    cutout: "70%",
    onClick: (event, elements) => {
      if (elements && elements.length > 0) {
        setActiveCategory(elements[0].index === 0 ? "food" : "item");
      }
    },
  };

  const namaBulanAktif = selectedBulan === "all" 
    ? "Semua Bulan" 
    : LIST_BULAN.find(b => b.value === selectedBulan)?.label || "";

  const infoPeriode = selectedTanggal === "all"
    ? `${namaBulanAktif} ${selectedTahun}`
    : `Tgl ${selectedTanggal} ${namaBulanAktif} ${selectedTahun}`;

  return (
    <div className="flex h-full flex-col justify-between rounded-[22px] bg-white p-6 shadow-[0_12px_30px_rgba(120,70,30,0.08)] ring-1 ring-stone-100">
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className={`${fraunces.className} text-lg font-extrabold uppercase tracking-tight text-stone-900`}>
              Rasio Penyelamatan
            </h3>
            <p className="mt-0.5 text-xs text-stone-500">
              Akumulasi otomatis dari pesanan Selesai.
            </p>
          </div>

          {/* 🔽 DROPDOWN FILTER TANGGAL, BULAN, & TAHUN */}
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Dropdown Tanggal (1 - 31) */}
            <select
              value={selectedTanggal}
              onChange={(e) => setSelectedTanggal(e.target.value)}
              className="rounded-xl border border-stone-300 bg-stone-50 px-2.5 py-1.5 text-xs font-bold text-stone-700 shadow-sm focus:border-[#D95A36] focus:outline-none"
            >
              <option value="all">Semua Tgl</option>
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i + 1} value={String(i + 1)}>
                  {i + 1}
                </option>
              ))}
            </select>

            {/* Dropdown Bulan */}
            <select
              value={selectedBulan}
              onChange={(e) => setSelectedBulan(e.target.value)}
              className="rounded-xl border border-stone-300 bg-stone-50 px-2.5 py-1.5 text-xs font-bold text-stone-700 shadow-sm focus:border-[#D95A36] focus:outline-none"
            >
              {LIST_BULAN.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            {/* Dropdown Tahun */}
            <select
              value={selectedTahun}
              onChange={(e) => setSelectedTahun(e.target.value)}
              className="rounded-xl border border-stone-300 bg-stone-50 px-2.5 py-1.5 text-xs font-bold text-stone-700 shadow-sm focus:border-[#D95A36] focus:outline-none"
            >
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
            </select>
          </div>
        </div>

        {/* Toggle Kategori Makanan / Barang */}
        <div className="flex items-center gap-2 mb-2">
          <button
            type="button"
            onClick={() => setActiveCategory("food")}
            className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
              activeCategory === "food"
                ? "bg-[#D95A36] text-white shadow-sm"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            Makanan
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory("item")}
            className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
              activeCategory === "item"
                ? "bg-[#22C55E] text-white shadow-sm"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            Barang
          </button>
        </div>
      </div>

      {/* Donut Chart Container */}
      <div className="relative my-2 flex h-[190px] w-full items-center justify-center">
        <Doughnut data={data} options={options} />

        {/* Teks Dinamis di Tengah Donut */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-3xl font-black transition-all"
            style={{ color: activeCategory === "food" ? "#D95A36" : "#22C55E" }}
          >
            {foodCount + itemCount === 0 ? "0%" : (activeCategory === "food" ? `${foodPercentage}%` : `${itemPercentage}%`)}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
            {activeCategory === "food" ? "Porsi Makanan" : "Item Barang"}
          </span>
        </div>
      </div>

      {/* Kotak Informasi Detail Bawah */}
      <div className="mt-4 rounded-xl border border-stone-100 bg-[#FFF7E9] p-3 text-center">
        {activeCategory === "food" ? (
          <p className="text-xs font-medium text-stone-700">
            Total Makanan ({infoPeriode}):{" "}
            <strong className="text-sm font-bold text-[#D95A36]">{foodCount} Porsi</strong>
          </p>
        ) : (
          <p className="text-xs font-medium text-stone-700">
            Total Barang ({infoPeriode}):{" "}
            <strong className="text-sm font-bold text-[#22C55E]">{itemCount} Item</strong>
          </p>
        )}
      </div>
    </div>
  );
}