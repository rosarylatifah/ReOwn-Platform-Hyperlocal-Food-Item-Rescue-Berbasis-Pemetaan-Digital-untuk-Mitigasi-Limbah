"use client";

import React from 'react';
import { MapPin, Edit2, Trash2, Clock, Package } from 'lucide-react';

export default function ProductCard({ item, isHovered, onHover, onLeave, onEdit, onDelete }) {
  const isFood = String(item.category || '').toLowerCase() === 'makanan';

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="group relative flex flex-col overflow-hidden rounded-[22px] bg-white shadow-[4px_6px_8px_-2px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[8px_10px_8px_-2px_rgba(0,0,0,0.3)]"
    >
      <div className="relative h-[180px] w-full overflow-hidden bg-[#FFF7E9]">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span
          className={`absolute left-3 top-3 rounded-full border-2 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wide capitalize shadow-sm ${
            isFood ? 'border-[#F23A10] text-[#E0452A]' : 'border-[#16A34A] text-[#15803D]'
          }`}
        >
          {item.category}
        </span>
      </div>

      <div className="flex grow flex-col justify-between p-5">
        <div>
          <div className="mb-2 flex items-start justify-between">
            <h4 className="m-0 max-w-[75%] truncate text-base font-bold leading-snug text-stone-900 transition-colors group-hover:text-[#F23A10]">
              {item.name}
            </h4>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onEdit(item)}
                title="Edit Produk"
                aria-label="Edit Produk"
                className="flex rounded-lg border-2 border-stone-200 bg-white p-1.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#95F57C] hover:bg-[#95F57C]"
              >
                <Edit2 size={14} color="#444" />
              </button>
              <button
                onClick={() => onDelete(item.id, item.name)}
                title="Hapus Produk"
                aria-label="Hapus Produk"
                className="flex rounded-lg border-2 border-stone-200 bg-white p-1.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#F23A10] hover:bg-[#F23A10]/10"
              >
                <Trash2 size={14} color="#D93025" />
              </button>
            </div>
          </div>

          <p className="mb-3.5 mt-0 flex items-center gap-1 text-xs text-stone-600">
            <MapPin size={13} color="#F23A10" /> {item.location}
          </p>

          <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#444', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Package size={13} color="#D95A36" /> Tersedia: {item.stock || '1'} {item.category === 'Makanan' ? 'Porsi' : 'Pcs'}
          </p>

          {item.deadline && (
            <p style={{ margin: '0 0 12px 0', fontSize: '11px', color: '#888', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={13} color="#D95A36" /> Deadline: {item.deadline.replace('T', ' ')}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-stone-100 pt-3">
          <div>
            <span className="block text-[10px] uppercase tracking-wide text-stone-500">Harga</span>
            <span className="text-[15px] font-bold text-[#F23A10]">{item.price}</span>
          </div>
          <div className="text-right">
            <span className="block text-[10px] uppercase tracking-wide text-stone-500">Status</span>
            <span className="rounded-full bg-[#16A34A]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#15803D]">
              {item.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}