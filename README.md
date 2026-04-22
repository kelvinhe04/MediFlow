# MediFlow

E-commerce B2C para la venta de medicamentos OTC (sin receta) en Panamá. Compra de tabletas con flujo completo: catálogo, carrito, checkout y pago simulado con Stripe.

---

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + TypeScript, Vite |
| Backend | Bun, Hono v4 |
| DB | MongoDB Atlas |
| Auth | Clerk |
| Pagos | Stripe (sandbox) |

---

## Features

- Catálogo de medicamentos por categoría (`dolor`, `gripe`, `alergias`, `digestivo`)
- Detalle de producto
- Carrito persistente (Zustand + localStorage)
- Checkout con Stripe Checkout Sessions
- Autenticación con Clerk (email OTP, Google, Microsoft)
- ITBMS 7% aplicado en backend

---

## Arquitectura

```
Navegador (React) ──► API (Bun + Hono) ──► MongoDB Atlas
                              ▲
                       Clerk (JWT)
                       Stripe (Checkout + Webhook)
```

El frontend nunca accede directamente a MongoDB.

---

## Estructura

```
MediFlow/
├── shared/         # @mediflow/shared (tipos y schemas)
├── backend/        # @mediflow/backend
│   └── src/
│       ├── routes/
│       ├── services/
│       ├── repositories/
│       └── integrations/
└── frontend/       # @mediflow/frontend
    └── src/
        ├── pages/
        ├── components/
        ├── services/
        └── store/
```

---

## Setup

### Backend

```bash
cd backend
cp .env.example .env
# Llenar MONGODB_URI, CLERK_SECRET_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
bun install
bun run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env
# Llenar VITE_CLERK_PUBLISHABLE_KEY
bun install
bun run dev
```

### Desde raíz

```bash
bun run dev           # Corre backend + frontend concurrently
```

### Stripe Webhook (requerido para descuento de stock)

```bash
~/stripe-cli/stripe.exe listen --forward-to localhost:3000/api/stripe/webhook
# Copiar STRIPE_WEBHOOK_SECRET al .env del backend
```

---

## Variables de Entorno

**Backend** (`.env`):
- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

**Frontend** (`.env`):
- `VITE_CLERK_PUBLISHABLE_KEY`

---

## Flujo de Pago

1. Cliente crea orden → `POST /api/orders` (backend revalida precios)
2. Se crea Checkout Session → `POST /api/checkout`
3. Redirect a Stripe Checkout
4. Stripe envía webhook `checkout.session.completed`
5. Backend actualiza orden a `paid` y descuenta stock

---

## Limitaciones

- Stripe en modo sandbox (solo pruebas con `4242 4242 4242 4242`)
- Solo medicamentos OTC en formato tabletas
- Imágenes placeholder (reemplazar en producción)