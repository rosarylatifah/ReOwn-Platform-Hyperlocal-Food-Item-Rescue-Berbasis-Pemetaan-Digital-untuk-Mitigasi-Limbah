// components/pembeli/BuyerMap.jsx
"use client";

import React, { useEffect, useState } from 'react';
import { Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useUserLocation } from '@/lib/locationStore';

const productIcon = typeof window !== 'undefined' ? new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
}) : null;

const userLocationIcon = typeof window !== 'undefined' ? new L.DivIcon({
  className: 'user-marker',
  html: `<div style="background-color: #2563EB; width: 16px; height: 16px; border-radius: 50%; border: 3px solid #FFF; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
}) : null;

// Kelompokkan produk yang berada di koordinat yang sama
const groupByLocation = (products = []) =>
  Object.values(
    products.reduce((acc, item) => {
      const lat = item.lat || 1.1186;
      const lng = item.lng || 104.0487;
      const key = `${lat},${lng}`;
      (acc[key] = acc[key] || { lat, lng, items: [] }).items.push(item);
      return acc;
    }, {})
  );

// Pindahkan tampilan peta saat lokasi berubah
function FlyTo({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

// Tangkap klik peta saat mode "pilih titik" aktif
function PickHandler({ active, onPick }) {
  useMapEvents({
    click(e) {
      if (active) onPick(e.latlng);
    },
  });
  return null;
}

const panelBtn =
  'w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-left text-[13px] font-semibold text-stone-800 transition-colors hover:border-[#D95A36] hover:bg-[#FBE9E2] hover:text-[#D95A36]';

export default function BuyerMap({ products = [], onSelectProduct }) {
  const { location, setLocation, resetLocation, requestGps } = useUserLocation();
  const [isMapHovered, setIsMapHovered] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [picking, setPicking] = useState(false);

  const handleGps = async () => {
    try {
      await requestGps();
      setPanelOpen(false);
    } catch {
      alert('Tidak bisa mengambil lokasi GPS. Pastikan izin lokasi browser aktif, atau pilih titik di peta.');
    }
  };

  const handlePick = ({ lat, lng }) => {
    setLocation({ lat, lng, label: 'Titik pilihan', source: 'custom' });
    setPicking(false);
    setPanelOpen(false);
  };

  return (
    <div style={{ padding: '0 40px', marginBottom: '30px' }}>
      <div
        onMouseEnter={() => setIsMapHovered(true)}
        onMouseLeave={() => setIsMapHovered(false)}
        style={{
          backgroundColor: '#FFF', borderRadius: '16px', overflow: 'hidden',
          border: isMapHovered ? '1.5px solid #D95A36' : '1px solid rgba(0,0,0,0.06)',
          boxShadow: isMapHovered ? '0 12px 28px rgba(217, 90, 54, 0.15)' : '0 4px 16px rgba(0,0,0,0.05)',
          transition: 'all 0.3s ease'
        }}
      >
        <div style={{ position: 'relative', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', gap: '12px', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', color: '#1A1A1A', margin: '0 0 4px 0' }}>
              Peta Lokasi Rescue Terdekat
            </h2>
            <p style={{ fontSize: '13px', color: '#666', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Navigation size={14} color="#D95A36" /> Titik lokasi kamu & barang rescue di sekitarmu
            </p>
          </div>

          <button
            type="button"
            onClick={() => setPanelOpen((v) => !v)}
            aria-expanded={panelOpen}
            style={{
              backgroundColor: panelOpen ? '#D95A36' : '#FAF0EC',
              color: panelOpen ? '#FFF' : '#D95A36',
              padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
              border: '1px solid #FFDBCC', cursor: 'pointer', transition: 'all 0.25s ease'
            }}
          >
            📍 Lokasi Saya ({location.label}) ▾
          </button>

          {panelOpen && (
            <div
              style={{
                position: 'absolute', right: '24px', top: 'calc(100% - 8px)', zIndex: 20,
                width: '260px', backgroundColor: '#FFF', borderRadius: '16px', padding: '12px',
                boxShadow: '0 16px 40px rgba(0,0,0,0.18)', border: '1px solid #eee',
                display: 'flex', flexDirection: 'column', gap: '8px'
              }}
            >
              <button type="button" onClick={handleGps} className={panelBtn}>📡 Gunakan lokasi GPS saya</button>
              <button
                type="button"
                onClick={() => { setPicking(true); setPanelOpen(false); }}
                className={panelBtn}
              >
                🖱️ Pilih titik di peta
              </button>
              <button
                type="button"
                onClick={() => { resetLocation(); setPanelOpen(false); }}
                className={panelBtn}
              >
                ↩︎ Reset ke Batam Centre
              </button>
              <p style={{ margin: 0, fontSize: '11px', color: '#777', lineHeight: 1.4 }}>
                Kamu juga bisa menggeser penanda biru di peta.
              </p>
            </div>
          )}
        </div>

        <div style={{ position: 'relative', width: '100%', height: '350px', zIndex: 1 }}>
          {picking && (
            <div
              style={{
                position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000,
                backgroundColor: '#1A1A1A', color: '#FFF', borderRadius: '20px', padding: '8px 16px',
                fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px'
              }}
            >
              Klik di peta untuk memilih lokasi
              <button
                type="button"
                onClick={() => setPicking(false)}
                style={{ background: 'none', border: 'none', color: '#95F57C', cursor: 'pointer', fontWeight: 700 }}
              >
                Batal
              </button>
            </div>
          )}

          <MapContainer center={[location.lat, location.lng]} zoom={14} scrollWheelZoom={false} style={{ width: '100%', height: '100%' }}>
            <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <FlyTo lat={location.lat} lng={location.lng} />
            <PickHandler active={picking} onPick={handlePick} />

            {userLocationIcon && (
              <Marker
                position={[location.lat, location.lng]}
                icon={userLocationIcon}
                draggable
                eventHandlers={{
                  dragend(e) {
                    const { lat, lng } = e.target.getLatLng();
                    setLocation({ lat, lng, label: 'Titik pilihan', source: 'custom' });
                  },
                }}
              >
                <Popup>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 'bold', color: '#2563EB' }}>
                    📍 Lokasi Kamu ({location.label})
                  </div>
                </Popup>
              </Marker>
            )}

            {productIcon &&
              groupByLocation(products).map((group) => (
                <Marker key={`${group.lat},${group.lng}`} position={[group.lat, group.lng]} icon={productIcon}>
                  <Popup>
                    <div style={{ fontFamily: 'Inter, sans-serif', maxHeight: '180px', overflowY: 'auto', minWidth: '180px' }}>
                      {group.items.map((item) => (
                        <div key={item.id} style={{ padding: '6px 0', borderBottom: '1px solid #eee' }}>
                          <b style={{ color: '#D95A36' }}>{item.name}</b><br />
                          <span style={{ fontSize: '12px' }}>{item.sellerName || item.store}</span><br />
                          <span style={{ fontWeight: 'bold' }}>{item.price}</span>
                          <button
                            type="button"
                            onClick={() => onSelectProduct && onSelectProduct(item)}
                            style={{
                              display: 'block', marginTop: '6px', width: '100%', padding: '6px 10px',
                              borderRadius: '10px', border: 'none', backgroundColor: '#D85834',
                              color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer'
                            }}
                          >
                            Lihat Detail
                          </button>
                        </div>
                      ))}
                    </div>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}