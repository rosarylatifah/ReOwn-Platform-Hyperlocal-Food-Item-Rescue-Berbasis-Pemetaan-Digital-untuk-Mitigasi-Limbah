import { useState, useEffect } from 'react';
import { getSharedProducts } from '@/lib/pembeli/productHelper';

export function useBuyerProducts() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedUrgency, setSelectedUrgency] = useState('Semua');
  const [activeStorePopover, setActiveStorePopover] = useState(null);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reportingProduct, setReportingProduct] = useState(null);

  useEffect(() => {
    const load = () => setProducts(getSharedProducts());
    load();
    const onStorage = (e) => {
      if (e.key === 'reown:seller-products:v1' || e.key === 'reown:shared-products:v1') load();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const filteredProducts = products
    .filter((item) => {
      const productName = item.name || '';
      const storeName = item.sellerName || item.store || '';
      const matchesSearch =
        productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        storeName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesUrgency =
        selectedUrgency === 'Semua' || (item.urgency || 'Normal') === selectedUrgency;
      if (!matchesUrgency) return false;

      if (selectedCategory === 'Makanan') return matchesSearch && item.category === 'Makanan';
      if (selectedCategory === 'Barang') return matchesSearch && item.category === 'Barang';
      return matchesSearch;
    })
    .sort((a, b) => {
      if (selectedCategory === 'Terdekat') {
        return (a.distanceKm || 0) - (b.distanceKm || 0);
      }
      if (a.isSeller && b.isSeller) return b.id - a.id;
      if (a.isSeller) return -1;
      if (b.isSeller) return 1;
      return (a.id || 0) - (b.id || 0);
    });

  return {
    products,
    filteredProducts,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedUrgency,
    setSelectedUrgency,
    activeStorePopover,
    setActiveStorePopover,
    selectedProduct,
    setSelectedProduct,
    reportingProduct,
    setReportingProduct
  };
}