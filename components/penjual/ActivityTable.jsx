"use client";

import React from 'react';

export default function ActivityTable({ 
  activities, 
  searchTerm, 
  onSearchChange, 
  hoveredRow, 
  setHoveredRow 
}) {
  return (
    <div style={{
      backgroundColor: '#FFF',
      borderRadius: '20px',
      padding: '24px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      border: '1px solid rgba(217, 90, 54, 0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1A1A1A', margin: '0 0 4px 0' }}>
            Riwayat Aktivitas Toko
          </h3>
          <span style={{ fontSize: '12px', color: '#888' }}>Cari catatan aktivitas toko kamu</span>
        </div>

        <input 
          type="text"
          placeholder="Cari aktivitas atau pengguna..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            padding: '8px 14px',
            borderRadius: '12px',
            border: '1px solid #ddd',
            fontSize: '12px',
            outline: 'none',
            width: '240px',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#D95A36'}
          onBlur={(e) => e.target.style.borderColor = '#ddd'}
        />
      </div>

      <div style={{ maxHeight: '220px', overflowY: 'auto', paddingRight: '6px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ 
              borderBottom: '2px solid #F0E6DE', 
              color: '#888', 
              fontSize: '11px', 
              textTransform: 'uppercase', 
              position: 'sticky', 
              top: 0, 
              backgroundColor: '#FFF', 
              zIndex: 10 
            }}>
              <th style={{ padding: '12px' }}>Waktu</th>
              <th style={{ padding: '12px' }}>Aktivitas</th>
              <th style={{ padding: '12px' }}>Pengguna</th>
              <th style={{ padding: '12px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
                {activities?.length > 0 ? (
                 activities.map((item) => (
                <tr
                  key={item.id}
                  onMouseEnter={() => setHoveredRow(item.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    backgroundColor: hoveredRow === item.id ? '#FFF3ED' : 'transparent',
                    borderBottom: '1px solid #F7F1EB',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                >
                  <td style={{ padding: '14px 12px', color: '#666', whiteSpace: 'nowrap' }}>{item.time}</td>
                  <td style={{ padding: '14px 12px', fontWeight: '600', color: hoveredRow === item.id ? '#D95A36' : '#1A1A1A' }}>{item.activity}</td>
                  <td style={{ padding: '14px 12px', color: '#444' }}>{item.user}</td>
                  <td style={{ padding: '14px 12px' }}>
                    <span style={{
                      backgroundColor: item.status === 'Berhasil' || item.status === 'Selesai' ? '#E8F5E9' : '#FFF8E1',
                      color: item.status === 'Berhasil' || item.status === 'Selesai' ? '#2E7D32' : '#F57F17',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
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