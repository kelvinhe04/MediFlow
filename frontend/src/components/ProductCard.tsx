import { Link } from 'react-router-dom';
import type { Medication } from '../types';
import { useCartStore } from '../store/cartStore';
import { handleImageFallback, withImagePlaceholder } from '../shared/imageFallback';

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
    <div style={{
      background: '#fff',
      borderRadius: '10px',
      border: '1px solid #e5e7eb',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Link to={`/products/${medication.id}`}>
        <img
          src={withImagePlaceholder(medication.imageUrl)}
          alt={medication.name}
          onError={handleImageFallback}
          style={{ width: '100%', height: '180px', objectFit: 'cover' }}
        />
      </Link>

      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
        <Link to={`/products/${medication.id}`}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#111827' }}>{medication.name}</h3>
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
              background: medication.stock === 0 ? '#e5e7eb' : '#0284c7',
              color: medication.stock === 0 ? '#9ca3af' : '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '0.35rem 0.75rem',
              fontSize: '0.85rem',
              fontWeight: 500,
            }}
          >
            {medication.stock === 0 ? 'Sin stock' : '+ Agregar'}
          </button>
        </div>
      </div>
    </div>
  );
}
