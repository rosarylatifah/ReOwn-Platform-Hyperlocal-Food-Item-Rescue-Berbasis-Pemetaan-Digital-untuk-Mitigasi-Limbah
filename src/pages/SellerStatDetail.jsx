import React from 'react';
import { ArrowLeft, Package, ShieldCheck, RefreshCw, TrendingUp } from 'lucide-react';

export default function SellerStatDetail({ statType, onBack }) {
  // Konfigurasi Judul & Icon Berdasarkan Jenis Statistik
  const config = {
    'makanan-tersedia': { title: 'Detail Makanan Tersedia', icon: Package, color: '#D95A36' },
    'makanan-terselamatkan': { title: 'Detail Makanan Terselamatkan', icon: ShieldCheck, color: '#2E7D32' },
    'barang-tersedia': { title: 'Detail Barang Tersedia', icon: RefreshCw, color: '#0288D1' },
    'barang-terselamatkan': { title: 'Detail Barang Terselamatkan', icon: TrendingUp, color: '#7B1FA2' },
  };

  const currentConfig = config[statType] || { title: 'Detail Statistik', icon: Package, color: '#D95A36' };
  const IconComponent = currentConfig.icon;

  // Data Dummy Contoh untuk Halaman Detail
  const dummyItems = [
    { id: 1, name: 'Burger Daging Special', category: 'Makanan', date: '14 Okt 2026', status: 'Aktif', qty: 5 },
    { id: 2, name: 'Kemeja Rajut Vintage', category: 'Barang', date: '13 Okt 2026', status: 'Terselamatkan', qty: 1 },
    { id: 3, name: 'Roti Panggang Keju', category: 'Makanan', date: '12 Okt 2026', status: 'Aktif', qty: 3 },
  ];

  return (
    <div style={{ 
      paddingTop: '100px', 
      paddingBottom: '50px',
      paddingLeft: '40px',
      paddingRight: '40px',
      backgroundColor: '#FAF6F0',
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif'
    }}>
      
      {/* Tombol Kembali & Header */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={onBack}
          style={{
            backgroundColor: '#FFF',
            border: '1px solid #DDD',
            padding: '8px 16px',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 'bold',
            fontSize: '13px',
            marginBottom: '15px'
          }}
        >
          <ArrowLeft size={16} /> Kembali ke Dashboard
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: `${currentConfig.color}20`, padding: '10px', borderRadius: '12px', color: currentConfig.color }}>
            <IconComponent size={24} />
          </div>
          <div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '26px', margin: 0, color: '#1A1A1A' }}>
              {currentConfig.title}
            </h1>
            <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
              Daftar rinci item yang terdaftar dalam kategori statistik ini.
            </p>
          </div>
        </div>
      </div>

      {/* TABEL RINCIAN ITEM */}
      <div style={{ backgroundColor: '#FFF', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #F0E6DE', color: '#888', fontSize: '11px', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px' }}>Nama Produk</th>
              <th style={{ padding: '12px' }}>Kategori</th>
              <th style={{ padding: '12px' }}>Tanggal</th>
              <th style={{ padding: '12px' }}>Jumlah</th>
              <th style={{ padding: '12px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {dummyItems.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #F7F1EB' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{item.name}</td>
                <td style={{ padding: '12px' }}>{item.category}</td>
                <td style={{ padding: '12px', color: '#666' }}>{item.date}</td>
                <td style={{ padding: '12px' }}>{item.qty} Pcs</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ 
                    backgroundColor: '#E8F5E9', color: '#2E7D32', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' 
                  }}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}