import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ProductCard } from '../components/ProductCard';
import { getMedications } from '../services/medications';
import type { Medication, Category } from '../types';

const ITEMS_PER_PAGE = 8;

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
  const pageParam = Number(searchParams.get('page') ?? 1);
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

  const totalPages = Math.ceil(medications.length / ITEMS_PER_PAGE);
  const currentPage = Math.min(Math.max(pageParam, 1), totalPages || 1);
  const paginated = medications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  function goToPage(page: number) {
    const params: Record<string, string> = {};
    if (categoryParam) params.category = categoryParam;
    if (page > 1) params.page = String(page);
    setSearchParams(params);
  }

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
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1.25rem',
          }}>
            {paginated.map((m) => <ProductCard key={m.id} medication={m} />)}
            {medications.length === 0 && (
              <p style={{ color: '#6b7280', gridColumn: '1 / -1' }}>
                No hay medicamentos en esta categoría.
              </p>
            )}
          </div>

          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '2rem',
              flexWrap: 'wrap',
            }}>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: '0.4rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  background: currentPage === 1 ? '#f3f4f6' : '#fff',
                  color: currentPage === 1 ? '#9ca3af' : '#374151',
                  fontWeight: 500,
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                }}
              >
                Anterior
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: currentPage === page ? '#0284c7' : '#e5e7eb',
                    background: currentPage === page ? '#0284c7' : '#fff',
                    color: currentPage === page ? '#fff' : '#374151',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                  }}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: '0.4rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  background: currentPage === totalPages ? '#f3f4f6' : '#fff',
                  color: currentPage === totalPages ? '#9ca3af' : '#374151',
                  fontWeight: 500,
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                }}
              >
                Siguiente
              </button>
            </div>
          )}

          {totalPages > 1 && (
            <p style={{ textAlign: 'center', marginTop: '0.75rem', color: '#6b7280', fontSize: '0.875rem' }}>
              Página {currentPage} de {totalPages} · {medications.length} productos
            </p>
          )}
        </>
      )}
    </Layout>
  );
}