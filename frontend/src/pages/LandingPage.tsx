import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { ProductCard } from '../components/ProductCard';
import { getMedications } from '../services/medications';
import type { Medication } from '../types';

const CATEGORIES = [
  { cat: 'dolor', imageUrl: '/images/dolor/aspirina-500mg-20tab.webp', label: 'Dolor', description: 'Ibuprofeno, Aspirina, Paracetamol' },
  { cat: 'gripe', imageUrl: '/images/gripe/panadol-multisintomas-48tab.webp', label: 'Gripe & Resfriado', description: 'Panadol, DayQuil, NyQuil' },
  { cat: 'alergias', imageUrl: '/images/alergias/cetirizina-10mg-20tab.jpg', label: 'Alergias', description: 'Cetirizina, Loratadina' },
  { cat: 'digestivo', imageUrl: '/images/digestivo/omeprazol-20mg-14cap.webp', label: 'Digestivo', description: 'Omeprazol, Pepto-Bismol' },
];

const IMAGE_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect width='100%25' height='100%25' fill='%23f1f5f9'/%3E%3C/svg%3E";

const TRUST_ITEMS = [
  {
    label: 'Envío gratis',
    detail: 'En órdenes sobre $50',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
  {
    label: 'Pago seguro',
    detail: 'Stripe · 3D Secure',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    label: 'Productos verificados',
    detail: 'Por farmacéuticos certificados',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
  },
];

export function LandingPage() {
  const [featured, setFeatured] = useState<Medication[]>([]);

  useEffect(() => {
    getMedications().then((meds) => setFeatured(meds.slice(0, 4)));
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 45%, #f8fafc 100%)',
        borderRadius: '16px',
        padding: 'clamp(2.5rem, 6vw, 4.5rem) 2rem',
        textAlign: 'center',
        marginBottom: '2.5rem',
        boxShadow: '0 2px 8px rgba(2,132,199,0.06), 0 8px 32px rgba(2,132,199,0.07)',
      }}>
        <p style={{
          color: '#0284c7',
          fontWeight: 600,
          fontSize: '0.8rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '1rem',
        }}>
          Farmacia digital · Panamá
        </p>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 800,
          color: '#0f172a',
          lineHeight: 1.15,
          marginBottom: '1.25rem',
          letterSpacing: '-0.02em',
        }}>
          Medicamentos OTC<br />
          <span style={{ color: '#0284c7' }}>entregados a tu puerta</span>
        </h1>
        <p style={{
          color: '#64748b',
          fontSize: '1.05rem',
          maxWidth: '460px',
          margin: '0 auto 2rem',
          lineHeight: 1.75,
        }}>
          Sin receta. Sin complicaciones. Dolor, gripe, alergias y digestivo desde $3.99.
        </p>
        <Link to="/products">
          <button
            style={{
              background: '#0284c7',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '0.875rem 2.25rem',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(2, 132, 199, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(2, 132, 199, 0.3)';
            }}
          >
            Comprar medicamentos →
          </button>
        </Link>
      </section>

      {/* Trust strip */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '3rem',
      }}>
        {TRUST_ITEMS.map((item) => (
          <div
            key={item.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.875rem',
              background: '#fff',
              border: '1.5px solid #dde3ea',
              borderRadius: '12px',
              padding: '1.125rem 1.25rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.07), 0 6px 18px rgba(0,0,0,0.06)',
            }}
          >
            <span style={{ color: '#0284c7', flexShrink: 0 }}>{item.icon}</span>
            <div>
              <p style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem', lineHeight: 1.3 }}>{item.label}</p>
              <p style={{ color: '#64748b', fontSize: '0.775rem', marginTop: '0.15rem' }}>{item.detail}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>Categorías</h2>
          <Link to="/products" style={{ fontSize: '0.875rem', color: '#0284c7', fontWeight: 500 }}>
            Ver todo →
          </Link>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '1rem',
        }}>
          {CATEGORIES.map(({ cat, imageUrl, label, description }) => (
            <Link key={cat} to={`/products?category=${cat}`}>
              <div
                style={{
                  background: '#fff',
                  border: '1.5px solid #dde3ea',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  textAlign: 'center',
                  transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.07), 0 6px 20px rgba(0,0,0,0.06)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#93c5fd';
                  e.currentTarget.style.boxShadow = '0 6px 14px rgba(0,0,0,0.09), 0 16px 32px rgba(2,132,199,0.12)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#dde3ea';
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.07), 0 6px 20px rgba(0,0,0,0.06)';
                  e.currentTarget.style.transform = '';
                }}
              >
                <div style={{ height: '120px', background: '#f8fafc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.75rem', marginBottom: '0.875rem' }}>
                  <img
                    src={imageUrl}
                    alt={`Productos de ${label}`}
                    loading="lazy"
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = IMAGE_FALLBACK; }}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
                <p style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem', marginBottom: '0.2rem' }}>{label}</p>
                <p style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Más vendidos */}
      {featured.length > 0 && (
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>Más vendidos</h2>
            <Link to="/products" style={{ fontSize: '0.875rem', color: '#0284c7', fontWeight: 500 }}>
              Ver catálogo →
            </Link>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1.25rem',
          }}>
            {featured.map((m) => <ProductCard key={m.id} medication={m} />)}
          </div>
        </section>
      )}
    </Layout>
  );
}
