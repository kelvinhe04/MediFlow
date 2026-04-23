import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { useCartStore } from '../store/cartStore';

function CartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
  );
}

export function Navbar() {
  const totalItems = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const navigate = useNavigate();
  const location = useLocation();

  // Sync search input with URL ?q= param
  const urlQuery = new URLSearchParams(location.search).get('q') ?? '';
  const [query, setQuery] = useState(urlQuery);
  useEffect(() => { setQuery(urlQuery); }, [urlQuery]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : '/products');
  }

  function handleClear() {
    setQuery('');
    // Remove ?q= from URL if present
    if (new URLSearchParams(location.search).has('q')) {
      const params = new URLSearchParams(location.search);
      params.delete('q');
      const rest = params.toString();
      navigate(location.pathname + (rest ? `?${rest}` : ''));
    }
  }

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      padding: '0 1.5rem',
      height: '64px',
      background: '#fff',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 1px 0 rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04)',
    }}>

      {/* Logo — left */}
      <Link
        to="/"
        style={{
          fontWeight: 800,
          fontSize: '1.2rem',
          color: '#0284c7',
          flexShrink: 0,
          letterSpacing: '-0.02em',
          position: 'relative',
          zIndex: 1,
        }}
      >
        MediFlow
      </Link>

      {/* Search — truly centered via absolute positioning */}
      <form
        onSubmit={handleSearch}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '420px',
          maxWidth: 'calc(100vw - 380px)',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: '#fff',
          border: '1.5px solid #cbd5e1',
          borderRadius: '10px',
          overflow: 'hidden',
          transition: 'border-color 0.15s, box-shadow 0.15s',
          boxShadow: '0 1px 4px rgba(0,0,0,0.07), 0 2px 8px rgba(0,0,0,0.05)',
        }}
          onFocusCapture={(e) => {
            const el = e.currentTarget;
            el.style.borderColor = '#60a5fa';
            el.style.boxShadow = '0 0 0 3px rgba(96,165,250,0.2), 0 1px 4px rgba(0,0,0,0.07)';
          }}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              const el = e.currentTarget;
              el.style.borderColor = '#cbd5e1';
              el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.07), 0 2px 8px rgba(0,0,0,0.05)';
            }
          }}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar medicamentos..."
            style={{
              flex: 1,
              padding: '0 0.75rem',
              border: 'none',
              background: 'transparent',
              fontSize: '0.875rem',
              color: '#0f172a',
              outline: 'none',
              height: '42px',
              minWidth: 0,
            }}
          />

          {/* Clear button — only when there's text */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Limpiar búsqueda"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                margin: '0 4px 0 0',
                border: 'none',
                borderRadius: '6px',
                background: 'transparent',
                color: '#94a3b8',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'background 0.12s, color 0.12s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.color = '#475569';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#94a3b8';
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Search submit button — magnifying glass */}
          <button
            type="submit"
            aria-label="Buscar"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              border: 'none',
              borderLeft: '1px solid #e2e8f0',
              background: 'transparent',
              color: '#0284c7',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'background 0.12s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#eff6ff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>
        </div>
      </form>

      {/* Actions — right */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginLeft: 'auto',
        flexShrink: 0,
        position: 'relative',
        zIndex: 1,
      }}>
        <Link
          to="/cart"
          style={{ position: 'relative', color: '#374151', display: 'flex', alignItems: 'center' }}
          aria-label={`Carrito, ${totalItems} artículo${totalItems !== 1 ? 's' : ''}`}
        >
          <CartIcon />
          {totalItems > 0 && (
            <span style={{
              position: 'absolute',
              top: '-6px',
              right: '-8px',
              background: '#0284c7',
              color: '#fff',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              fontSize: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              lineHeight: 1,
            }}>
              {totalItems > 9 ? '9+' : totalItems}
            </span>
          )}
        </Link>

        <SignedOut>
          <SignInButton mode="modal">
            <button style={{
              background: '#0284c7',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.45rem 1rem',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
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
