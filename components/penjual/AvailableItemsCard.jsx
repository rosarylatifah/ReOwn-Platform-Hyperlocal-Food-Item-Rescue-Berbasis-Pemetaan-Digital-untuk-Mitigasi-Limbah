"use client";

import React, { useState } from 'react';
import { Box, ChevronRight } from 'lucide-react';

export default function AvailableItemsCard({ isSelected, onClick, value = "24", change = "Aktif di etalase" }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: isSelected ? '#FFF3ED' : '#FFF',
        borderRadius: '16px',
        padding: '18px',
        boxShadow: isSelected || isHovered ? '0 8px 20px rgba(217, 90, 54, 0.2)' : '0 2px 10px rgba(0,0,0,0.04)',
        cursor: 'pointer',
        border: isSelected ? '2px solid #D95A36' : '1px solid rgba(0,0,0,0.05)',
        transform: isHovered || isSelected ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '11px', fontWeight: '600', color: '#666', lineHeight: '1.3' }}>
          Barang Tersedia
        </span>
        <div style={{ backgroundColor: '#F59E0B15', padding: '6px', borderRadius: '10px', color: '#F59E0B' }}>
          <Box size={16} />
        </div>
      </div>

      <div>
        <h4 style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', fontWeight: 'bold', color: '#1A1A1A', margin: '8px 0 2px 0' }}>
          {value}
        </h4>
        <span style={{ fontSize: '10px', color: '#888', display: 'flex', alignItems: 'center', gap: '2px' }}>
          {change} <ChevronRight size={12} color="#D95A36" />
        </span>
      </div>
    </div>
  );
}