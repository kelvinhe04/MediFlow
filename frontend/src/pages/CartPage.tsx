import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useCartStore } from '../store/cartStore';

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const navigate = useNavigate();

  const subtotal = items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);
  const tax = Math.round(subtotal * 0.07);
  const total = subtotal + tax;

  if (items.length === 0) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>🛒</p>
          <p style={{ color: '#6b7280', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            Tu carrito está vacío.
          </p>
          <Link to="/products">
            <button style={{
              background: '#0284c7',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 1.5rem',
              fontWeight: 600,
            }}>
              Ver catálogo
            </button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h2 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: '1.5rem' }}>Carrito</h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 300px',
        gap: '2rem',
        alignItems: 'start',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {items.map((item) => (
            <div key={item.medicationId} style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr auto',
              gap: '1rem',
              alignItems: 'center',
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '10px',
              padding: '1rem',
            }}>
              <img
                src={item.imageUrl}
                alt={item.name}
                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px' }}
              />

              <div>
                <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{item.name}</p>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  {formatPrice(item.priceCents)} / unidad
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    onClick={() => updateQuantity(item.medicationId, item.quantity - 1)}
                    style={{ width: '28px', height: '28px', border: '1px solid #e5e7eb', borderRadius: '4px', background: '#fff' }}
                  >
                    −
                  </button>
                  <span style={{ fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.medicationId, item.quantity + 1)}
                    style={{ width: '28px', height: '28px', border: '1px solid #e5e7eb', borderRadius: '4px', background: '#fff' }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 700, color: '#0284c7' }}>
                  {formatPrice(item.priceCents * item.quantity)}
                </p>
                <button
                  onClick={() => removeItem(item.medicationId)}
                  style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '0.8rem', marginTop: '0.5rem' }}
                >
                  Eliminar
                </button>
              </div>
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
          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Resumen</h3>

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

          <button
            onClick={() => navigate('/checkout')}
            style={{
              width: '100%',
              background: '#0284c7',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem',
              fontWeight: 600,
              fontSize: '1rem',
            }}
          >
            Ir al checkout →
          </button>

          <button
            onClick={clearCart}
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              color: '#dc2626',
              marginTop: '0.75rem',
              fontSize: '0.875rem',
            }}
          >
            Vaciar carrito
          </button>
        </div>
      </div>
    </Layout>
  );
}
