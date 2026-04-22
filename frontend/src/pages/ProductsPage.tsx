import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ProductCard } from '../components/ProductCard';
import { getMedications } from '../services/medications';
import type { Medication, Category } from '../types';

const CATEGORIES: { value: Category | ''; label: string }[] = [
  { value: '', label: 'Todos' },
  { value: 'dolor', label: 'Dolor' },
  { value: 'gripe', label: 'Gripe' },
  { value: 'alergias', label: 'Alergias' },
  { value: 'digestivo', label: 'Digestivo' },
];

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = (searchParams.get('category') ?? '') as Category | '';
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getMedications(categoryParam || undefined)
      .then(setMedications)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [categoryParam]);

  return (
    <Layout>
      <h2 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: '1.5rem' }}>Catálogo</h2>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {CATEGORIES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setSearchParams(value ? { category: value } : {})}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '20px',
              border: '1px solid #e5e7eb',
              background: categoryParam === value ? '#0284c7' : '#fff',
              color: categoryParam === value ? '#fff' : '#374151',
              fontWeight: 500,
              fontSize: '0.875rem',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && <p style={{ color: '#6b7280' }}>Cargando...</p>}
      {error && <p style={{ color: '#dc2626' }}>Error: {error}</p>}

      {!loading && !error && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1.25rem',
        }}>
          {medications.map((m) => <ProductCard key={m.id} medication={m} />)}
          {medications.length === 0 && (
            <p style={{ color: '#6b7280', gridColumn: '1 / -1' }}>
              No hay medicamentos en esta categoría.
            </p>
          )}
        </div>
      )}
    </Layout>
  );
}
