"use client";

import React, { useState, useRef } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { fraunces } from "@/lib/fonts";

// Fungsi bantuan buat ngatur kotak crop awal (bikin bentuk kotak/lingkaran 1:1)
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function ImageCropperModal({ imageSrc, onCancel, onCropComplete }) {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);

  function onImageLoad(e) {
    const { width, height } = e.currentTarget;
    // Set aspek rasio 1:1 (kotak/persegi buat foto profil)
    setCrop(centerAspectCrop(width, height, 1));
  }

  // Fungsi buat mengubah area yang di-crop jadi file gambar baru (Base64)
  const handleSaveCroppedImage = () => {
    if (!completedCrop || !imgRef.current) return;

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Ubah hasil canvas jadi string Base64 biar bisa langsung masuk ke state avatar
    const base64Image = canvas.toDataURL('image/jpeg');
    onCropComplete(base64Image);
  };

  return (
    <div className="fixed inset-0 z-[1200] grid place-items-center bg-stone-900/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-2xl">
        <h3 className={`${fraunces.className} text-lg font-extrabold text-stone-900 mb-2`}>
          Sesuaikan Foto Profil
        </h3>
        <p className="text-xs text-stone-500 mb-4">
          Geser atau ubah ukuran kotak untuk memotong foto sesuai keinginanmu.
        </p>

        {/* Area Crop Gambar */}
        <div className="max-h-[60vh] overflow-auto flex justify-center bg-stone-100 rounded-xl p-2">
          {imageSrc && (
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1} // Rasio 1:1 (Kotak untuk profil)
              circularCrop // Biar bentuk preview-nya bulat
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imageSrc}
                onLoad={onImageLoad}
                style={{ maxHeight: '50vh' }}
              />
            </ReactCrop>
          )}
        </div>

        {/* Tombol Aksi */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border-[1.5px] border-stone-300 py-2.5 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-100"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSaveCroppedImage}
            className="rounded-full bg-stone-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#D85834]"
          >
            Potong & Simpan
          </button>
        </div>
      </div>
    </div>
  );
}