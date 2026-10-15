import React, { useState, useEffect } from 'react';
import { TrendingUp, Package, ShieldCheck, RefreshCw, Clock, ArrowUpRight, ChevronRight, X, DollarSign } from 'lucide-react';

export default function SellerDashboard() {
  const [activeCard, setActiveCard] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State Modal Detail (Untuk Pendapatan & 4 Metrik)
  const [activeModal, setActiveModal] = useState(null);

  // State untuk efek interaktif scroll/zoom pada chart
  const [chartScale, setChartScale] = useState(1);

  // State & useEffect untuk Jam Real-time
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const formattedTime = currentTime.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // Data 4 Kotak Metrik Statistik
  const metricCards = [
    { id: 'makanan-tersedia', title: 'Total Makanan Tersedia', value: '30', change: '+4 minggu ini', icon: Package, color: '#D95A36' },
    { id: 'makanan-terselamatkan', title: 'Total Makanan Terselamatkan', value: '30', change: '85% target tercapai', icon: ShieldCheck, color: '#2E7D32' },
    { id: 'barang-tersedia', title: 'Total Barang Tersedia', value: '30', change: 'Aktif di etalase', icon: RefreshCw, color: '#0288D1' },
    { id: 'barang-terselamatkan', title: 'Total Barang Terselamatkan', value: '30', change: 'Sukses terjual', icon: TrendingUp, color: '#7B1FA2' },
  ];

  // Data Riwayat Aktivitas
  const activities = [
    { id: 1, time: '14 Okt 2026, 16:30', activity: 'Menambahkan produk baru "Knitwear Cardigan Vintage"', user: 'Siti Rahma', status: 'Berhasil' },
    { id: 2, time: '14 Okt 2026, 14:15', activity: 'Konfirmasi pesanan #INV-8821 masuk', user: 'Budi Santoso', status: 'Diproses' },
    { id: 3, time: '13 Okt 2026, 09:10', activity: 'Memperbarui stok makanan sisa roti panggang', user: 'Admin Seller', status: 'Selesai' },
    { id: 4, time: '12 Okt 2026, 11:45', activity: 'Menyelesaikan transaksi penyelamatan item jaket', user: 'Ahmad Fauzi', status: 'Selesai' },
    { id: 5, time: '11 Okt 2026, 10:20', activity: 'Mengubah harga produk "Burger Daging"', user: 'Siti Rahma', status: 'Selesai' },
  ];

  // Filter pencarian aktivitas
  const filteredActivities = activities.filter(item => 
    item.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handler Scroll Interaktif pada Chart SVG
  const handleChartScroll = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setChartScale((prev) => Math.min(prev + 0.1, 1.3)); // Zoom in max 1.3
    } else {
      setChartScale((prev) => Math.max(prev - 0.1, 0.9)); // Zoom out min 0.9
    }
  };

  return (
    <div style={{ 
      paddingTop: '100px', 
      paddingBottom: '40px',
      paddingLeft: '30px',
      paddingRight: '30px',
      backgroundColor: '#FAF6F0',
      minHeight: '100vh',
      boxSizing: 'border-box',
      fontFamily: 'Inter, sans-serif'
    }}>
      
      {/* HEADER SELAMAT DATANG & WIDGET JAM REAL-TIME */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', color: '#1A1A1A', margin: '0 0 4px 0' }}>
            Halo, Seller 👋
          </h1>
          <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
            Berikut ringkasan performa toko dan aktivitas ReOwn kamu hari ini.
          </p>
        </div>

        {/* WIDGET JAM REAL-TIME */}
        <div style={{
          backgroundColor: '#FFF',
          padding: '8px 16px',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          border: '1px solid rgba(217, 90, 54, 0.15)'
        }}>
          <Clock size={18} color="#D95A36" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#1A1A1A', fontFamily: 'Fraunces, serif' }}>
              {formattedTime} WIB
            </span>
            <span style={{ fontSize: '10px', color: '#777' }}>
              {formattedDate}
            </span>
          </div>
        </div>
      </div>

      {/* BAGIAN ATAS: CHART PENDAPATAN & 4 KOTAK METRIK */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '30px' }}>
        
        {/* KIRI: CHART PENDAPATAN PERBULAN (INTERAKTIF SCROLL & DETAIL) */}
        <div style={{
          backgroundColor: '#FFF',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          border: '1px solid rgba(217, 90, 54, 0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1A1A1A', margin: '0 0 4px 0' }}>
                Pendapatan Perbulan
              </h3>
              <span style={{ fontSize: '12px', color: '#888' }}>Scroll mouse di area chart untuk zoom interaktif</span>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#D95A36', fontFamily: 'Fraunces, serif', display: 'block' }}>
                Rp. 1.000.000
              </span>
              <button 
                onClick={() => setActiveModal('pendapatan')}
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
                  gap: '4px',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5DCD3'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FAF0EC'}
              >
                Halaman Pendapatan <ArrowUpRight size={13} />
              </button>
            </div>
          </div>

          {/* SVG Line Chart dengan Efek Scroll Interaktif */}
          <div 
            onWheel={handleChartScroll}
            style={{ 
              width: '100%', 
              height: '180px', 
              position: 'relative',
              overflow: 'hidden',
              cursor: 'zoom-in',
              borderRadius: '12px',
              backgroundColor: '#FAFAFA',
              padding: '10px'
            }}
          >
            <svg 
              viewBox="0 0 500 160" 
              style={{ 
                width: '100%', 
                height: '100%', 
                transform: `scale(${chartScale})`, 
                transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                transformOrigin: 'center center'
              }}
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D95A36" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#D95A36" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path 
                d="M 0 120 Q 125 100 250 80 T 500 30 L 500 160 L 0 160 Z" 
                fill="url(#chartGradient)" 
              />
              <path 
                d="M 0 120 Q 125 100 250 80 T 500 30" 
                fill="none" 
                stroke="#D95A36" 
                strokeWidth="4" 
                strokeLinecap="round"
              />
              <circle cx="250" cy="80" r="6" fill="#FFF" stroke="#D95A36" strokeWidth="3" />
              <circle cx="500" cy="30" r="6" fill="#FFF" stroke="#D95A36" strokeWidth="3" />
            </svg>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#888', marginTop: '10px', fontWeight: '600' }}>
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>Mei</span><span>Jun</span>
          </div>
        </div>

        {/* KANAN: 4 KOTAK STATISTIK ANGKA DITAMBAH GEDE & BISA DIKLIK */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          {metricCards.map((card) => {
            const Icon = card.icon;
            const isSelected = activeCard === card.id;

            return (
              <div
                key={card.id}
                onClick={() => {
                  setActiveCard(card.id);
                  setActiveModal(card.id);
                }}
                style={{
                  backgroundColor: isSelected ? '#FFF3ED' : '#FFF',
                  borderRadius: '16px',
                  padding: '18px',
                  boxShadow: isSelected ? '0 8px 20px rgba(217, 90, 54, 0.25)' : '0 2px 10px rgba(0,0,0,0.04)',
                  cursor: 'pointer',
                  border: isSelected ? '2px solid #D95A36' : '1px solid rgba(0,0,0,0.05)',
                  transform: isSelected ? 'translateY(-4px)' : 'translateY(0)',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 8px 18px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.04)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: '#666', lineHeight: '1.3' }}>
                    {card.title}
                  </span>
                  <div style={{ backgroundColor: `${card.color}15`, padding: '6px', borderRadius: '10px', color: card.color }}>
                    <Icon size={16} />
                  </div>
                </div>

                <div>
                  {/* UKURAN ANGKA DIGEDEIN (28px) */}
                  <h4 style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', fontWeight: 'bold', color: '#1A1A1A', margin: '8px 0 2px 0' }}>
                    {card.value}
                  </h4>
                  <span style={{ fontSize: '10px', color: '#888', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    {card.change} <ChevronRight size={12} color="#D95A36" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* BAGIAN BAWAH: RIWAYAT AKTIVITAS (INTERAKTIF SCROLL CONTAINER) */}
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
            <span style={{ fontSize: '12px', color: '#888' }}>Hover & scroll area tabel untuk melihat catatan lengkap</span>
          </div>

          <input 
            type="text"
            placeholder="Cari aktivitas atau pengguna..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

        {/* Tabel Data dengan Interaktif Scroll Smooth */}
        <div style={{ 
          maxHeight: '220px', 
          overflowY: 'auto', 
          paddingRight: '6px',
          scrollBehavior: 'smooth'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #F0E6DE', color: '#888', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', position: 'sticky', top: 0, backgroundColor: '#FFF', zIndex: 10 }}>
                <th style={{ padding: '12px' }}>Waktu</th>
                <th style={{ padding: '12px' }}>Aktivitas</th>
                <th style={{ padding: '12px' }}>Pengguna</th>
                <th style={{ padding: '12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.length > 0 ? (
                filteredActivities.map((item) => {
                  const isHovered = hoveredRow === item.id;

                  return (
                    <tr
                      key={item.id}
                      onMouseEnter={() => setHoveredRow(item.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      style={{
                        backgroundColor: isHovered ? '#FFF3ED' : 'transparent',
                        borderBottom: '1px solid #F7F1EB',
                        transform: isHovered ? 'scale(1.002)' : 'scale(1)',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                      }}
                    >
                      <td style={{ padding: '14px 12px', color: '#666', whiteSpace: 'nowrap' }}>{item.time}</td>
                      <td style={{ padding: '14px 12px', fontWeight: '600', color: isHovered ? '#D95A36' : '#1A1A1A' }}>{item.activity}</td>
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
                  );
                })
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

      {/* MODAL POPUP SAAT METRIK / PENDAPATAN DIKLIK */}
      {activeModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: '#FFF',
            borderRadius: '20px',
            padding: '24px 30px',
            maxWidth: '450px',
            width: '90%',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '20px', color: '#1A1A1A' }}>
                {activeModal === 'pendapatan' ? 'Detail Pendapatan Perbulan' : 'Detail Statistik'}
              </h3>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#777" />
              </button>
            </div>
            <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.5' }}>
              {activeModal === 'pendapatan' 
                ? 'Total pendapatan bersih bulan ini mencakup penjualan makanan sisa layak konsumsi dan barang preloved yang diselamatkan melalui ReOwn.'
                : `Menampilkan rincian statistik data untuk kategori: "${activeModal}".`}
            </p>
            <button 
              onClick={() => setActiveModal(null)}
              style={{
                width: '100%',
                backgroundColor: '#1A1A1A',
                color: '#FFF',
                border: 'none',
                padding: '10px',
                borderRadius: '10px',
                fontWeight: 'bold',
                marginTop: '16px',
                cursor: 'pointer'
              }}
            >
              Tutup
            </button>
          </div>
        </div>
      )}

    </div>
  );
}