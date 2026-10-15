import React from 'react';
import { X, MessageCircle, Ban } from 'lucide-react';

export default function OrderDetailModal({ order, onClose, onCancelOrder }) {
  // Kalau gak ada order yang dipilih, jangan tampilkan apa-apa
  if (!order) return null;

  // Cek apakah pesanan masih bisa dibatalkan (status Menunggu Konfirmasi)
  const isCancelable = order.status === 'Menunggu Konfirmasi';

  return (
    <div 
      onClick={onClose} // Klik di luar box buat menutup modal
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
    >
      {/* Box Konten Modal Pop-Up */}
      <div 
        onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup kalau diklik di dalamnya
        style={{
          backgroundColor: '#FFF',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '680px',
          padding: '28px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          position: 'relative',
        }}
      >
        {/* Tombol Close '✕' */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            border: 'none',
            backgroundColor: '#F3F4F6',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#666'
          }}
        >
          <X size={18} />
        </button>

        {/* Layout Grid Kiri (Form Info) & Kanan (Gambar, Deskripsi, Opsi Pengantaran & Tombol Aksi) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
          
          {/* SISI KIRI: Detail Info Pemesanan Utama */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#333', display: 'block', marginBottom: '6px' }}>
                Nama Pembeli:
              </label>
              <div style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CCC', backgroundColor: '#FFF', fontSize: '13px', color: '#1A1A1A' }}>
                {order.buyerName}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#333', display: 'block', marginBottom: '6px' }}>
                Nama Penjual:
              </label>
              <div style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CCC', backgroundColor: '#FFF', fontSize: '13px', color: '#1A1A1A' }}>
                {order.sellerName}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#333', display: 'block', marginBottom: '6px' }}>
                Alamat Penjual:
              </label>
              <div style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CCC', backgroundColor: '#FFF', fontSize: '13px', color: '#1A1A1A' }}>
                {order.sellerAddress}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#333', display: 'block', marginBottom: '6px' }}>
                Tanggal Pemesanan:
              </label>
              <div style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CCC', backgroundColor: '#FFF', fontSize: '13px', color: '#1A1A1A' }}>
                {order.orderDate}
              </div>
            </div>

            {/* Tanggal Konfirmasi (Otomatis Muncul Jika Status Dalam Proses) */}
            {order.confirmDate && (
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#D95A36', display: 'block', marginBottom: '6px' }}>
                  Tanggal Konfirmasi:
                </label>
                <div style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #FFDBCC', backgroundColor: '#FFF3ED', fontSize: '13px', color: '#D95A36', fontWeight: '600' }}>
                  {order.confirmDate}
                </div>
              </div>
            )}

            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#333', display: 'block', marginBottom: '6px' }}>
                Total Pembayaran:
              </label>
              <div style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CCC', backgroundColor: '#FFF', fontSize: '13px', fontWeight: 'bold', color: '#1A1A1A' }}>
                {order.totalPrice}
              </div>
            </div>
          </div>

          {/* SISI KANAN: Gambar Produk, Deskripsi, Opsi Pengantaran, & Tombol Aksi Ke Bawah */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{
              width: '100%',
              height: '140px',
              borderRadius: '12px',
              border: '1px solid #CCC',
              overflow: 'hidden',
              backgroundColor: '#F9F9F9'
            }}>
              <img 
                src={order.image} 
                alt={order.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#333', display: 'block', marginBottom: '4px' }}>
                Deskripsi:
              </label>
              <div style={{
                width: '100%',
                minHeight: '70px',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #CCC',
                backgroundColor: '#FFF',
                fontSize: '12px',
                color: '#555',
                lineHeight: '1.4'
              }}>
                {order.description}
              </div>
            </div>

            {/* Opsi Pengantaran (Dipindah ke Kanan) */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#333', display: 'block', marginBottom: '6px' }}>
                Opsi Pengantaran:
              </label>
              <div style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CCC', backgroundColor: '#FFF', fontSize: '13px', color: '#1A1A1A' }}>
                {order.deliveryOption}
              </div>
            </div>

            {/* AREA TOMBOL AKSI (TERSUSUN KE BAWAH DI KANAN) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
              
              {/* Tombol Hubungi Penjual */}
              <button 
                onClick={() => alert(`Menghubungi penjual untuk ${order.name}`)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #CCC',
                  backgroundColor: '#FFF',
                  color: '#333',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                  transition: 'all 0.2s ease'
                }}
              >
                <MessageCircle size={16} /> Hubungi Penjual
              </button>

              {/* TOMBOL BATALKAN PESANAN (CUMA MUNCUL KALO STATUS: MENUNGGU KONFIRMASI) */}
              {isCancelable && (
                <button 
                  onClick={() => {
                    if (window.confirm(`Yakin ingin membatalkan pesanan ${order.name}?`)) {
                      if (onCancelOrder) onCancelOrder(order.id);
                      onClose();
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #FCA5A5',
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FEE2E2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FEF2F2';
                  }}
                >
                  <Ban size={16} color="#DC2626" /> Batalkan Pesanan
                </button>
              )}

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}