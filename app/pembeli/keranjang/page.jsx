"use client";

import React from 'react';
import { ShoppingCart, Eye, Send, MapPin, Truck, Trash2 } from 'lucide-react';
import { useBuyerCart } from '@/app/pembeli/hooks/useBuyerCart';
import CartDetail from '@/components/pembeli/CartDetail';

export default function BuyerCart({ onSendRequest }) {
  const {
    cart,
    hoveredCard,
    setHoveredCard,
    hoveredBtn,
    setHoveredBtn,
    selectedOrder,
    setSelectedOrder,
    updateDeliveryOption,
    removeFromCart,
    calculateItemTotal,
    handleDecreaseQuantity,
    handleIncreaseQuantity,
    handleSendRequest
  } = useBuyerCart(onSendRequest);

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
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', fontWeight: '600', color: '#1A1A1A', margin: 0 }}>
            Keranjang Saya
          </h1>
        </div>
        <hr style={{ border: 'none', borderTop: '1.5px solid rgba(0,0,0,0.08)', margin: 0 }} />
      </div>

      {/* DAFTAR ITEM KERANJANG */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {cart.length > 0 ? (
          cart.map((item) => {
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
                  justify: 'space-between',
                  alignItems: 'center',
                  border: isCardHovered ? '1.5px solid #D95A36' : '1px solid rgba(0,0,0,0.06)',
                  boxShadow: isCardHovered ? '0 10px 25px rgba(217, 90, 54, 0.12)' : '0 4px 14px rgba(0,0,0,0.03)',
                  transform: isCardHovered ? 'translateY(-3px)' : 'translateY(0)',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {/* SISI KIRI: Gambar, Detail Produk & Kuantitas */}
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
                    
                    {/* TOTAL HARGA BERDASARKAN KUANTITAS */}
                    <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#D95A36' }}>
                      {calculateItemTotal(item)} <span style={{ fontSize: '11px', color: '#666', fontWeight: 'normal' }}>(Satuan: {item.price || item.totalPrice})</span>
                    </span>

                    {/* KONTROL KUANTITAS (+ / -) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                      <span style={{ fontSize: '12px', color: '#666', fontWeight: '600' }}>Jumlah Rescue:</span>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #DDD', borderRadius: '8px', overflow: 'hidden' }}>
                        <button
                          onClick={() => handleDecreaseQuantity(item)}
                          style={{
                            padding: '4px 10px', backgroundColor: '#F9F9F9', border: 'none', cursor: 'pointer', fontWeight: 'bold', color: '#555'
                          }}
                        >
                          -
                        </button>
                        <span style={{ padding: '4px 12px', fontSize: '13px', fontWeight: 'bold', backgroundColor: '#FFF', color: '#1A1A1A' }}>
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={() => handleIncreaseQuantity(item)}
                          style={{
                            padding: '4px 10px', backgroundColor: '#F9F9F9', border: 'none', cursor: 'pointer', fontWeight: 'bold', color: '#D95A36'
                          }}
                        >
                          +
                        </button>
                      </div>

                      {/* Tombol Hapus Item */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        title="Hapus item"
                        style={{
                          background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div style={{ marginTop: '4px' }}>
                      <button 
                        onClick={() => setSelectedOrder(item)}
                        onMouseEnter={() => setHoveredBtn(`detail-${item.id}`)}
                        onMouseLeave={() => setHoveredBtn(null)}
                        style={{
                          backgroundColor: hoveredBtn === `detail-${item.id}` ? '#D95A36' : '#F3F4F6',
                          color: hoveredBtn === `detail-${item.id}` ? '#FFF' : '#374151',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Eye size={13} /> LIHAT DETAIL
                      </button>
                    </div>
                  </div>
                </div>

                {/* SISI KANAN: Opsi Pengantaran & Tombol Kirim Permintaan */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '12px', color: '#666', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                      Opsi Pengantaran:
                    </span>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => updateDeliveryOption(item.id, 'Opsi Lainnya')}
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

                      <button
                        onClick={() => updateDeliveryOption(item.id, 'Ambil di Tempat')}
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

      {/* MODAL DETAIL KERANJANG */}
      <CartDetail 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
        onSendRequest={(updatedItem) => {
          handleSendRequest(updatedItem);
          setSelectedOrder(null);
        }}
        onDeleteItem={(id) => {
          removeFromCart(id);
          setSelectedOrder(null);
        }}
      />
    </div>
  );
}