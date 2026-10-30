// lib/pembeli/productHelper.js
import { products as staticProducts } from '@/lib/pembeli/productsData';

const STORAGE_KEY = 'reown:shared-products:v1'; // data bersama lama (tetap didukung)
const SELLER_KEY = 'reown:seller-products:v1';  // produk buatan penjual

export function getSellerProducts() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SELLER_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSellerProducts(list) {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(SELLER_KEY, JSON.stringify(list));
    return true;
  } catch {
    alert('Penyimpanan penuh. Gunakan gambar yang lebih kecil.');
    return false;
  }
}

// Dipakai pembeli: produk penjual yang aktif (paling atas) + data bawaan
export function getSharedProducts() {
  if (typeof window === 'undefined') return [];
  let base = staticProducts;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) base = JSON.parse(raw);
  } catch {}
  const seller = getSellerProducts().filter((p) => !p.status || p.status === 'Aktif');
  return [...seller, ...base];
}

export function saveSharedProducts(products) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

// Perkecil gambar (lebar maks 800px) supaya muat di localStorage
export function compressImage(file, maxWidth = 800, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}