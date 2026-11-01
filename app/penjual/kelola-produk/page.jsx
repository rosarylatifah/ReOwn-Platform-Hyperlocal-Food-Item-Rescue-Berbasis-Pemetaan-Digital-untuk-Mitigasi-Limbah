"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Image as ImageIcon } from 'lucide-react';
import SellerNavbar from '@/components/penjual/SellerNavbar'; // Pastikan path import ini bener sesuai foldermu
import ProductCard from '@/components/penjual/ProductCard';
import ProductModal from '@/components/penjual/ProductModal';

export default function SellerProductsPage() {
  const [myProducts, setMyProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Makanan',
    price: '',
    stock: '1',
    location: '',
    description: '',
    deadline: '',
    image: '',
    status: 'Available'
  });

  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('reown_seller_products');
    if (saved) {
      setMyProducts(JSON.parse(saved));
    } else {
      const initialData = [
        {
          id: 1,
          name: 'Roti Sisa Bakery Layak Konsumsi',
          category: 'Makanan',
          price: '10000',
          stock: '5',
          location: 'Batam Centre',
          description: 'Roti sisa hari ini masih empuk dan layak dikonsumsi.',
          deadline: '2026-11-01T20:00',
          image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=60',
          status: 'Available'
        }
      ];
      setMyProducts(initialData);
      localStorage.setItem('reown_seller_products', JSON.stringify(initialData));
    }
  }, []);

  const saveToStorage = (data) => {
    setMyProducts(data);
    localStorage.setItem('reown_seller_products', JSON.stringify(data));
  };

  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setFormData({ name: '', category: 'Makanan', price: '', stock: '1', location: '', description: '', deadline: '', image: '', status: 'Available' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProductId(product.id);
    setFormData({
      name: product.name || '',
      category: product.category || 'Makanan',
      price: product.price || '',
      stock: product.stock || '1',
      location: product.location || '',
      description: product.description || '',
      deadline: product.deadline || '',
      image: product.image || '',
      status: product.status || 'Available'
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id, name) => {
    if (confirm(`Yakin ingin menghapus produk "${name}"?`)) {
      const filtered = myProducts.filter(item => item.id !== id);
      saveToStorage(filtered);
    }
  };

  const handleSubmitProduct = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.location || !formData.deadline || !formData.stock) {
      alert("Mohon isi Nama Produk, Stok, Lokasi, dan Batas Waktu (Deadline)!");
      return;
    }

    if (editingProductId) {
      const updated = myProducts.map(item => 
        item.id === editingProductId ? { ...item, ...formData } : item
      );
      saveToStorage(updated);
    } else {
      const newProduct = {
        id: Date.now(),
        ...formData,
        image: formData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=60',
        status: 'Available'
      };
      saveToStorage([newProduct, ...myProducts]);
    }

    setIsModalOpen(false);
  };

  return (
    <div style={{ backgroundColor: '#FAF6F0', minHeight: '100vh', paddingBottom: '50px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* 1. PEMANGGILAN SELLER NAVBAR DI SINI */}
      <SellerNavbar />

      {/* Konten Utama dengan jarak atas (paddingTop) supaya tidak tertutup navbar */}
      <div style={{ width: '100%', paddingTop: '100px', paddingBottom: '30px', paddingLeft: '40px', paddingRight: '40px', boxSizing: 'border-box' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '2px solid #EAE0D5', paddingBottom: '16px' }}>
          <div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', color: '#1A1A1A', margin: '0 0 4px 0', fontWeight: 'bold' }}>
              Kelola Produk Penjual
            </h1>
            <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
              Atur dan publikasikan daftar makanan atau barang rescue kamu di ReOwn.
            </p>
          </div>

          <button 
            onClick={handleOpenAddModal}
            style={{ 
              backgroundColor: '#1A1A1A', color: '#FFF', border: 'none', 
              padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', fontSize: '14px', 
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <Plus size={18} strokeWidth={3} /> Tambah Produk
          </button>
        </div>

        {myProducts.length === 0 ? (
          <div style={{ backgroundColor: '#FFF', borderRadius: '20px', padding: '60px 20px', textAlign: 'center', border: '2px dashed #E5E7EB', marginTop: '20px' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: '#FAF0EC', color: '#D95A36', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <ImageIcon size={28} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1A1A1A', margin: '0 0 6px 0' }}>Belum Ada Produk Ditambahkan</h3>
            <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
              Gunakan tombol <strong>"+ Tambah Produk"</strong> di atas untuk mulai memasukkan listing rescue kamu.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px', paddingTop: '10px' }}>
            {myProducts.Item?.map || myProducts.map((item) => (
              <ProductCard 
                key={item.id}
                item={item}
                isHovered={hoveredCard === item.id}
                onHover={() => setHoveredCard(item.id)}
                onLeave={() => setHoveredCard(null)}
                onEdit={handleOpenEditModal}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

      </div>

      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingProductId={editingProductId}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmitProduct}
      />
    </div>
  );
}