"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  // Single source of truth untuk profil pengguna
  const [profile, setProfile] = useState({
    name: 'Azzahara Faiza Rayya',
    email: 'zara@polsri.ac.id',
    phone: '081234567890',
    address: 'Batam Centre, Kota Batam',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    // Data Khusus Penjual (Satu Akun)
    isSellerActive: false,
    storeName: 'Rayya Store',
    storeAddress: 'Nagoya Hill Mall, Batam',
    storeLogo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    totalProducts: 12
  });

  // Load data dari localStorage saat awal dimuat
  useEffect(() => {
    const savedProfile = localStorage.getItem('reown_user_profile');
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error("Gagal load profil dari localStorage:", e);
      }
    }
  }, []);

  // Fungsi memperbarui profil (otomatis merubah semua komponen & popover)
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