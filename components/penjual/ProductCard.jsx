"use client";

import React from 'react';
import { MapPin, Edit2, Trash2 } from 'lucide-react';

export default function ProductCard({ item, isHovered, onHover, onLeave, onEdit, onDelete }) {
  return (
    <div 
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{ 
        backgroundColor: '#FFF', 
        borderRadius: '20px', 
        overflow: 'hidden', 
        border: isHovered ? '1.5px solid #D95A36' : '1px solid rgba(0,0,0,0.06)',
        boxShadow: isHovered ? '0 15px 35px rgba(217, 90, 54, 0.15)' : '0 6px 18px rgba(0,0,0,0.05)',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '180px', backgroundColor: '#F9F9F9', overflow: 'hidden' }}>
        <img 
          src={item.image} 
          alt={item.name} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.3s ease'
          }} 
        />
        <span style={{ 
          position: 'absolute', 
          top: '12px', 
          left: '12px', 
          backgroundColor: 'rgba(255,255,255,0.9)', 
          color: '#1A1A1A', 
          padding: '5px 12px', 
          borderRadius: '15px', 
          fontSize: '11px', 
          fontWeight: 'bold',
          textTransform: 'capitalize',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
        }}>
          {item.category}
        </span>
      </div>

      <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <h4 style={{ 
              margin: 0, 
              fontSize: '16px', 
              color: isHovered ? '#D95A36' : '#1A1A1A', 
              fontWeight: '700',
              lineHeight: '1.3',
              maxWidth: '75%',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {item.name}
            </h4>
            
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button 
                onClick={() => onEdit(item)}
                title="Edit Produk"
                style={{ background: 'none', border: '1px solid #E5E5E5', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex' }}
              >
                <Edit2 size={14} color="#444" />
              </button>
              <button 
                onClick={() => onDelete(item.id, item.name)}
                title="Hapus Produk"
                style={{ background: 'none', border: '1px solid #E5E5E5', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex' }}
              >
                <Trash2 size={14} color="#D93025" />
              </button>
            </div>
          </div>
          
          <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: '#666', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={13} color="#D95A36" /> {item.location}
          </p>
        </div>

        <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '10px', color: '#888', display: 'block' }}>Harga</span>
            <span style={{ fontWeight: 'bold', fontSize: '15px', color: '#D95A36' }}>{item.price}</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '10px', color: '#888', display: 'block' }}>Status</span>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#2E7D32' }}>
              {item.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}