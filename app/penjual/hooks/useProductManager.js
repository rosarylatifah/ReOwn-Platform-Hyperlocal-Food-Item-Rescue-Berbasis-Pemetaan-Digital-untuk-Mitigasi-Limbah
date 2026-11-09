"use client";

import { useEffect, useState } from 'react';
import { useProfile } from '@/lib/ProfileContext';
import { getSellerProducts, saveSellerProducts } from '@/lib/pembeli/productHelper';
import { useAuth } from '@/lib/auth';
import { coordsForArea, DEFAULT_COORD } from '@/lib/pembeli/areaCoords';
import { applySchedule, splitDT, joinDT } from '@/lib/pembeli/productSchedule';

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
  geoSource: '',   // 'gps' | 'area' | ''
  gpsLat: null,
  gpsLng: null,
  autoSchedule: false,
  segeraDate: '',
  segeraTime: '',
  mendesakDate: '',
  mendesakTime: '',
};

const digits = (v) => String(v || '').replace(/[^0-9]/g, '');
const formatPrice = (v) => {
  const clean = digits(v);
  if (!clean) return 'Gratis';
  return `Rp. ${parseInt(clean, 10).toLocaleString('id-ID')}`;
};
const DEFAULT_URGENCY_HOURS = 8;

export function useProductManager() {
  const { profile } = useProfile();
  const { user } = useAuth();

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

  // Hitung ulang status terjadwal saat dibuka dan tiap menit
  useEffect(() => {
    if (!ready) return;
    const tick = () =>
      setMyProducts((prev) => {
        const next = prev.map(applySchedule);
        return next.some((p, i) => p !== prev[i]) ? next : prev;
      });
    tick();
    const t = setInterval(tick, 60000);
    return () => clearInterval(t);
  }, [ready]);

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
      geoSource: '',
      gpsLat: product.lat ?? null,
      gpsLng: product.lng ?? null,
      autoSchedule: !!product.autoSchedule,
      segeraDate: splitDT(product.segeraAt)[0],
      segeraTime: splitDT(product.segeraAt)[1],
      mendesakDate: splitDT(product.mendesakAt)[0],
      mendesakTime: splitDT(product.mendesakAt)[1],
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
          const isFoodItem = formData.category === 'Makanan';
    if (!isFoodItem && formData.autoSchedule) {
      if (!formData.segeraDate && !formData.mendesakDate) {
        alert('Isi minimal satu tanggal untuk status otomatis, atau matikan opsinya.');
        return;
      }
      const s = joinDT(formData.segeraDate, formData.segeraTime);
      const m = joinDT(formData.mendesakDate, formData.mendesakTime);
      if (s && m && new Date(m) <= new Date(s)) {
        alert('Waktu Mendesak harus setelah waktu Segera.');
        return;
      }
    }
    const schedule = isFoodItem
      ? { autoSchedule: false, segeraAt: '', mendesakAt: '' }
      : {
          autoSchedule: !!formData.autoSchedule,
          segeraAt: formData.autoSchedule ? joinDT(formData.segeraDate, formData.segeraTime) : '',
          mendesakAt: formData.autoSchedule ? joinDT(formData.mendesakDate, formData.mendesakTime) : '',
        };
      // Batas urgensi opsional: kosong = 8 jam sebelum kadaluarsa
      const urgencyTime = formData.urgencyAt
        ? new Date(formData.urgencyAt)
        : new Date(expiryTime.getTime() - DEFAULT_URGENCY_HOURS * 3600000);

      if (now >= expiryTime) {
        calculatedUrgency = 'Expired';
      } else if (now >= urgencyTime) {
        calculatedUrgency = 'Mendesak';
        finalPrice = 'Gratis';
      } else if (now >= new Date(urgencyTime.getTime() - 12 * 3600000)) {
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
    const storeId = user?.email || profile?.storeName || 'toko';
    const areaFallback = coordsForArea(formData.location) || DEFAULT_COORD;
    const point =
      formData.geoSource === 'gps' && formData.gpsLat != null
        ? { lat: formData.gpsLat, lng: formData.gpsLng }
        : formData.geoSource === 'area'
        ? areaFallback
        : null;

    if (editingProductId) {
      setMyProducts((prev) =>
        prev.map((item) =>
          item.id === editingProductId
            ? applySchedule({
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
                lat: point?.lat ?? item.lat,
                lng: point?.lng ?? item.lng,
                storeId: item.storeId ?? storeId,
              ...schedule,
              })
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
        discountPrice: formatPrice(formData.discountPrice || discountVal),
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
        lat: point?.lat ?? profile?.storeLat ?? areaFallback.lat,
        lng: point?.lng ?? profile?.storeLng ?? areaFallback.lng,
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