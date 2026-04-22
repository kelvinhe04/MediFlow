import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';

const CATEGORIES = [
  { cat: 'dolor', emoji: '💊', label: 'Dolor' },
  { cat: 'gripe', emoji: '🤧', label: 'Gripe' },
  { cat: 'alergias', emoji: '🌿', label: 'Alergias' },
  { cat: 'digestivo', emoji: '🫃', label: 'Digestivo' },
];

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
          {CATEGORIES.map(({ cat, emoji, label }) => (
            <Link key={cat} to={`/products?category=${cat}`}>
              <div style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                padding: '2rem 1rem',
                textAlign: 'center',
                transition: 'border-color 0.15s',
              }}>
                <div style={{ fontSize: '2.5rem' }}>{emoji}</div>
                <p style={{ marginTop: '0.75rem', fontWeight: 600, color: '#374151' }}>{label}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  );
}
