"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  // Nilai awal kosong/default bersih sebelum mendeteksi akun login aktif
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: 'Batam, Indonesia',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isSellerActive: false,
    storeName: '',
    storeAddress: '',
    storeLogo: '',
    totalProducts: 0
  });

  // Sinkronkan data profil dengan akun yang sedang login/register
  useEffect(() => {
    try {
      // 1. Cek apakah ada data profil khusus yang pernah disimpan
      const savedProfile = localStorage.getItem('reown_user_profile');
      // 2. Cek data sesi login/register dari auth (reown:session:v1)
      const sessionRaw = localStorage.getItem('reown:session:v1');
      const sessionUser = sessionRaw ? JSON.parse(sessionRaw) : null;

      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      } else if (sessionUser) {
        // Jika belum ada profile tersimpan tapi sudah ada user login/regis, ambil datanya!
        setProfile((prev) => ({
          ...prev,
          name: sessionUser.nama || sessionUser.name || '',
          email: sessionUser.email || '',
          phone: sessionUser.telepon || sessionUser.phone || '',
          storeName: sessionUser.storeName || `${sessionUser.nama || 'Toko'}'s Store`,
        }));
      }
    } catch (e) {
      console.error("Gagal load data profil:", e);
    }
  }, []);

  // Fungsi memperbarui profil (otomatis simpan ke localStorage & sinkron ke seluruh komponen)
  const updateProfile = (updatedData) => {
    setProfile((prev) => {
      const newProfile = { ...prev, ...updatedData };
      localStorage.setItem('reown_user_profile', JSON.stringify(newProfile));
      return newProfile;
    });
  };

  // Fungsi toggle peran (Switch Pembeli / Penjual)
  const toggleSellerMode = (status) => {
    updateProfile({ isSellerActive: status });
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, toggleSellerMode }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);