"use client";

import React from 'react';
import { X } from 'lucide-react';

export default function ProductModal({ 
  isOpen, 
  onClose, 
  editingProductId, 
  formData, 
  setFormData, 
  onSubmit 
}) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#FFF',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '480px',
        padding: '24px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#1A1A1A' }}>
            {editingProductId ? 'Edit Produk' : 'Tambah Produk Baru'}
          </h3>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#444', display: 'block', marginBottom: '6px' }}>Nama Produk</label>
            <input 
              type="text" 
              placeholder="Misal: Roti Donat Surplus / Baju Preloved" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CCC', fontSize: '13px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#444', display: 'block', marginBottom: '6px' }}>Kategori</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CCC', fontSize: '13px', boxSizing: 'border-box' }}
              >
                <option value="Makanan">Makanan</option>
                <option value="Barang">Barang</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#444', display: 'block', marginBottom: '6px' }}>Harga (Rp)</label>
              <input 
                type="text" 
                placeholder="15000" 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CCC', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#444', display: 'block', marginBottom: '6px' }}>Lokasi Toko</label>
            <input 
              type="text" 
              placeholder="Batam Centre" 
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CCC', fontSize: '13px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#444', display: 'block', marginBottom: '6px' }}>URL Gambar Produk (Opsional)</label>
            <input 
              type="text" 
              placeholder="https://..." 
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CCC', fontSize: '13px', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: '#D95A36',
              color: '#FFF',
              border: 'none',
              padding: '12px',
              borderRadius: '10px',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            {editingProductId ? 'Simpan Perubahan' : 'Simpan Produk Baru'}
          </button>
        </form>
      </div>
    </div>
  );
}