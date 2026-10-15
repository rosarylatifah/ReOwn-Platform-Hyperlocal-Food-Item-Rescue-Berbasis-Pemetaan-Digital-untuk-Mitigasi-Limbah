"use client";

import React, { useState } from 'react';
import { ShoppingCart, Eye, Send, MapPin, Truck } from 'lucide-react';
import CartDetailModal from '../components/CartDetailModal';

export default function BuyerCart({ onSendRequest }) {
  // Data item yang ada di Keranjang Pembeli
  const [cartItems, setCartItems] = useState([
    {
      id: 201,
      name: 'Kemeja Rajut',
      sellerName: 'Thrift Corner Batam',
      sellerAddress: 'Ruko Mega Cipta Blok A No. 4, Batam Center',
      orderDate: '29/09/26 15:03',
      totalPrice: 'Rp. 35.000',
      deliveryOption: 'Ambil di Tempat',
      description: 'Kemeja rajut warna cream ukuran L, kondisi 95% masih sangat bagus.',
      image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 202,
      name: 'Burger Daging',
      sellerName: 'Foodie Delight',
      sellerAddress: 'Jl. Raya No. 123, Jakarta',
      orderDate: '29/09/26 14:20',
      totalPrice: 'Rp. 20.200',
      deliveryOption: 'Ambil di Tempat',
      description: 'Burger daging porsi lebih promo last chance, kondisi hangat dan dikemas rapi.',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    },
  ]);

  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fungsi mengubah Opsi Pengantaran secara langsung di Keranjang
  const handleOptionChange = (id, option) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, deliveryOption: option } : item
    ));
  };

  // Fungsi Kirim Permintaan (Memindahkan dari Keranjang ke Pesanan)
  const handleSendRequest = (item) => {
    if (window.confirm(`Kirim permintaan rescue untuk ${item.name} dengan opsi "${item.deliveryOption}"?`)) {
      // Hapus item dari keranjang
      setCartItems(prev => prev.filter(i => i.id !== item.id));
      
      // Jika ada callback function ke App.jsx/Orders
      if (onSendRequest) {
        onSendRequest({
          ...item,
          status: 'Menunggu Konfirmasi',
          statusType: 'warning'
        });
      }
      alert(`Permintaan rescue untuk ${item.name} berhasil dikirim! Silakan cek di Halaman Pesanan.`);
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#FAF0EC', 
      minHeight: '100vh', 
      margin: 0, 
      paddingTop: '110px', 
      paddingLeft: '50px',
      paddingRight: '50px',
      paddingBottom: '50px',
      fontFamily: 'Inter, sans-serif'
    }}>
      
      {/* JUDUL UTAMA KERANJANG */}
      <div style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <ShoppingCart size={26} color="#D95A36" />
          <h1 style={{ 
            fontFamily: 'Fraunces, serif', 
            fontSize: '28px', 
            fontWeight: '600', 
            color: '#1A1A1A', 
            margin: 0 
          }}>
            Keranjang
          </h1>
        </div>
        <hr style={{ 
          border: 'none', 
          borderTop: '1.5px solid rgba(0,0,0,0.08)', 
          margin: 0 
        }} />
      </div>

      {/* DAFTAR ITEM KERANJANG */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {cartItems.length > 0 ? (
          cartItems.map((item) => {
            const isCardHovered = hoveredCard === item.id;

            return (
              <div 
                key={item.id}
                onMouseEnter={() => setHoveredCard(item.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  backgroundColor: '#FFF',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: isCardHovered ? '1.5px solid #D95A36' : '1px solid rgba(0,0,0,0.06)',
                  boxShadow: isCardHovered ? '0 10px 25px rgba(217, 90, 54, 0.12)' : '0 4px 14px rgba(0,0,0,0.03)',
                  transform: isCardHovered ? 'translateY(-3px)' : 'translateY(0)',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {/* SISI KIRI: Gambar & Detail Produk */}
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{
                    width: '95px',
                    height: '95px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: '#F9F9F9',
                    flexShrink: 0
                  }}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        transform: isCardHovered ? 'scale(1.08)' : 'scale(1)',
                        transition: 'transform 0.3s ease'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <h3 style={{ 
                      margin: 0, 
                      fontSize: '18px', 
                      fontWeight: '600', 
                      color: isCardHovered ? '#D95A36' : '#1A1A1A',
                      transition: 'color 0.2s ease'
                    }}>
                      {item.name}
                    </h3>
                    
                    <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#D95A36' }}>
                      {item.totalPrice}
                    </span>

                    {/* Tombol Lihat Detail */}
                    <div style={{ marginTop: '6px' }}>
                      <button 
                        onClick={() => setSelectedOrder(item)}
                        onMouseEnter={() => setHoveredBtn(`detail-${item.id}`)}
                        onMouseLeave={() => setHoveredBtn(null)}
                        style={{
                          backgroundColor: hoveredBtn === `detail-${item.id}` ? '#D95A36' : '#F3F4F6',
                          color: hoveredBtn === `detail-${item.id}` ? '#FFF' : '#374151',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Eye size={14} /> LIHAT DETAIL
                      </button>
                    </div>
                  </div>
                </div>

                {/* SISI KANAN: Opsi Pengantaran & Tombol Kirim Permintaan */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                  
                  {/* Label Opsi Pengantaran */}
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '12px', color: '#666', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                      Opsi Pengantaran:
                    </span>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {/* Tombol Opsi Lainnya */}
                      <button
                        onClick={() => handleOptionChange(item.id, 'Opsi Lainnya')}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '8px',
                          border: item.deliveryOption === 'Opsi Lainnya' ? '1.5px solid #D95A36' : '1px solid #CCC',
                          backgroundColor: item.deliveryOption === 'Opsi Lainnya' ? '#FFF3ED' : '#F9F9F9',
                          color: item.deliveryOption === 'Opsi Lainnya' ? '#D95A36' : '#555',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Truck size={13} /> Opsi Lainnya
                      </button>

                      {/* Tombol Ambil di Tempat */}
                      <button
                        onClick={() => handleOptionChange(item.id, 'Ambil di Tempat')}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '8px',
                          border: item.deliveryOption === 'Ambil di Tempat' ? '1.5px solid #D95A36' : '1px solid #CCC',
                          backgroundColor: item.deliveryOption === 'Ambil di Tempat' ? '#FFF3ED' : '#F9F9F9',
                          color: item.deliveryOption === 'Ambil di Tempat' ? '#D95A36' : '#555',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <MapPin size={13} /> Ambil di Tempat
                      </button>
                    </div>
                  </div>

                  {/* Tombol Kirim Permintaan */}
                  <button
                    onClick={() => handleSendRequest(item)}
                    onMouseEnter={() => setHoveredBtn(`send-${item.id}`)}
                    onMouseLeave={() => setHoveredBtn(null)}
                    style={{
                      backgroundColor: '#D95A36',
                      color: '#FFF',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: hoveredBtn === `send-${item.id}` ? '0 6px 16px rgba(217, 90, 54, 0.35)' : '0 2px 6px rgba(0,0,0,0.1)',
                      transform: hoveredBtn === `send-${item.id}` ? 'scale(1.04)' : 'scale(1)',
                      transition: 'all 0.2s ease',
                      marginTop: '4px'
                    }}
                  >
                    <Send size={15} /> Kirim Permintaan
                  </button>

                </div>

              </div>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#FFF', borderRadius: '16px', color: '#888' }}>
            Keranjang kamu masih kosong. Yuk cari produk rescue di Halaman Produk!
          </div>
        )}
      </div>

        <CartDetailModal 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
        onSendRequest={(updatedItem) => {
            alert(`Permintaan rescue untuk ${updatedItem.name} (${updatedItem.deliveryOption}) berhasil dikirim!`);
            // Hapus dari state keranjang
            setCartItems(prev => prev.filter(i => i.id !== updatedItem.id));
        }}
        onDeleteItem={(id) => {
            setCartItems(prev => prev.filter(i => i.id !== id));
        }}
        />

    </div>
  );
}