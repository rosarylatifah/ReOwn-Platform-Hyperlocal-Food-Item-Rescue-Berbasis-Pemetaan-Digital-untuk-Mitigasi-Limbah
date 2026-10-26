// hooks/pembeli/useBuyerProducts.js
import { useState, useEffect } from 'react';
import { getSharedProducts } from '@/lib/pembeli/productHelper';

export function useBuyerProducts() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [activeStorePopover, setActiveStorePopover] = useState(null);
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reportingProduct, setReportingProduct] = useState(null);

  useEffect(() => {
    setProducts(getSharedProducts());
  }, []);

  const filteredProducts = products
    .filter(item => {
      const productName = item.name || '';
      const storeName = item.sellerName || item.store || '';
      const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            storeName.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (selectedCategory === 'Makanan') return matchesSearch && item.category === 'Makanan';
      if (selectedCategory === 'Barang') return matchesSearch && item.category === 'Barang';
      return matchesSearch; 
    })
    .sort((a, b) => {
      if (selectedCategory === 'Terdekat') {
        return (a.distanceKm || 0) - (b.distanceKm || 0);
      }
      // Urutkan dari yang diposting paling lama (ID kecil duluan)
      return (a.id || 0) - (b.id || 0);
    });

  return {
    products,
    filteredProducts,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    activeStorePopover,
    setActiveStorePopover,
    selectedProduct,
    setSelectedProduct,
    reportingProduct,
    setReportingProduct
  };
}