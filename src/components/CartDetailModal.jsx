import React, { useState } from 'react';
import { X, Send, Trash2, MapPin, Truck, MessageCircle } from 'lucide-react';

export default function CartDetailModal({ order, onClose, onSendRequest, onDeleteItem }) {
  if (!order) return null;

  // State lokal Opsi Pengantaran
  const [selectedDelivery, setSelectedDelivery] = useState(order.deliveryOption || 'Ambil di Tempat');

  return (
    <div 
      onClick={onClose}
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
      <div 
        onClick={(e) => e.stopPropagation()}
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

        <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', color: '#1A1A1A', marginTop: 0, marginBottom: '20px' }}>
          Detail Item Keranjang
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
          
          {/* SISI KIRI: Info Penjual, Opsi Pengantaran, & Tombol Hapus */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Nama Penjual */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#333', display: 'block', marginBottom: '6px' }}>
                Nama Penjual:
              </label>
              <div style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CCC', backgroundColor: '#FFF', fontSize: '13px', color: '#1A1A1A', fontWeight: '500' }}>
                {order.sellerName || 'Toko Craft & Thrift Batam'}
              </div>
            </div>

            {/* Alamat Penjual */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#333', display: 'block', marginBottom: '6px' }}>
                Alamat Penjual:
              </label>
              <div style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CCC', backgroundColor: '#FFF', fontSize: '13px', color: '#555', lineHeight: '1.4' }}>
                {order.sellerAddress || 'Jl. Ahmad Yani, Batam Center, Batam'}
              </div>
            </div>

            {/* Total Pembayaran */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#333', display: 'block', marginBottom: '6px' }}>
                Total Pembayaran:
              </label>
              <div style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CCC', backgroundColor: '#FFF', fontSize: '13px', fontWeight: 'bold', color: '#D95A36' }}>
                {order.totalPrice}
              </div>
            </div>

            {/* Pilihan Opsi Pengantaran */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#333', display: 'block', marginBottom: '6px' }}>
                Opsi Pengantaran:
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedDelivery('Ambil di Tempat')}
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: selectedDelivery === 'Ambil di Tempat' ? '1.5px solid #D95A36' : '1px solid #CCC',
                    backgroundColor: selectedDelivery === 'Ambil di Tempat' ? '#FFF3ED' : '#FFF',
                    color: selectedDelivery === 'Ambil di Tempat' ? '#D95A36' : '#555',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <MapPin size={13} /> Ambil di Tempat
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDelivery('Opsi Lainnya')}
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: selectedDelivery === 'Opsi Lainnya' ? '1.5px solid #D95A36' : '1px solid #CCC',
                    backgroundColor: selectedDelivery === 'Opsi Lainnya' ? '#FFF3ED' : '#FFF',
                    color: selectedDelivery === 'Opsi Lainnya' ? '#D95A36' : '#555',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Truck size={13} /> Opsi Lainnya
                </button>
              </div>
            </div>

            {/* Tombol Hapus dari Keranjang (Dipindah ke Kiri bawah) */}
            <button 
              onClick={() => {
                if (window.confirm(`Hapus ${order.name} dari keranjang?`)) {
                  if (onDeleteItem) onDeleteItem(order.id);
                  onClose();
                }
              }}
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #FCA5A5',
                backgroundColor: '#FEF2F2',
                color: '#DC2626',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                marginTop: '10px'
              }}
            >
              <Trash2 size={15} /> Hapus dari Keranjang
            </button>

          </div>

          {/* SISI KANAN: Gambar, Deskripsi, Tombol Hubungi Penjual, & Kirim Permintaan */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Gambar Produk */}
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

            {/* Deskripsi */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#333', display: 'block', marginBottom: '4px' }}>
                Deskripsi Produk:
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

            {/* Tombol Hubungi Penjual */}
            <button 
              onClick={() => alert(`Menghubungi penjual ${order.sellerName || 'Toko'} untuk produk ${order.name}`)}
              style={{
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

            {/* Tombol Kirim Permintaan */}
            <button 
              onClick={() => {
                if (onSendRequest) onSendRequest({ ...order, deliveryOption: selectedDelivery });
                onClose();
              }}
              style={{
                padding: '11px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#D95A36',
                color: '#FFF',
                fontSize: '13px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(217, 90, 54, 0.25)',
                transition: 'all 0.2s ease',
                marginTop: '2px'
              }}
            >
              <Send size={16} /> Kirim Permintaan
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}