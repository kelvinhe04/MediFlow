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
  const searchQuery = searchParams.get('q') ?? '';
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

  const filtered = searchQuery
    ? medications.filter((m) => {
        const q = searchQuery.toLowerCase();
        return m.name.toLowerCase().includes(q) || m.brand.toLowerCase().includes(q) || m.activeIngredient.toLowerCase().includes(q);
      })
    : medications;

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentPage = Math.min(Math.max(pageParam, 1), totalPages || 1);
  const paginated = filtered.slice(
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
      <h2 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: '0.25rem' }}>
        {searchQuery ? `Resultados para "${searchQuery}"` : 'Catálogo'}
      </h2>
      {searchQuery && (
        <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          {filtered.length} producto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
        </p>
      )}
      {!searchQuery && <div style={{ marginBottom: '1.5rem' }} />}

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {CATEGORIES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setSearchParams(value ? { category: value } : {})}
            style={{
              padding: '0.4rem 1.1rem',
              borderRadius: '20px',
              border: categoryParam === value ? '1.5px solid #0284c7' : '1.5px solid #cbd5e1',
              background: categoryParam === value ? '#0284c7' : '#fff',
              color: categoryParam === value ? '#fff' : '#374151',
              fontWeight: 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              boxShadow: categoryParam === value
                ? '0 2px 8px rgba(2,132,199,0.25)'
                : '0 1px 3px rgba(0,0,0,0.07), 0 2px 6px rgba(0,0,0,0.05)',
              transition: 'border-color 0.15s, background 0.15s, box-shadow 0.15s',
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
            {filtered.length === 0 && (
              <p style={{ color: '#6b7280', gridColumn: '1 / -1' }}>
                {searchQuery
                  ? `No se encontraron medicamentos para "${searchQuery}".`
                  : 'No hay medicamentos en esta categoría.'}
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
                  padding: '0.4rem 0.875rem',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  background: currentPage === 1 ? '#f8fafc' : '#fff',
                  color: currentPage === 1 ? '#94a3b8' : '#374151',
                  fontWeight: 500,
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  boxShadow: currentPage === 1 ? 'none' : '0 1px 3px rgba(0,0,0,0.07), 0 2px 6px rgba(0,0,0,0.05)',
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
                    borderRadius: '8px',
                    border: '1.5px solid',
                    borderColor: currentPage === page ? '#0284c7' : '#cbd5e1',
                    background: currentPage === page ? '#0284c7' : '#fff',
                    color: currentPage === page ? '#fff' : '#374151',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    boxShadow: currentPage === page
                      ? '0 2px 8px rgba(2,132,199,0.28)'
                      : '0 1px 3px rgba(0,0,0,0.07), 0 2px 6px rgba(0,0,0,0.05)',
                  }}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: '0.4rem 0.875rem',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  background: currentPage === totalPages ? '#f8fafc' : '#fff',
                  color: currentPage === totalPages ? '#94a3b8' : '#374151',
                  fontWeight: 500,
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  boxShadow: currentPage === totalPages ? 'none' : '0 1px 3px rgba(0,0,0,0.07), 0 2px 6px rgba(0,0,0,0.05)',
                }}
              >
                Siguiente
              </button>
            </div>
          )}

          {totalPages > 1 && (
            <p style={{ textAlign: 'center', marginTop: '0.75rem', color: '#6b7280', fontSize: '0.875rem' }}>
              Página {currentPage} de {totalPages} · {filtered.length} productos
            </p>
          )}
        </>
      )}
    </Layout>
  );
}