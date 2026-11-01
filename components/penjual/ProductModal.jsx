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
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 1000, padding: '20px', boxSizing: 'border-box'
    }}>
      <div style={{
        backgroundColor: '#FFF', borderRadius: '20px', width: '100%', maxWidth: '500px',
        maxHeight: '90vh', overflowY: 'auto', padding: '28px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        position: 'relative', fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#1A1A1A' }}>
            {editingProductId ? 'Edit Produk Rescue' : 'Tambah Produk Rescue Baru'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Nama Produk */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#444', display: 'block', marginBottom: '6px' }}>Nama Produk *</label>
            <input 
              type="text" 
              placeholder="Misal: Roti Donat Surplus / Makanan Berlebih" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CCC', fontSize: '13px', boxSizing: 'border-box' }}
            />
          </div>

          {/* Kategori, Harga, & Stok */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#444', display: 'block', marginBottom: '6px' }}>Kategori *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                style={{ width: '100%', padding: '10px 8px', borderRadius: '8px', border: '1px solid #CCC', fontSize: '13px', backgroundColor: '#FFF', boxSizing: 'border-box' }}
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
                style={{ width: '100%', padding: '10px 8px', borderRadius: '8px', border: '1px solid #CCC', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#444', display: 'block', marginBottom: '6px' }}>Stok / Porsi *</label>
              <input 
                type="number" 
                min="1"
                placeholder="5" 
                value={formData.stock || ''}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                required
                style={{ width: '100%', padding: '10px 8px', borderRadius: '8px', border: '1px solid #CCC', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#444', display: 'block', marginBottom: '6px' }}>Deskripsi Produk</label>
            <textarea 
              rows="2"
              placeholder="Jelaskan kondisi makanan atau barang..." 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CCC', fontSize: '13px', boxSizing: 'border-box', resize: 'vertical' }}
            />
          </div>

          {/* Lokasi & Deadline */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#444', display: 'block', marginBottom: '6px' }}>Lokasi Toko *</label>
              <input 
                type="text" 
                placeholder="Batam Centre" 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                required
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CCC', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#444', display: 'block', marginBottom: '6px' }}>Batas Waktu (Deadline) *</label>
              <input 
                type="datetime-local" 
                value={formData.deadline}
                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                required
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CCC', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Input Unggah File Gambar */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#444', display: 'block', marginBottom: '6px' }}>Upload Foto Produk (PNG/JPG) *</label>
            <input 
              type="file" 
              accept="image/png, image/jpeg, image/jpg"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    // Simpan hasil konversi file ke base64 string di formData.image
                    setFormData({...formData, image: reader.result});
                  };
                  reader.readAsDataURL(file);
                }
              }}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CCC', fontSize: '13px', boxSizing: 'border-box', backgroundColor: '#FAFAFA' }}
            />
            {formData.image && (
              <p style={{ fontSize: '11px', color: '#2E7D32', marginTop: '4px', margin: 0 }}>
                ✓ Foto berhasil dipilih & dimuat!
              </p>
            )}
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: '#D95A36', color: '#FFF', border: 'none',
              padding: '12px', borderRadius: '10px', fontWeight: 'bold',
              fontSize: '14px', cursor: 'pointer', marginTop: '10px', transition: 'background 0.2s'
            }}
          >
            {editingProductId ? 'Simpan Perubahan' : 'Publikasi Listing'}
          </button>
        </form>
      </div>
    </div>
  );
}