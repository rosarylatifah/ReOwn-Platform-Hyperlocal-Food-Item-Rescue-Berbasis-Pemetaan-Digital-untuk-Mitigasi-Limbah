"use client";

import React from 'react';
import { Plus, Image as ImageIcon } from 'lucide-react';
import SellerNavbar from '@/components/penjual/SellerNavbar';
import ProductCard from '@/components/penjual/ProductCard';
import AddProductModal from '@/components/penjual/AddProductModal';
import StatusDot from '@/components/ui/StatusDot';
import { fraunces, gochiHand } from '@/lib/fonts';
import { useProductManager } from '@/app/penjual/hooks/useProductManager';
import { useNotification } from '@/app/context/notification';

export default function SellerProductsPage() {
  const {
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
    handleDelete: originalHandleDelete,
    handleSubmitProduct: originalHandleSubmit,
  } = useProductManager();

  const { addNotification } = useNotification();

  // 1. Wrapper untuk Tambah / Edit Produk
  const handleSubmitProduct = (e) => {
    e.preventDefault();
    const isEditing = Boolean(editingProductId);

    // Jalankan fungsi simpan/edit asli
    originalHandleSubmit(e);

    // Kirim notifikasi ke Admin berdasarkan aksi
    if (isEditing) {
      addNotification({
        role: 'admin',
        title: 'Produk Diperbarui Penjual',
        message: `Penjual memperbarui informasi pada produk "${formData.name}".`,
        type: 'info',
        link: '/admin/laporan'
      });
    } else {
      addNotification({
        role: 'admin',
        title: 'Produk Baru Ditambahkan!',
        message: `Penjual menambahkan produk baru: "${formData.name}". Silakan tinjau etalase.`,
        type: 'order',
        link: '/admin/laporan'
      });
    }
  };

  // 2. Wrapper untuk Hapus Produk (notifikasi hanya terkirim kalau benar-benar dihapus)
  const handleDelete = (productId) => {
    // Ambil nama produk dulu sebelum dihapus
    const targetProduct = myProducts.find((p) => p.id === productId);

    // Jalankan fungsi hapus asli; false = penjual menekan Batal
    const deleted = originalHandleDelete(productId);
    if (!deleted) return;

    addNotification({
      role: 'admin',
      title: 'Produk Dihapus Penjual',
      message: `Penjual telah menghapus produk "${targetProduct?.name || 'Produk'}".`,
      type: 'warning',
      link: '/admin/laporan'
    });
  };

  return (
    <div className="min-h-screen bg-[#FFF7E9] pb-12">
      <SellerNavbar />

      <div className="mx-auto max-w-[1280px] px-5 pb-12 pt-24 md:px-8">
        {/* HEADER */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b-2 border-[#F23A10]/15 pb-5">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border-2 border-[#F23A10] bg-white px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#E0452A]">
              <StatusDot />
              Etalase toko
            </p>
            <h1 className={`${fraunces.className} mt-3 text-3xl font-extrabold uppercase leading-[1.05] tracking-tight text-stone-900 md:text-[2.6rem]`}>
              Kelola Produk
            </h1>
            <p className={`${gochiHand.className} mt-2 text-base leading-relaxed text-stone-600`}>
              Atur dan pantau daftar produk yang kamu jual di ReOwn.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            onMouseEnter={() => setHoveredAddBtn(true)}
            onMouseLeave={() => setHoveredAddBtn(false)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#F23A10] px-6 py-3 text-[13px] font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#95F57C] hover:text-stone-900 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16A34A]"
          >
            <Plus size={18} strokeWidth={3} /> Tambah Produk
          </button>
        </div>

        {myProducts.length === 0 ? (
          <div className="mt-5 rounded-[22px] border-2 border-dashed border-[#F23A10]/30 bg-white px-5 py-16 text-center shadow-[4px_6px_8px_-2px_rgba(0,0,0,0.15)]">
            <div className="mx-auto mb-4 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#F23A10]/10 text-[#F23A10]">
              <ImageIcon size={28} />
            </div>
            <h3 className={`${fraunces.className} mb-1.5 text-lg font-extrabold uppercase tracking-tight text-stone-900`}>
              Belum Ada Produk Ditambahkan
            </h3>
            <p className="m-0 text-[13px] text-stone-600">
              Toko kamu masih kosong. Silakan gunakan tombol <strong>"+ Tambah Produk"</strong> di bagian atas untuk mulai menambahkan produk rescue.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 pt-2.5">
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

      {/* MODAL FORM TAMBAH/EDIT */}
      <AddProductModal
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
