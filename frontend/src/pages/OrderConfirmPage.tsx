import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Layout } from '../components/Layout';
import { getOrder } from '../services/orders';
import type { Order } from '../types';

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function OrderConfirmPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const success = searchParams.get('success') === 'true';
  const cancelled = searchParams.get('cancelled') === 'true';
  const { getToken } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getToken()
      .then((token) => (token ? getOrder(id, token) : null))
      .then((o) => { if (o) setOrder(o); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <Layout><p style={{ color: '#6b7280', padding: '2rem 0' }}>Cargando orden...</p></Layout>;
  }

  return (
    <Layout>
      <div style={{ maxWidth: '520px', margin: '0 auto', textAlign: 'center', padding: '3rem 0' }}>
        {cancelled ? (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
            <h2 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: '0.5rem' }}>Pago cancelado</h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>No se realizó ningún cargo.</p>
            <Link to="/cart">
              <button style={{
                background: '#0284c7', color: '#fff', border: 'none',
                borderRadius: '8px', padding: '0.75rem 1.5rem', fontWeight: 600,
              }}>
                Volver al carrito
              </button>
            </Link>
          </>
        ) : success ? (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: '0.5rem' }}>¡Pago recibido!</h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Tu pedido está siendo procesado.</p>
          </>
        ) : (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🕐</div>
            <h2 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: '0.5rem' }}>Orden pendiente</h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Verificando el estado del pago...</p>
          </>
        )}

        {order && (
          <div style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '10px',
            padding: '1.5rem',
            textAlign: 'left',
            marginTop: '1.5rem',
          }}>
            <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '1rem' }}>
              Orden #{order.id}
            </p>
            {order.items.map((item) => (
              <div key={item.medicationId} style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
              }}>
                <span>{item.name} <span style={{ color: '#9ca3af' }}>x{item.quantity}</span></span>
                <span>{formatPrice(item.lineTotalCents)}</span>
              </div>
            ))}
            <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '0.75rem 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
              <span>ITBMS (7%)</span>
              <span>{formatPrice(order.taxCents)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.05rem' }}>
              <span>Total</span>
              <span style={{ color: '#0284c7' }}>{formatPrice(order.totalCents)}</span>
            </div>
          </div>
        )}

        <Link to="/products" style={{ display: 'inline-block', marginTop: '1.5rem' }}>
          <button style={{
            background: 'none',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '0.6rem 1.25rem',
            color: '#374151',
            fontWeight: 500,
          }}>
            Seguir comprando
          </button>
        </Link>
      </div>
    </Layout>
  );
}
