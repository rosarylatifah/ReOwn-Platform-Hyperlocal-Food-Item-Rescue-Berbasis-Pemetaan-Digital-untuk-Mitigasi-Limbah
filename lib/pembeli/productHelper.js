// kode ini digunakan untuk menyimpan dan mengambil data produk yang dibagikan oleh penjual
const STORAGE_KEY = 'reown_seller_products';

export function getSharedProducts() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSharedProducts(products) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}