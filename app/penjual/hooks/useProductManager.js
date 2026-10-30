"use client";

import { useEffect, useState } from 'react';
import { useProfile } from '@/lib/ProfileContext';
import { getSellerProducts, saveSellerProducts } from '@/lib/pembeli/productHelper';

const EMPTY_FORM = {
  name: '',
  category: 'Makanan',
  price: '',
  location: 'Batam Centre',
  image: '',
  status: 'Aktif',
  urgency: 'Normal',
  stock: '5',
};

const digits = (v) => String(v || '').replace(/[^0-9]/g, '');
const formatPrice = (v) => `Rp. ${(parseInt(digits(v), 10) || 0).toLocaleString('id-ID')}`;

export function useProductManager() {
  const { profile } = useProfile();

  const [myProducts, setMyProducts] = useState([]);
  const [ready, setReady] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredAddBtn, setHoveredAddBtn] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  // Muat produk yang tersimpan saat halaman dibuka
  useEffect(() => {
    setMyProducts(getSellerProducts());
    setReady(true);
  }, []);

  // Simpan setiap ada perubahan (setelah data awal termuat)
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
      name: product.name,
      category: product.category,
      price: digits(product.price),
      location: product.location,
      image: product.image,
      status: product.status || 'Aktif',
      urgency: product.urgency || 'Normal',
      stock: String(product.stock ?? 5),
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id, name) => {
    if (confirm(`Apakah kamu yakin ingin menghapus "${name}"?`)) {
      setMyProducts((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleSubmitProduct = (e) => {
    e.preventDefault();

    if (!formData.name || !(parseInt(digits(formData.price), 10) > 0)) {
      alert('Nama produk dan harga (lebih dari 0) wajib diisi!');
      return;
    }

    const price = formatPrice(formData.price);

    if (editingProductId) {
      setMyProducts((prev) =>
        prev.map((item) =>
          item.id === editingProductId
            ? {
                ...item,
                name: formData.name,
                category: formData.category,
                price,
                location: formData.location || 'Batam',
                image: formData.image || item.image,
                status: formData.status,
                urgency: formData.urgency,
                stock: parseInt(formData.stock, 10) || 1,
              }
            : item
        )
      );
    } else {
      const newProduct = {
        id: Date.now(), // numerik, supaya urutan di sisi pembeli tetap valid
        name: formData.name,
        category: formData.category,
        price,
        location: formData.location || 'Batam',
        image:
          formData.image ||
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400',
        status: formData.status,
        // field yang dibutuhkan sisi pembeli
        store: profile?.storeName || 'Toko Rescue',
        stock: parseInt(formData.stock, 10) || 1,
        urgency: formData.urgency,
        description: `${formData.name} dari ${profile?.storeName || 'Toko Rescue'}.`,
        lat: 1.1186,
        lng: 104.0487,
        distanceKm: 1,
        distance: '1 km',
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