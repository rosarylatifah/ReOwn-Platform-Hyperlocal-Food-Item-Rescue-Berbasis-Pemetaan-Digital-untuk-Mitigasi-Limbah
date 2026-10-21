"use client";

import React, { useState } from 'react';
import { Plus, MapPin, Edit2, Trash2 } from 'lucide-react';

// Import data dummy dari lib
import { initialSellerProducts } from '@/lib/penjual/productsData';

export default function SellerProducts() {
  const [myProducts, setMyProducts] = useState(initialSellerProducts);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredAddBtn, setHoveredAddBtn] = useState(false);

  const handleEdit = (id, name) => {
    alert(`Membuka modal edit untuk ${name} (ID: ${id})`);
  };

  const handleDelete = (id, name) => {
    if (confirm(`Apakah kamu yakin ingin menghapus ${name} (ID: ${id})?`)) {
      setMyProducts(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleAddProduct = () => {
    alert('Membuka halaman/modal Tambah Produk baru!');
  };

  return (
    <div style={{ 
      backgroundColor: '#FAF6F0', 
      minHeight: '100vh', 
      margin: 0, 
      paddingTop: '100px', 
      paddingBottom: '50px',
      paddingLeft: '40px',
      paddingRight: '40px',
      fontFamily: 'Inter, sans-serif'
    }}>
      
      {/* HEADER: Judul & Tombol Tambah Produk */}
      <div style={{ 
        display: 'flex', 
        justify: 'space-between', 
        alignItems: 'center', 
        marginBottom: '10px',
        paddingBottom: '15px',
        borderBottom: '2px solid #EAE0D5'
      }}>
        <h1 style={{ 
          fontFamily: 'Fraunces, serif', 
          fontSize: '28px', 
          color: '#1A1A1A', 
          margin: 0,
          fontWeight: 'bold'
        }}>
          Kelola Produk
        </h1>

        {/* Tombol + Tambah Produk */}
        <button 
          onClick={handleAddProduct}
          onMouseEnter={() => setHoveredAddBtn(true)}
          onMouseLeave={() => setHoveredAddBtn(false)}
          style={{ 
            backgroundColor: hoveredAddBtn ? '#D95A36' : '#1A1A1A', 
            color: '#FFF', 
            border: 'none', 
            padding: '12px 24px', 
            borderRadius: '12px', 
            fontWeight: 'bold', 
            fontSize: '14px', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: hoveredAddBtn ? '0 6px 16px rgba(217, 90, 54, 0.35)' : '0 2px 8px rgba(0,0,0,0.1)',
            transform: hoveredAddBtn ? 'translateY(-2px)' : 'translateY(0)',
            transition: 'all 0.2s ease'
          }}
        >
          <Plus size={18} strokeWidth={3} />
          Tambah Produk
        </button>
      </div>

      {/* GRID DAFTAR PRODUK */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '24px',
        paddingTop: '20px'
      }}>
        {myProducts.map((item) => {
          const isHovered = hoveredCard === item.id;

          return (
            <div 
              key={item.id} 
              onMouseEnter={() => setHoveredCard(item.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{ 
                backgroundColor: '#FFF', 
                borderRadius: '20px', 
                overflow: 'hidden', 
                border: isHovered ? '1.5px solid #D95A36' : '1px solid rgba(0,0,0,0.06)',
                boxShadow: isHovered ? '0 15px 35px rgba(217, 90, 54, 0.15)' : '0 6px 18px rgba(0,0,0,0.05)',
                transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* GAMBAR PRODUK & LABEL KATEGORI */}
              <div style={{ position: 'relative', width: '100%', height: '200px', backgroundColor: '#F0F0F0', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#AAA', fontSize: '14px' }}>
                  Gambar Produk
                </div>
                
                <span style={{ 
                  position: 'absolute', 
                  top: '12px', 
                  left: '12px', 
                  backgroundColor: 'rgba(255,255,255,0.85)', 
                  color: '#333', 
                  padding: '5px 12px', 
                  borderRadius: '15px', 
                  fontSize: '11px', 
                  fontWeight: 'bold',
                  textTransform: 'capitalize',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  {item.category}
                </span>
              </div>

              {/* DETAIL PRODUK */}
              <div style={{ padding: '20px', flexGrow: 1, position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <h4 style={{ 
                    margin: 0, 
                    fontSize: '18px', 
                    color: isHovered ? '#D95A36' : '#1A1A1A', 
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: '700',
                    lineHeight: '1.2',
                    transition: 'color 0.2s ease',
                    maxWidth: '80%'
                  }}>
                    {item.name}
                  </h4>
                  
                  {/* Ikon Edit & Hapus */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button 
                      onClick={() => handleEdit(item.id, item.name)}
                      title="Edit Produk"
                      style={{ background: 'none', border: '1px solid #CCC', borderRadius: '6px', padding: '5px', cursor: 'pointer', display: 'flex' }}
                      onMouseEnter={(e) => {e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.backgroundColor = '#F5F5F5';}}
                      onMouseLeave={(e) => {e.currentTarget.style.borderColor = '#CCC'; e.currentTarget.style.backgroundColor = 'transparent';}}
                    >
                      <Edit2 size={15} color="#444" />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id, item.name)}
                      title="Hapus Produk"
                      style={{ background: 'none', border: '1px solid #CCC', borderRadius: '6px', padding: '5px', cursor: 'pointer', display: 'flex' }}
                      onMouseEnter={(e) => {e.currentTarget.style.borderColor = '#D93025'; e.currentTarget.style.backgroundColor = '#FFF0F0';}}
                      onMouseLeave={(e) => {e.currentTarget.style.borderColor = '#CCC'; e.currentTarget.style.backgroundColor = 'transparent';}}
                    >
                      <Trash2 size={15} color="#D93025" />
                    </button>
                  </div>
                </div>
                
                {/* Alamat Toko */}
                <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: '#666', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <MapPin size={14} color="#D95A36" /> {item.location}
                </p>

                {/* Detail Waktu & Harga */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 15px', fontSize: '12px', color: '#1A1A1A' }}>
                  <span>{item.startDate}</span>
                  <span style={{ fontWeight: 'bold', textAlign: 'right' }}>{item.price}</span>
                  <span style={{ color: '#666' }}>{item.endDate}</span>
                  <span style={{ fontWeight: 'bold', color: item.status === 'Gratis' || item.status === 'FREE' ? '#2E7D32' : '#1A1A1A', textAlign: 'right' }}>
                    {item.status}
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}