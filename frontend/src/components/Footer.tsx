import { Link } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/products', label: 'Productos' },
  { to: '/cart', label: 'Carrito' },
];

const INFO_ITEMS = [
  'Envíos a todo Panamá',
  'Envío gratis en órdenes > $50',
  'Devoluciones en 7 días',
  'Pago seguro con Stripe',
];

export function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid #e2e8f0',
      background: '#fff',
      marginTop: '4rem',
      padding: '3rem 1.5rem 2rem',
      boxShadow: '0 -2px 16px rgba(0,0,0,0.04)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem',
        }}>
          {/* Branding */}
          <div>
            <p style={{
              fontWeight: 800,
              fontSize: '1.2rem',
              color: '#0284c7',
              letterSpacing: '-0.02em',
              marginBottom: '0.75rem',
            }}>
              MediFlow
            </p>
            <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.75, maxWidth: '220px' }}>
              Tu farmacia digital de confianza en Panamá. Medicamentos OTC verificados, entregados rápido.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Navegación
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {NAV_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    style={{ color: '#64748b', fontSize: '0.875rem', transition: 'color 0.15s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#0284c7'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <p style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Información
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {INFO_ITEMS.map((text) => (
                <li key={text} style={{ color: '#64748b', fontSize: '0.875rem' }}>{text}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Contacto
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li style={{ color: '#64748b', fontSize: '0.875rem' }}>soporte@mediflow.pa</li>
              <li style={{ color: '#64748b', fontSize: '0.875rem' }}>Lun – Vie · 8am – 6pm</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid #f1f5f9',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} MediFlow. Todos los derechos reservados.
          </p>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
            Hecho con ♥ en Panamá
          </p>
        </div>
      </div>
    </footer>
  );
}
