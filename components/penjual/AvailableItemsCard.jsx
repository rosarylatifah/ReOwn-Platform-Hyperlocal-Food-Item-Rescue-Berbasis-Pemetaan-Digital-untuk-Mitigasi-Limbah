"use client";

import React from 'react';
import { Box, ChevronRight } from 'lucide-react';
import { fraunces } from '@/lib/fonts';

export default function AvailableItemsCard({ isSelected, onClick, value = "24", change = "Aktif di etalase" }) {
  return (
    <div
      onClick={onClick}
      className={`flex cursor-pointer flex-col justify-between rounded-[22px] p-[18px] transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_8px_8px_-2px_rgba(0,0,0,0.3)] ${
        isSelected
          ? '-translate-y-1 border-2 border-[#16A34A] bg-[#F0FDF4] shadow-[6px_8px_8px_-2px_rgba(0,0,0,0.3)]'
          : 'border-2 border-transparent bg-white shadow-[4px_6px_8px_-2px_rgba(0,0,0,0.2)]'
      }`}
    >
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-semibold uppercase leading-tight tracking-wide text-stone-600">
          Barang Tersedia
        </span>
        <div className="rounded-xl bg-[#16A34A]/10 p-1.5 text-[#16A34A]">
          <Box size={16} />
        </div>
      </div>

      <div>
        <h4 className={`${fraunces.className} mb-0.5 mt-2 text-[28px] font-extrabold text-stone-900`}>
          {value}
        </h4>
        <span className="flex items-center gap-0.5 text-[11px] text-stone-500">
          {change} <ChevronRight size={12} color="#16A34A" />
        </span>
      </div>
    </div>
  );
}