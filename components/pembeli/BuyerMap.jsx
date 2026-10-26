// components/pembeli/BuyerMap.jsx
"use client";

import React, { useState } from 'react';
import { Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

const batamCenterPos = [1.1186, 104.0487];

export default function BuyerMap({ products }) {
  const [isMapHovered, setIsMapHovered] = useState(false);
  const [isBadgeHovered, setIsBadgeHovered] = useState(false);

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
        <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
          <div>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', color: '#1A1A1A', margin: '0 0 4px 0' }}>
              Peta Lokasi Rescue Terdekat
            </h2>
            <p style={{ fontSize: '13px', color: '#666', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Navigation size={14} color="#D95A36" /> Titik lokasi kamu & barang rescue di sekitar Batam Centre
            </p>
          </div>
          
          <span 
            onMouseEnter={() => setIsBadgeHovered(true)}
            onMouseLeave={() => setIsBadgeHovered(false)}
            style={{ 
              backgroundColor: isBadgeHovered ? '#D95A36' : '#FAF0EC', 
              color: isBadgeHovered ? '#FFF' : '#D95A36', 
              padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', 
              border: '1px solid #FFDBCC', cursor: 'pointer', transition: 'all 0.25s ease'
            }}
          >
            📍 Lokasi Saya (Batam Centre)
          </span>
        </div>

        <div style={{ position: 'relative', width: '100%', height: '350px', zIndex: 1 }}>
          <MapContainer center={batamCenterPos} zoom={14} scrollWheelZoom={false} style={{ width: '100%', height: '100%' }}>
            <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            {userLocationIcon && (
              <Marker position={batamCenterPos} icon={userLocationIcon}>
                <Popup>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 'bold', color: '#2563EB' }}>
                    📍 Lokasi Kamu Sekarang
                  </div>
                </Popup>
              </Marker>
            )}

            {products.map((item) => (
              productIcon && (
                <Marker key={item.id} position={[item.lat || 1.1186, item.lng || 104.0487]} icon={productIcon}>
                  <Popup>
                    <div style={{ fontFamily: 'Inter, sans-serif' }}>
                      <b style={{ color: '#D95A36' }}>{item.name}</b><br />
                      {item.sellerName || item.store}<br />
                      <span style={{ fontWeight: 'bold' }}>{item.price}</span>
                    </div>
                  </Popup>
                </Marker>
              )
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}