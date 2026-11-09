"use client";

import { useEffect, useState } from 'react';
import { useProfile } from '@/lib/ProfileContext';
import { getSellerProducts, saveSellerProducts } from '@/lib/pembeli/productHelper';

const EMPTY_FORM = {
  name: '',
  category: 'Makanan',
  price: '',
  discountPrice: '', // field harga diskon
  location: 'Batam Centre',
  image: '',
  status: 'Aktif',
  urgency: 'Normal',
  stock: '5',
  expiryAt: '',
  urgencyAt: '',
  description: '',
};

const digits = (v) => String(v || '').replace(/[^0-9]/g, '');
const formatPrice = (v) => {
  const clean = digits(v);
  if (!clean) return 'Gratis';
  return `Rp. ${parseInt(clean, 10).toLocaleString('id-ID')}`;
};

export function useProductManager() {
  const { profile } = useProfile();

  const [myProducts, setMyProducts] = useState([]);
  const [ready, setReady] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredAddBtn, setHoveredAddBtn] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    setMyProducts(getSellerProducts());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveSellerProducts(myProducts);
  }, [myProducts, ready]);

  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setFormData(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProductId(product.id);
    setFormData({
      name: product.name || '',
      category: product.category || 'Makanan',
      price: digits(product.price),
      discountPrice: digits(product.discountPrice || ''),
      location: product.location || 'Batam Centre',
      image: product.image || '',
      status: product.status || 'Aktif',
      urgency: product.urgency || 'Normal',
      stock: String(product.stock ?? 5),
      expiryAt: product.expiryAt || product.deadline || '',
      urgencyAt: product.urgencyAt || '',
      description: product.description || '',
    });
    setIsModalOpen(true);
  };

  // Mengembalikan true jika produk benar-benar dihapus (false jika penjual menekan Batal)
  const handleDelete = (id) => {
    const target = myProducts.find((p) => p.id === id);
    if (confirm(`Apakah kamu yakin ingin menghapus "${target?.name || 'produk ini'}"?`)) {
      setMyProducts((prev) => prev.filter((item) => item.id !== id));
      return true;
    }
    return false;
  };

  const handleSubmitProduct = (e) => {
    e.preventDefault();

if (!formData.name || !formData.stock) {
  alert('Mohon isi Nama Produk dan Stok!');
      return;
    }

    if (formData.category === 'Makanan' && !formData.expiryAt) {
      alert('Mohon isi Batas Kadaluarsa untuk produk makanan!');
      return;
    }

    const normalVal = parseInt(digits(formData.price), 10) || 0;
    const discountVal = parseInt(digits(formData.discountPrice), 10) || Math.round(normalVal * 0.5);

    let calculatedUrgency = 'Normal';
    let finalPrice = formatPrice(formData.price);

    if (formData.category === 'Makanan' && formData.expiryAt) {
      const now = new Date();
      const expiryTime = new Date(formData.expiryAt);
      const urgencySoonTime = formData.urgencyAt ? new Date(formData.urgencyAt) : null;

      // Fase Mendesak: sisa waktu 2 jam terakhir sebelum expired atau melewati urgencyAt
      const isUrgentPhase = urgencySoonTime && now >= urgencySoonTime;
      const isAlmostExpired = expiryTime.getTime() - now.getTime() <= 2 * 3600000; // <= 2 jam

      if (now >= expiryTime) {
        calculatedUrgency = 'Expired';
      } else if (isUrgentPhase || isAlmostExpired) {
        // Otomatis Mendesak & Gratis
        calculatedUrgency = 'Mendesak';
        finalPrice = 'Gratis';
      } else if (urgencySoonTime && now >= new Date(urgencySoonTime.getTime() - 12 * 3600000)) {
        // Fase Segera: masuk harga diskon
        calculatedUrgency = 'Segera';
        finalPrice = formatPrice(discountVal);
      }
    } else {
      calculatedUrgency = formData.urgency;
    }

    // Titik lokasi persis toko (diambil penjual lewat GPS di form), ikut disimpan di produk.
    // Pembeli TIDAK melihat titik ini: peta dan jarak memakai titik perkiraan.
    const storeLat = profile?.storeLat ?? null;
    const storeLng = profile?.storeLng ?? null;
    const storeId = profile?.email || profile?.storeName || 'toko';

    if (editingProductId) {
      setMyProducts((prev) =>
        prev.map((item) =>
          item.id === editingProductId
            ? {
                ...item,
                name: formData.name,
                category: formData.category,
                price: finalPrice,
                normalPrice: formatPrice(formData.price),
                discountPrice: formatPrice(formData.discountPrice),
                location: formData.location || 'Batam',
                image: formData.image || item.image,
                status: formData.status,
                urgency: calculatedUrgency,
                stock: parseInt(formData.stock, 10) || 1,
                expiryAt: formData.expiryAt,
                urgencyAt: formData.urgencyAt,
                deadline: formData.expiryAt,
                description: formData.description || `${formData.name} dari ${profile?.storeName || 'Toko Rescue'}.`,
                lat: storeLat ?? item.lat,
                lng: storeLng ?? item.lng,
                storeId: item.storeId ?? storeId,
              }
            : item
        )
      );
    } else {
      const newProduct = {
        id: Date.now(),
        name: formData.name,
        category: formData.category,
        price: finalPrice,
        normalPrice: formatPrice(formData.price),
        discountPrice: formatPrice(formData.discountPrice),
        location: formData.location || 'Batam',
        image:
          formData.image ||
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400',
        status: formData.status,
        store: profile?.storeName || 'Toko Rescue',
        storeId,
        stock: parseInt(formData.stock, 10) || 1,
        urgency: calculatedUrgency,
        expiryAt: formData.expiryAt,
        urgencyAt: formData.urgencyAt,
        deadline: formData.expiryAt,
        description: formData.description || `${formData.name} dari ${profile?.storeName || 'Toko Rescue'}.`,
        lat: storeLat ?? 1.1186,
        lng: storeLng ?? 104.0487,
        isSeller: true,
      };
      setMyProducts((prev) => [newProduct, ...prev]);
    }

    setIsModalOpen(false);
    setEditingProductId(null);
  };

  return {
    myProducts,
    isModalOpen,
    setIsModalOpen,
    editingProductId,
    formData,
    setFormData,
    hoveredCard,
    setHoveredCard,
    hoveredAddBtn,
    setHoveredAddBtn,
    handleOpenAddModal,
    handleOpenEditModal,
    handleDelete,
    handleSubmitProduct,
  };
}