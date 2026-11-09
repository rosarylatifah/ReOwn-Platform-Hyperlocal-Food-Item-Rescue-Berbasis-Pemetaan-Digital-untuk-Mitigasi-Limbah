"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';

const ProfileContext = createContext();

const DEFAULT_PROFILE = {
  name: '',
  email: '',
  phone: '',
  address: 'Batam, Indonesia',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  isSellerActive: false,
  storeName: '',
  storeAddress: '',
  storeLogo: '',
  totalProducts: 0,
};

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const { user, hydrated } = useAuth();

  // Profil mengikuti akun yang sedang login: terisi saat login, kosong lagi saat logout
  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      setProfile(DEFAULT_PROFILE);
      return;
    }
    try {
      const raw = localStorage.getItem('reown_user_profile');
      const saved = raw ? JSON.parse(raw) : null;
      // Pakai profil tersimpan hanya kalau milik akun ini
      if (saved && (saved.ownerEmail || saved.email) === user.email) {
        setProfile({ ...DEFAULT_PROFILE, ...saved });
      } else {
        setProfile({
          ...DEFAULT_PROFILE,
          name: user.nama || '',
          email: user.email || '',
          phone: user.telepon || '',
          storeName: user.storeName || `${user.nama || 'Toko'}'s Store`,
        });
      }
    } catch (e) {
      console.error('Gagal load data profil:', e);
    }
  }, [user?.email, hydrated]);

  // Memperbarui profil (otomatis simpan ke localStorage & sinkron ke seluruh komponen)
  const updateProfile = (updatedData) => {
    setProfile((prev) => {
      const newProfile = { ...prev, ...updatedData, ownerEmail: user?.email ?? prev.ownerEmail };
      localStorage.setItem('reown_user_profile', JSON.stringify(newProfile));
      return newProfile;
    });
  };

  // Toggle peran (Switch Pembeli / Penjual)
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