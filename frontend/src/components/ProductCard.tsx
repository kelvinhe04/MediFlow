import { Link } from 'react-router-dom';
import type { Medication } from '../types';
import { useCartStore } from '../store/cartStore';

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function ProductCard({ medication }: { medication: Medication }) {
  const addItem = useCartStore((s) => s.addItem);

  function handleAdd() {
    addItem({
      medicationId: medication.id,
      name: medication.name,
      priceCents: medication.priceCents,
      quantity: 1,
      imageUrl: medication.imageUrl,
    });
  }

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '12px',
        border: '1.5px solid #dde3ea',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 2px 6px rgba(0,0,0,0.07), 0 6px 20px rgba(0,0,0,0.07)',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 6px 14px rgba(0,0,0,0.09), 0 16px 32px rgba(2,132,199,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.07), 0 6px 20px rgba(0,0,0,0.07)';
      }}
    >
      <Link to={`/products/${medication.id}`}>
        <div style={{ height: '180px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <img
            src={medication.imageUrl || medication.name}
            alt={medication.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
      </Link>

      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
        <Link to={`/products/${medication.id}`}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#111827', lineHeight: 1.35 }}>{medication.name}</h3>
        </Link>
        <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>{medication.dose}</p>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 'auto',
          paddingTop: '0.75rem',
        }}>
          <span style={{ fontWeight: 700, color: '#0284c7', fontSize: '1.05rem' }}>
            {formatPrice(medication.priceCents)}
          </span>
          <button
            onClick={handleAdd}
            disabled={medication.stock === 0}
            style={{
              background: medication.stock === 0 ? '#f1f5f9' : '#0284c7',
              color: medication.stock === 0 ? '#9ca3af' : '#fff',
              border: 'none',
              borderRadius: '7px',
              padding: '0.4rem 0.875rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: medication.stock === 0 ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s, transform 0.1s',
            }}
            onMouseEnter={(e) => {
              if (medication.stock > 0) e.currentTarget.style.background = '#0369a1';
            }}
            onMouseLeave={(e) => {
              if (medication.stock > 0) e.currentTarget.style.background = '#0284c7';
            }}
          >
            {medication.stock === 0 ? 'Sin stock' : '+ Agregar'}
          </button>
        </div>
      </div>
    </div>
  );
}
