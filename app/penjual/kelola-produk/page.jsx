// app/penjual/kelola-produk/page.jsx
"use client";

import React from 'react';
import { Plus, Image as ImageIcon } from 'lucide-react';

import SellerNavbar from '@/components/penjual/SellerNavbar';
import ProductModal from '@/components/penjual/ProductModal';
import ProductCard from '@/components/penjual/ProductCard';

// Import Context Penjual dari folder terpisah
import { ProductProvider, useProductContext } from '@/app/penjual/context/ProductContext';

function ProductPageContent() {
  const {
    myProducts,
    hoveredCard,
    setHoveredCard,
    hoveredAddBtn,
    setHoveredAddBtn,
    handleOpenAddModal,
    handleOpenEditModal,
    handleDelete
  } = useProductContext();

  return (
    <div style={{ backgroundColor: '#FAF6F0', minHeight: '100vh', paddingBottom: '50px' }}>
      
      <SellerNavbar />

      <div style={{ 
        width: '100%',
        paddingTop: '100px', 
        paddingBottom: '50px',
        paddingLeft: '40px', 
        paddingRight: '40px',
        fontFamily: 'Inter, sans-serif',
        boxSizing: 'border-box'
      }}>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px',
          paddingBottom: '16px',
          borderBottom: '2px solid #EAE0D5'
        }}>
          <div>
            <h1 style={{ 
              fontFamily: 'Fraunces, serif', 
              fontSize: '28px', 
              color: '#1A1A1A', 
              margin: '0 0 4px 0',
              fontWeight: 'bold'
            }}>
              Kelola Produk
            </h1>
            <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
              Atur dan pantau daftar produk yang kamu jual di ReOwn.
            </p>
          </div>

          <button 
            onClick={handleOpenAddModal}
            onMouseEnter={() => setHoveredAddBtn(true)}
            onMouseLeave={() => setHoveredAddBtn(false)}
            style={{ 
              backgroundColor: hoveredAddBtn ? '#D95A36' : '#1A1A1A', 
              color: '#FFF', 
              border: 'none', 
              padding: '12px 24px', 
              borderRadius: '12px', 
              fontWeight: 'bold', 
              fontSize: '14px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: hoveredAddBtn ? '0 6px 16px rgba(217, 90, 54, 0.35)' : '0 2px 8px rgba(0,0,0,0.1)',
              transform: hoveredAddBtn ? 'translateY(-2px)' : 'translateY(0)',
              transition: 'all 0.2s ease'
            }}
          >
            <Plus size={18} strokeWidth={3} />
            Tambah Produk
          </button>
        </div>

        {myProducts.length === 0 ? (
          <div style={{
            backgroundColor: '#FFF',
            borderRadius: '20px',
            padding: '60px 20px',
            textAlign: 'center',
            border: '2px dashed #E5E7EB',
            marginTop: '20px'
          }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: '#FAF0EC', color: '#D95A36', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <ImageIcon size={28} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1A1A1A', margin: '0 0 6px 0' }}>Belum Ada Produk Ditambahkan</h3>
            <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
              Toko kamu masih kosong. Silakan gunakan tombol <strong>"+ Tambah Produk"</strong> di bagian atas untuk mulai menambahkan produk rescue.
            </p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '24px',
            paddingTop: '10px'
          }}>
            {myProducts.map((item) => (
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

      <ProductModalWithContext />

    </div>
  );
}

function ProductModalWithContext() {
  const { isModalOpen, setIsModalOpen, editingProductId, formData, setFormData, handleSubmitProduct } = useProductContext();
  return (
    <ProductModal 
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      editingProductId={editingProductId}
      formData={formData}
      setFormData={setFormData}
      onSubmit={handleSubmitProduct}
    />
  );
}

export default function SellerProductsPage() {
  return (
    <ProductProvider>
      <ProductPageContent />
    </ProductProvider>
  );
}