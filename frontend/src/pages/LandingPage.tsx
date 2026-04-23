import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';

const CATEGORIES = [
  { cat: 'dolor', imageUrl: '/images/dolor/aspirina-500mg-20tab.webp', label: 'Dolor' },
  { cat: 'gripe', imageUrl: '/images/gripe/panadol-multisintomas-48tab.webp', label: 'Gripe' },
  { cat: 'alergias', imageUrl: '/images/alergias/cetirizina-10mg-20tab.jpg', label: 'Alergias' },
  { cat: 'digestivo', imageUrl: '/images/digestivo/omeprazol-20mg-14cap.webp', label: 'Digestivo' },
];

const CATEGORY_IMAGE_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect width='100%25' height='100%25' fill='%23f1f5f9'/%3E%3C/svg%3E";

export function LandingPage() {
  return (
    <Layout>
      <section style={{ textAlign: 'center', padding: '4rem 0 3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#111827', marginBottom: '1rem', lineHeight: 1.2 }}>
          Medicamentos OTC<br />entregados en Panamá
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1.1rem', maxWidth: '440px', margin: '0 auto 2rem' }}>
          Sin receta. Sin complicaciones. Dolor, gripe, alergias y digestivo a tu puerta.
        </p>
        <Link to="/products">
          <button style={{
            background: '#0284c7',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            fontWeight: 600,
          }}>
            Ver catálogo →
          </button>
        </Link>
      </section>

      <section>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
        }}>
          {CATEGORIES.map(({ cat, imageUrl, label }) => (
            <Link key={cat} to={`/products?category=${cat}`}>
              <div style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                padding: '1rem',
                textAlign: 'center',
                transition: 'border-color 0.15s, box-shadow 0.15s',
              }}>
                <img
                  src={imageUrl}
                  alt={`Productos de ${label}`}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = CATEGORY_IMAGE_FALLBACK;
                  }}
                  style={{
                    width: '100%',
                    height: '140px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid #f1f5f9',
                  }}
                />
                <p style={{ marginTop: '0.75rem', fontWeight: 600, color: '#374151' }}>{label}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  );
}
