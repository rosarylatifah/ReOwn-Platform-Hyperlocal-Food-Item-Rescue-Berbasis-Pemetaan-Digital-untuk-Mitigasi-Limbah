// Contoh fungsi get & save produk ke localStorage
export function getSharedProducts() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('reown:shared-products:v1');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSharedProducts(products) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('reown:shared-products:v1', JSON.stringify(products));
}