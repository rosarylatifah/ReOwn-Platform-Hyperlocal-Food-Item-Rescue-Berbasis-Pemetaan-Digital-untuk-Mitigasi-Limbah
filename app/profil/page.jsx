"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // 👈 Tambahkan router untuk navigasi otomatis
import { useProfile } from '@/lib/ProfileContext';

export default function ProfilePage() {
  const { profile, updateProfile, toggleSellerMode } = useProfile();
  const router = useRouter(); // 👈 Inisialisasi router
  
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    address: profile.address,
    storeName: profile.storeName,
    storeAddress: profile.storeAddress
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    
    // Pastikan mode penjual aktif, lalu arahkan ke beranda penjual
    toggleSellerMode(true); 
    
    alert("Profil berhasil diperbarui! Mengalihkan ke Beranda Penjual...");
    
    // 👈 Otomatis pindah halaman ke /penjual/beranda
    router.push('/penjual/beranda');
  };

  return (
    <div style={{ backgroundColor: '#FAF0EC', minHeight: '100vh', paddingTop: '12px', paddingLeft: '40px', paddingRight: '40px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#FFF', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        
        <h2 style={{ margin: '0 0 20px 0', color: '#1A1A1A', fontFamily: 'Fraunces, serif' }}>
          Pengaturan Profil Akun
        </h2>

        {/* FOTO PROFIL */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <img src={profile.avatar} alt="Avatar" style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #D95A36' }} />
          <div>
            <button type="button" style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #D95A36', background: '#FFF3ED', color: '#D95A36', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>
              Ubah Foto Profil
            </button>
          </div>
        </div>

        {/* TOGGLE AKUN TUNGGAL (PEMBELI / PENJUAL) */}
        <div style={{ backgroundColor: '#FAF0EC', padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#1A1A1A' }}>Status Mode Penjual</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Aktifkan mode penjual untuk mulai mengelola produk toko kamu.</div>
          </div>
          <input 
            type="checkbox" 
            checked={profile.isSellerActive} 
            onChange={(e) => toggleSellerMode(e.target.checked)}
            style={{ width: '20px', height: '20px', accentColor: '#D95A36', cursor: 'pointer' }}
          />
        </div>

        {/* FORM INPUT DATA */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#444' }}>Nama Lengkap</label>
            <input 
              type="text" name="name" value={formData.name} onChange={handleChange}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #DDD', marginTop: '4px', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#444' }}>Email</label>
            <input 
              type="email" name="email" value={formData.email} onChange={handleChange}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #DDD', marginTop: '4px', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#444' }}>Nomor Telepon</label>
            <input 
              type="text" name="phone" value={formData.phone} onChange={handleChange}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #DDD', marginTop: '4px', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#444' }}>Alamat</label>
            <input 
              type="text" name="address" value={formData.address} onChange={handleChange}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #DDD', marginTop: '4px', fontSize: '13px' }}
            />
          </div>

          {/* JIKA MODE PENJUAL AKTIF, BISA EDIT NAMA TOKO */}
          {profile.isSellerActive && (
            <div style={{ marginTop: '10px', borderTop: '1px dashed #DDD', paddingTop: '16px' }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#D95A36' }}>Informasi Toko</h4>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#444' }}>Nama Toko</label>
                <input 
                  type="text" name="storeName" value={formData.storeName} onChange={handleChange}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #DDD', marginTop: '4px', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#444' }}>Alamat Toko</label>
                <input 
                  type="text" name="storeAddress" value={formData.storeAddress} onChange={handleChange}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #DDD', marginTop: '4px', fontSize: '13px' }}
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            style={{ marginTop: '12px', padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#D95A36', color: '#FFF', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
          >
            Simpan Perubahan & Masuk ke Mode Penjual
          </button>
        </form>

      </div>
    </div>
  );
}