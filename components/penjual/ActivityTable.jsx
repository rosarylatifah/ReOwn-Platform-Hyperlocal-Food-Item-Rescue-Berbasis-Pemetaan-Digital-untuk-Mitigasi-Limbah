"use client";

import React from 'react';
import { fraunces, gochiHand } from '@/lib/fonts';

export default function ActivityTable({
  activities,
  searchTerm,
  onSearchChange,
  hoveredRow,
  setHoveredRow
}) {
  return (
    <div className="rounded-[22px] bg-white p-6 shadow-[6px_8px_8px_-2px_rgba(0,0,0,0.25)]">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2.5">
        <div>
          <h3 className={`${fraunces.className} m-0 mb-1 text-lg font-extrabold uppercase tracking-tight text-stone-900`}>
            Riwayat Aktivitas Toko
          </h3>
          <span className={`${gochiHand.className} text-sm text-stone-600`}>
            Cari catatan aktivitas toko kamu
          </span>
        </div>

        <input
          type="text"
          placeholder="Cari aktivitas atau pengguna..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-[240px] max-w-full rounded-xl border-2 border-stone-200 bg-white px-3.5 py-2 text-xs outline-none transition-colors placeholder:text-stone-400 focus:border-[#F23A10] focus-visible:ring-4 focus-visible:ring-[#16A34A]/30"
        />
      </div>

      <div className="max-h-[220px] overflow-y-auto pr-1.5">
        <table className="w-full border-collapse text-left text-[13px]">
          <thead>
            <tr className="sticky top-0 z-10 border-b-2 border-[#F23A10]/20 bg-white text-[11px] uppercase tracking-wide text-stone-500">
              <th className="p-3">Waktu</th>
              <th className="p-3">Aktivitas</th>
              <th className="p-3">Pengguna</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {activities?.length > 0 ? (
              activities.map((item) => {
                const done = item.status === 'Berhasil' || item.status === 'Selesai';
                return (
                  <tr
                    key={item.id}
                    onMouseEnter={() => setHoveredRow(item.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className={`cursor-pointer border-b border-stone-100 transition-colors duration-200 ${
                      hoveredRow === item.id ? 'bg-[#FFF7E9]' : 'bg-transparent'
                    }`}
                  >
                    <td className="whitespace-nowrap px-3 py-3.5 text-stone-600">{item.time}</td>
                    <td className={`px-3 py-3.5 font-semibold ${hoveredRow === item.id ? 'text-[#F23A10]' : 'text-stone-900'}`}>
                      {item.activity}
                    </td>
                    <td className="px-3 py-3.5 text-stone-700">{item.user}</td>
                    <td className="px-3 py-3.5">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          done ? 'bg-[#16A34A]/10 text-[#15803D]' : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="p-5 text-center text-stone-500">
                  Tidak ada riwayat aktivitas yang cocok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}