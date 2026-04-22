import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useClerk } from '@clerk/clerk-react';
import { Layout } from '../components/Layout';
import { useCartStore } from '../store/cartStore';
import { createOrder } from '../services/orders';
import { createCheckoutSession } from '../services/checkout';

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function CheckoutPage() {
  const { isSignedIn, getToken } = useAuth();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);
  const tax = Math.round(subtotal * 0.07);
  const total = subtotal + tax;

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  async function handleCheckout() {
    if (!isSignedIn) {
      openSignIn();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = await getToken();
      if (!token) throw new Error('No se pudo obtener la sesión.');

      const order = await createOrder(
        items.map((i) => ({ medicationId: i.medicationId, quantity: i.quantity })),
        token
      );

      const session = await createCheckoutSession(order.orderId, token);
      clearCart();
      window.location.href = session.url;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error inesperado. Intenta de nuevo.');
      setLoading(false);
    }
  }

  return (
    <Layout>
      <h2 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: '1.5rem' }}>Confirmar pedido</h2>

      {!isSignedIn && (
        <div style={{
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '8px',
          padding: '0.875rem 1.25rem',
          marginBottom: '1.5rem',
          color: '#1d4ed8',
          fontSize: '0.9rem',
        }}>
          Necesitás iniciar sesión para completar el pago.
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 300px',
        gap: '2rem',
        alignItems: 'start',
      }}>
        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '10px',
          padding: '1.5rem',
        }}>
          <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Tu pedido</h3>
          {items.map((item) => (
            <div key={item.medicationId} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: '0.75rem',
              marginBottom: '0.75rem',
              borderBottom: '1px solid #f3f4f6',
            }}>
              <div>
                <p style={{ fontWeight: 500 }}>{item.name}</p>
                <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                  x{item.quantity} × {formatPrice(item.priceCents)}
                </p>
              </div>
              <span style={{ fontWeight: 600 }}>{formatPrice(item.priceCents * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '10px',
          padding: '1.5rem',
          position: 'sticky',
          top: '80px',
        }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Total</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280', fontSize: '0.9rem' }}>
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280', fontSize: '0.9rem' }}>
              <span>ITBMS (7%)</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '0.5rem 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem' }}>
              <span>Total</span>
              <span style={{ color: '#0284c7' }}>{formatPrice(total)}</span>
            </div>
          </div>

          {error && (
            <p style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{error}</p>
          )}

          <button
            onClick={handleCheckout}
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#93c5fd' : '#0284c7',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem',
              fontWeight: 600,
              fontSize: '1rem',
            }}
          >
            {loading
              ? 'Procesando...'
              : isSignedIn
              ? 'Pagar con Stripe →'
              : 'Iniciar sesión para pagar'}
          </button>
        </div>
      </div>
    </Layout>
  );
}
