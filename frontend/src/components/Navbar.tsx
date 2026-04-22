import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { useCartStore } from '../store/cartStore';

export function Navbar() {
  const totalItems = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      height: '60px',
      background: '#fff',
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <Link to="/" style={{ fontWeight: 700, fontSize: '1.25rem', color: '#0284c7' }}>
        MediFlow
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link to="/products" style={{ color: '#374151', fontWeight: 500, fontSize: '0.95rem' }}>
          Catálogo
        </Link>

        <Link to="/cart" style={{ position: 'relative', fontSize: '1.25rem', lineHeight: 1 }}>
          🛒
          {totalItems > 0 && (
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-10px',
              background: '#0284c7',
              color: '#fff',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
            }}>
              {totalItems}
            </span>
          )}
        </Link>

        <SignedOut>
          <SignInButton mode="modal">
            <button style={{
              background: '#0284c7',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '0.4rem 1rem',
              fontWeight: 500,
              fontSize: '0.875rem',
            }}>
              Iniciar sesión
            </button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
