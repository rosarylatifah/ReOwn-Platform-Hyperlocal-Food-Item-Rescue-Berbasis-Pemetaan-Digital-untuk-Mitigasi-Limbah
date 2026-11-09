"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { fraunces } from '@/lib/fonts';
import { useProfile } from '@/lib/ProfileContext';
import { compressImage } from '@/lib/pembeli/productHelper';
import { URGENCY_MIN_HOURS, validateExpiry } from '@/lib/pembeli/productExpiry';

const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-600';
const fieldClass =
  'box-border w-full rounded-xl border-2 border-stone-200 bg-white px-3 py-2.5 text-[13px] text-stone-900 outline-none transition-colors placeholder:text-stone-400 focus:border-[#F23A10] focus-visible:ring-4 focus-visible:ring-[#16A34A]/30 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-500';
const errClass = 'mt-1 text-xs font-medium text-red-600';
const AREAS = ['Batam Centre', 'Nagoya', 'Lubuk Baja', 'Batu Ampar', 'Jodoh', 'Bengkong', 'Botania', 'Sekupang', 'Batu Aji', 'Sagulung', 'Tiban', 'Nongsa'];
const OTHER = '__other';

// Ubah titik GPS jadi nama area (layanan gratis OpenStreetMap, butuh internet)
async function reverseArea(lat, lng) {
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=16&accept-language=id&lat=${lat}&lon=${lng}`
    );
    const a = (await r.json()).address || {};
    return a.suburb || a.neighbourhood || a.village || a.city_district || a.city || null;
  } catch {
    return null;
  }
}

export default function ProductModal({
  isOpen,
  onClose,
  editingProductId,
  formData,
  setFormData,
  onSubmit
}) {
  // Hook harus berada SEBELUM early return
  const { profile, updateProfile } = useProfile();
  const [gpsMsg, setGpsMsg] = useState('');
  const hasPoint = profile?.storeLat != null && profile?.storeLng != null;

const takeGps = () => {
  if (!navigator.geolocation) { setGpsMsg('Browser tidak mendukung GPS.'); return; }
  setGpsMsg('Mengambil lokasi...');
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude, longitude } = pos.coords;
      updateProfile({ storeLat: latitude, storeLng: longitude });
      setGpsMsg('Titik tersimpan. Mencari nama area...');
      const name = await reverseArea(latitude, longitude);
      if (name) {
        const preset = AREAS.find(
          (a) => name.toLowerCase().includes(a.toLowerCase()) || a.toLowerCase().includes(name.toLowerCase())
        );
        setFormData((f) => ({ ...f, location: preset || name }));
        setGpsMsg(`Titik tersimpan. Area terisi otomatis: ${preset || name}.`);
      } else {
        setGpsMsg('Titik tersimpan. Nama area tidak terdeteksi, pilih manual di bawah.');
      }
    },
    () => setGpsMsg('Gagal mengambil GPS. Pastikan izin lokasi aktif.'),
    { enableHighAccuracy: true, timeout: 10000 }
  );
};

  if (!isOpen) return null;

  const isFood = formData.category === 'Makanan';
  const expiryAt = formData.expiryAt ?? '';
  const urgencyAt = formData.urgencyAt ?? '';

  const errors = validateExpiry(formData);
  const expiryErr = expiryAt ? errors.expiryAt : null;
  const urgencyErr = urgencyAt ? errors.urgencyAt : null;

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center overflow-y-auto bg-black/50 p-5 backdrop-blur-sm">
      <div className="relative my-auto w-full max-w-[480px] rounded-[22px] bg-white p-6 shadow-[8px_10px_8px_-2px_rgba(0,0,0,0.35)]">
        <div className="mb-5 flex items-center justify-between">
          <h3 className={`${fraunces.className} m-0 text-lg font-extrabold uppercase tracking-tight text-stone-900`}>
            {editingProductId ? 'Edit Produk' : 'Tambah Produk Baru'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex rounded-full p-1.5 text-stone-500 transition-colors hover:bg-[#95F57C] hover:text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#16A34A]"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
          <div>
            <label className={labelClass}>Nama Produk</label>
            <input
              type="text"
              placeholder="Misal: Roti Donat Surplus / Baju Preloved"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={fieldClass}
            />
          </div>

          <div>
            <label className={labelClass}>Deskripsi Produk</label>
            <textarea
              rows="2"
              placeholder="Misal: Roti masih empuk, sisa panggangan sore ini."
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={fieldClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Kategori</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={fieldClass}
              >
                <option value="Makanan">Makanan</option>
                <option value="Barang">Barang</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Harga Normal (Rp)</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="15000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value.replace(/[^0-9]/g, '') })}
                className={fieldClass}
              />
            </div>
          </div>

          {/* Input Harga Diskon untuk fase Segera */}
          {isFood && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Harga Diskon Segera (Rp)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="8000"
                  value={formData.discountPrice || ''}
                  onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value.replace(/[^0-9]/g, '') })}
                  className={fieldClass}
                />
              </div>
              <div>
                <label className={labelClass}>Stok</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="5"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value.replace(/[^0-9]/g, '') })}
                  className={fieldClass}
                />
              </div>
            </div>
          )}

          {!isFood && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Urgensi</label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                  className={fieldClass}
                >
                  <option value="Normal">Normal</option>
                  <option value="Segera">Segera</option>
                  <option value="Mendesak">Mendesak</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Stok</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="5"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value.replace(/[^0-9]/g, '') })}
                  className={fieldClass}
                />
              </div>
            </div>
          )}

          {/* KHUSUS MAKANAN: batas kadaluarsa + batas urgensi */}
          {isFood && (
            <div className="flex flex-col gap-3.5 rounded-2xl border border-amber-200 bg-[#FFF7E9] p-3.5">
              <div>
                <label className={labelClass} htmlFor="pm-expiry">Batas Kadaluarsa</label>
                <input
                  id="pm-expiry"
                  type="datetime-local"
                  required
                  value={expiryAt}
                  onChange={(e) => setFormData({ ...formData, expiryAt: e.target.value })}
                  aria-invalid={expiryErr ? true : undefined}
                  className={fieldClass}
                />
                {expiryErr && <p className={errClass} role="alert">{expiryErr}</p>}
                <p className="mt-1 text-xs text-stone-600">
                  Produk yang sudah melewati batas ini otomatis di-takedown dari etalase pembeli.
                </p>
              </div>

              <div>
                <label className={labelClass} htmlFor="pm-urgency">Batas Urgensi Segera</label>
                <input
                  id="pm-urgency"
                  type="datetime-local"
                  required
                  value={urgencyAt}
                  onChange={(e) => setFormData({ ...formData, urgencyAt: e.target.value })}
                  aria-invalid={urgencyErr ? true : undefined}
                  className={fieldClass}
                />
                {urgencyErr && <p className={errClass} role="alert">{urgencyErr}</p>}
                <p className="mt-1 text-xs text-stone-600">
                  Saat batas ini tercapai, status jadi <b>Segera</b> (harga berubah ke diskon). Saat mendekati kadaluarsa, otomatis jadi <b>Mendesak (Gratis)</b>. Minimal {URGENCY_MIN_HOURS} jam sebelum kadaluarsa.
                </p>
              </div>
            </div>
          )}

<div>
  <label className={labelClass}>Titik Lokasi Toko</label>
  <div className="flex items-center gap-2">
    <button
      type="button"
      onClick={takeGps}
      className="rounded-xl border-2 border-stone-200 bg-white px-3 py-2 text-[13px] font-semibold text-stone-800 transition-colors hover:border-[#F23A10]"
    >
      📡 Ambil dari GPS
    </button>
    <span className="text-xs text-stone-600">
      {hasPoint
        ? `Tersimpan (${Number(profile.storeLat).toFixed(4)}, ${Number(profile.storeLng).toFixed(4)})`
        : 'Belum diatur'}
    </span>
  </div>
  {gpsMsg && <p className="mt-1 text-xs text-stone-600">{gpsMsg}</p>}
  <p className="mt-1 text-xs text-stone-600">
    Lakukan saat kamu berada di toko. Titik ini hanya terlihat olehmu. Pembeli hanya melihat area perkiraan.
  </p>
</div>

<div>
  <label className={labelClass}>Area Lokasi (Opsional)</label>
  <select
    value={AREAS.includes(formData.location) ? formData.location : OTHER}
    onChange={(e) => setFormData({ ...formData, location: e.target.value === OTHER ? '' : e.target.value })}
    className={fieldClass}
  >
    {AREAS.map((a) => (
      <option key={a} value={a}>{a}</option>
    ))}
    <option value={OTHER}>Lainnya (isi sendiri)</option>
  </select>
  {!AREAS.includes(formData.location) && (
    <input
      type="text"
      placeholder="Tulis nama area, misal: Tanjung Piayu"
      value={formData.location}
      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
      className={`${fieldClass} mt-2`}
    />
  )}
  <p className="mt-1 text-xs text-stone-600">Terisi otomatis setelah ambil GPS. Pembeli hanya melihat nama area ini.</p>
</div>

          <div>
            <label className={labelClass}>Gambar Produk (Opsional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const dataUrl = await compressImage(file);
                setFormData({ ...formData, image: dataUrl });
              }}
              className={fieldClass}
            />
            {formData.image && (
              <img src={formData.image} alt="Pratinjau" className="mt-2 h-24 w-24 rounded-xl object-cover" />
            )}
          </div>

          <button
            type="submit"
            className="mt-2.5 rounded-xl bg-[#F23A10] px-3 py-3 text-[13px] font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#95F57C] hover:text-stone-900 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16A34A]"
          >
            {editingProductId ? 'Simpan Perubahan' : 'Publikasi Produk'}
          </button>
        </form>
      </div>
    </div>
  );
}
