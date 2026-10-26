"use client";

import { useState } from 'react';

export function useProductManager() {
  const [myProducts, setMyProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredAddBtn, setHoveredAddBtn] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Makanan',
    price: '',
    location: 'Batam Centre',
    image: '',
    status: 'Aktif'
  });

  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setFormData({
      name: '',
      category: 'Makanan',
      price: '',
      location: 'Batam Centre',
      image: '',
      status: 'Aktif'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProductId(product.id);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.replace('Rp ', ''),
      location: product.location,
      image: product.image,
      status: product.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id, name) => {
    if (confirm(`Apakah kamu yakin ingin menghapus "${name}"?`)) {
      setMyProducts(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleSubmitProduct = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      alert('Nama produk dan harga wajib diisi!');
      return;
    }

    const formattedPrice = formData.price.startsWith('Rp') 
      ? formData.price 
      : `Rp ${formData.price}`;

    if (editingProductId) {
      setMyProducts(prev => prev.map(item => {
        if (item.id === editingProductId) {
          return {
            ...item,
            name: formData.name,
            category: formData.category,
            price: formattedPrice,
            location: formData.location || 'Batam',
            image: formData.image || item.image,
            status: formData.status
          };
        }
        return item;
      }));
    } else {
      const newProduct = {
        id: Date.now(),
        name: formData.name,
        category: formData.category,
        price: formattedPrice,
        location: formData.location || 'Batam',
        image: formData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400',
        status: formData.status
      };
      setMyProducts(prev => [newProduct, ...prev]);
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
    handleSubmitProduct
  };
}