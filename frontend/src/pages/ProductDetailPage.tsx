import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { getMedicationById } from '../services/medications';
import { useCartStore } from '../store/cartStore';
import type { Medication } from '../types';

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [medication, setMedication] = useState<Medication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (!id) return;
    getMedicationById(id)
      .then(setMedication)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  function handleAdd() {
    if (!medication) return;
    addItem({
      medicationId: medication.id,
      name: medication.name,
      priceCents: medication.priceCents,
      quantity,
      imageUrl: medication.imageUrl,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (loading) return <Layout><p style={{ color: '#6b7280', padding: '2rem 0' }}>Cargando...</p></Layout>;
  if (error || !medication) return <Layout><p style={{ color: '#dc2626', padding: '2rem 0' }}>Medicamento no encontrado.</p></Layout>;

  return (
    <Layout>
      <button
        onClick={() => navigate(-1)}
        style={{ background: 'none', border: 'none', color: '#6b7280', marginBottom: '1.5rem', padding: 0, fontSize: '0.9rem' }}
      >
        ← Volver
      </button>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.5fr)',
        gap: '2.5rem',
        alignItems: 'start',
      }}>
        <img
          src={medication.imageUrl || medication.name}
          alt={medication.name}
          style={{ width: '100%', borderRadius: '12px', border: '1px solid #e5e7eb' }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{medication.name}</h1>

          <dl style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', color: '#6b7280', fontSize: '0.95rem' }}>
              <dt>Ingrediente activo:</dt>
              <dd style={{ fontWeight: 500, color: '#374151' }}>{medication.activeIngredient}</dd>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', color: '#6b7280', fontSize: '0.95rem' }}>
              <dt>Dosis:</dt>
              <dd style={{ fontWeight: 500, color: '#374151' }}>{medication.dose}</dd>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', color: '#6b7280', fontSize: '0.95rem' }}>
              <dt>Categoría:</dt>
              <dd style={{ fontWeight: 500, color: '#374151', textTransform: 'capitalize' }}>{medication.category}</dd>
            </div>
          </dl>

          <p style={{ color: medication.stock > 0 ? '#16a34a' : '#dc2626', fontWeight: 500, fontSize: '0.9rem' }}>
            {medication.stock > 0 ? `${medication.stock} unidades disponibles` : 'Sin stock'}
          </p>

          <p style={{ fontSize: '2rem', fontWeight: 700, color: '#0284c7' }}>
            {formatPrice(medication.priceCents)}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              style={{ width: '32px', height: '32px', border: '1px solid #e5e7eb', borderRadius: '6px', background: '#fff', fontSize: '1.1rem' }}
            >
              −
            </button>
            <span style={{ fontWeight: 600, minWidth: '24px', textAlign: 'center' }}>{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(medication.stock, q + 1))}
              style={{ width: '32px', height: '32px', border: '1px solid #e5e7eb', borderRadius: '6px', background: '#fff', fontSize: '1.1rem' }}
            >
              +
            </button>
          </div>

          <button
            onClick={handleAdd}
            disabled={medication.stock === 0}
            style={{
              background: added ? '#16a34a' : medication.stock === 0 ? '#e5e7eb' : '#0284c7',
              color: medication.stock === 0 ? '#9ca3af' : '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 1.5rem',
              fontWeight: 600,
              fontSize: '1rem',
              transition: 'background 0.2s',
              alignSelf: 'flex-start',
            }}
          >
            {added ? '✓ Agregado al carrito' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </Layout>
  );
}
