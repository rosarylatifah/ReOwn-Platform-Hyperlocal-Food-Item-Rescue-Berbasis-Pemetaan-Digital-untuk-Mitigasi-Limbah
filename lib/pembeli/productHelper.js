import { products as staticProducts } from '@/lib/pembeli/productsData';

const SELLER_KEY = 'reown:seller-products:v1'; 
const STORAGE_KEY = 'reown:shared-products:v1';

export function getSellerProducts() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SELLER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Kalau datanya ada dan berupa array, kembalikan. Kalau kosong, lempar ke data dummy
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Gagal membaca produk:", e);
  }

  // 💡 JIKA KOSONG: Paksa masukkan data dummy dari productData.js ke localStorage
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SELLER_KEY, JSON.stringify(staticProducts));
    } catch (e) {
      console.error("Gagal menyimpan data dummy:", e);
    }
  }
  return staticProducts;
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

export function getSharedProducts() {
  const sellerProducts = getSellerProducts();
  return sellerProducts.filter((p) => !p.status || p.status === 'Aktif');
}

export function saveSharedProducts(products) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SELLER_KEY, JSON.stringify(products));
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