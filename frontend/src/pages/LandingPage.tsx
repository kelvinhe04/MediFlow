import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";

const CATEGORIES = [
  { cat: "dolor", imageUrl: "/images/dolor/aspirina-500mg-20tab.webp", label: "Dolor" },
  { cat: "gripe", imageUrl: "/images/gripe/panadol-multisintomas-48tab.webp", label: "Gripe" },
  { cat: "alergias", imageUrl: "/images/alergias/cetirizina-10mg-20tab.jpg", label: "Alergias" },
  { cat: "digestivo", imageUrl: "/images/digestivo/omeprazol-20mg-14cap.webp", label: "Digestivo" },
] as const;

const BENEFITS = [
  {
    title: "Entrega rápida",
    description: "Despacho ágil en Panamá para que recibas tu pedido sin demoras.",
  },
  {
    title: "Stock confiable",
    description: "Inventario actualizado y productos OTC listos para compra segura.",
  },
  {
    title: "Pago protegido",
    description: "Checkout seguro y experiencia clara desde carrito hasta confirmación.",
  },
] as const;

const CATEGORY_IMAGE_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect width='100%25' height='100%25' fill='%23e2e8f0'/%3E%3C/svg%3E";

export function LandingPage() {
  return (
    <Layout>
      <section className="landing-hero">
        <p className="landing-badge">Farmacia online moderna</p>
        <h1 className="landing-title">Medicamentos OTC con entrega rápida en Panamá</h1>
        <p className="landing-subtitle">
          Compra dolor, gripe, alergias y digestivo desde una experiencia clínica premium, sin receta y
          sin complicaciones.
        </p>
        <div className="landing-hero-actions">
          <Link to="/products" className="btn-primary hero-cta">
            Ver catálogo
          </Link>
          <Link to="/products?category=dolor" className="btn-secondary hero-cta-secondary">
            Explorar categorías
          </Link>
        </div>
      </section>

      <section className="landing-categories">
        <div className="landing-grid">
          {CATEGORIES.map(({ cat, imageUrl, label }) => (
            <Link key={cat} to={`/products?category=${cat}`} className="category-card-premium">
              <div className="category-image-wrap">
                <img
                  src={imageUrl}
                  alt={`Productos de ${label}`}
                  className="category-image"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = CATEGORY_IMAGE_FALLBACK;
                  }}
                />
              </div>
              <p className="category-title">{label}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="landing-benefits">
        {BENEFITS.map((benefit) => (
          <article key={benefit.title} className="benefit-card">
            <h2>{benefit.title}</h2>
            <p>{benefit.description}</p>
          </article>
        ))}
      </section>

      <section className="trust-band">
        <p>+500 pedidos mensuales</p>
        <p>Pagos seguros con Stripe</p>
        <p>Atención enfocada en salud OTC</p>
      </section>
    </Layout>
  );
}
