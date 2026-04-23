import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <Navbar />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem', flex: 1, width: '100%' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
