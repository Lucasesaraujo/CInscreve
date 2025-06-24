import React from 'react';

const CardLupa = () => (
  <div style={{
    background: '#f5f5f5',
    borderRadius: '12px',
    padding: '32px 24px',
    width: '200px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
  }}>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '48px', marginBottom: '16px', height: '56px' }}>
      <svg width="48" height="48" fill="none" stroke="#222" strokeWidth="3" viewBox="0 0 48 48">
        <circle cx="21" cy="21" r="12" />
        <line x1="32" y1="32" x2="44" y2="44" />
      </svg>
    </div>
    <h3 style={{ margin: '0 0 8px 0', fontWeight: 500 }}>Busque</h3>
    <p style={{ margin: 0, color: '#444', fontSize: '14px' }}>
      Encontre editais para transformar sua organização.
    </p>
  </div>
);

export default CardLupa;