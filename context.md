# MediFlow — Contexto del Proyecto

## 1. Descripción General

E-commerce B2C en Panamá para la venta exclusiva de **medicamentos OTC (Over The Counter) en formato tabletas/pastillas**.

| Campo | Valor |
|---|---|
| Tipo | Proyecto universitario (Soft 9) |
| Mercado | B2C — Panamá |
| Productos | Solo OTC en tabletas. Sin antibióticos, sin receta, sin otros formatos |
| Categorías | `dolor`, `gripe`, `alergias`, `digestivo` |
| Moneda | USD / PAB (paridad 1:1). Precios almacenados en **centavos enteros** |
| Impuesto | ITBMS 7% aplicado en el backend al crear orden |
| Autenticación | Solo OTP por email, Google OAuth, Microsoft OAuth — **sin password login** |

---

## 2. Arquitectura

```
Navegador (React + Vite)
  │  HTTPS / JSON + Bearer (Clerk JWT)
  ▼
API Backend (Bun + Hono)  ←→  Clerk (verifica JWT)
  │                       ←→  Stripe (checkout + webhook)
  ▼
MongoDB Atlas (cloud)
```

### Regla arquitectónica inviolable
El frontend **nunca** accede directamente a MongoDB. Todo dato pasa por la API. La `MONGODB_URI` vive únicamente en `backend/.env`.

### Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + TypeScript, Vite, `react-router-dom` v6 |
| Backend | Bun runtime, Hono v4 |
| Base de datos | MongoDB Atlas (driver nativo, sin Mongoose) |
| Autenticación | Clerk (`@clerk/clerk-react` v5, `@clerk/backend` v1) |
| Pagos | Stripe Checkout Sessions + Webhooks (sandbox) |
| Tipos compartidos | `@mediflow/shared` (workspace interno) |

### Servicios externos

| Servicio | Uso |
|---|---|
| Clerk | Identidad y sesiones. Emite JWT; el backend verifica con `verifyToken` |
| Stripe | Pago con tarjeta (sandbox). Checkout Session + webhook `checkout.session.completed` |
| MongoDB Atlas | Almacenamiento primario. Clúster M0 gratuito |
| placehold.co | Imágenes placeholder en el seed (en producción reemplazar por URLs reales) |

---

## 3. Estructura de Carpetas

```
MediFlow/
├── package.json               # Bun workspaces + scripts raíz
├── tsconfig.base.json         # Config TS estricto compartido
├── .gitignore
├── .env.example               # Guía de onboarding (no tiene vars reales)
│
├── shared/                    # @mediflow/shared
│   └── src/
│       ├── types/category.ts  # CATEGORIES array + Category type
│       └── schemas/category.schema.ts  # Zod schema de categoría
│
├── backend/                   # @mediflow/backend
│   ├── .env.example
│   └── src/
│       ├── index.ts           # Bun.serve + shutdown graceful
│       ├── app.ts             # Hono app factory (CORS, logger, error handler)
│       ├── types.ts           # AppEnv (Variables: { userId })
│       ├── config/env.ts      # Zod — valida y exporta env vars
│       ├── db/mongo.ts        # connectMongo / getDb / closeMongo
│       ├── domain/
│       │   ├── medication.ts  # MedicationDoc interface
│       │   ├── order.ts       # OrderDoc, OrderItem, OrderStatus
│       │   └── payment.ts     # PaymentDoc, PaymentStatus
│       ├── repositories/
│       │   ├── medications.repo.ts  # findAll, findById, findByIds, decrementStock
│       │   ├── orders.repo.ts
│       │   └── payments.repo.ts
│       ├── services/
│       │   ├── medications.service.ts
│       │   ├── orders.service.ts    # Revalida precios + ITBMS
│       │   └── checkout.service.ts  # Crea Stripe Checkout Session
│       ├── middleware/
│       │   └── auth.ts        # requireAuth — verifica JWT de Clerk
│       ├── integrations/
│       │   ├── clerk/         # (carpeta reservada, lógica en middleware/auth.ts)
│       │   └── stripe/
│       │       ├── client.ts  # Instancia Stripe
│       │       └── webhook.ts # constructEventAsync + handleEvent (idempotente) + decrementStock al pagar
│       ├── routes/
│       │   ├── index.ts       # Agrega todas las rutas bajo /api
│       │   ├── health.routes.ts
│       │   ├── medications.routes.ts
│       │   ├── orders.routes.ts
│       │   ├── checkout.routes.ts
│       │   └── webhook.routes.ts
│       └── seed.ts            # 16 medicamentos + índices de MongoDB
│
└── frontend/                  # @mediflow/frontend
    ├── .env.example
    ├── vite.config.ts         # Proxy /api → localhost:3000
    └── src/
        ├── main.tsx           # BrowserRouter > ClerkWithRouter > App + import index.css
        ├── App.tsx            # Routes: /, /products, /products/:id, /cart, /checkout, /orders/:id
        ├── index.css          # Reset + base styles
        ├── vite-env.d.ts      # Tipos para import.meta.env
        ├── types/
        │   └── index.ts       # Medication, CartItem, Order, CreateOrderResponse, CheckoutSession
        ├── store/
        │   └── cartStore.ts   # Zustand + persist (localStorage). addItem, removeItem, updateQuantity, clearCart
        ├── services/
        │   ├── medications.ts # getMedications(category?), getMedicationById(id)
        │   ├── orders.ts      # createOrder(items, token), getOrder(id, token)
        │   └── checkout.ts    # createCheckoutSession(orderId, token)
        ├── components/
        │   ├── Layout.tsx     # Wrapper con Navbar + main centrado
        │   ├── Navbar.tsx     # Logo, Catálogo, carrito con badge, Clerk auth
        │   └── ProductCard.tsx # Imagen, nombre, dosis, precio, botón agregar
        ├── pages/
        │   ├── LandingPage.tsx       # Hero + cards de categorías → /products?category=
        │   ├── ProductsPage.tsx      # Grid con filtros por categoría (query param)
        │   ├── ProductDetailPage.tsx # Detalle, selector cantidad, agregar al carrito
        │   ├── CartPage.tsx          # Items, cantidades, resumen con ITBMS, → /checkout
        │   ├── CheckoutPage.tsx      # Resumen + botón pagar (abre Clerk si no autenticado)
        │   └── OrderConfirmPage.tsx  # Éxito/cancelado/pendiente + detalle de orden
        └── shared/
            └── apiClient.ts   # fetch helper con Bearer token opcional
```

---

## 4. Módulos del Backend

### Dominio (`domain/`)

| Entidad | Colección MongoDB | Campos clave |
|---|---|---|
| `MedicationDoc` | `medications` | `name`, `category`, `activeIngredient`, `dose`, `priceCents`, `stock`, `active` |
| `OrderDoc` | `orders` | `userId` (Clerk ID), `items[]`, `subtotalCents`, `taxCents`, `totalCents`, `status`, `stripeSessionId`, `stripeEventIdsProcessed[]` |
| `PaymentDoc` | `payments` | `orderId`, `stripeSessionId`, `amountCents`, `status` |

### Repositorios (`repositories/`)

Única capa que accede a MongoDB. Usa driver nativo sin Mongoose.

| Archivo | Operaciones |
|---|---|
| `medications.repo.ts` | `findAll(category?)`, `findById(id)`, `findByIds(ids[])`, `decrementStock(items[])` |
| `orders.repo.ts` | `create`, `findById`, `findByUserId`, `setStripeSession`, `markPaid`, `markFailed` |
| `payments.repo.ts` | `create`, `findBySessionId`, `updateStatus` |

### Servicios (`services/`)

Contienen toda la lógica de negocio.

| Servicio | Responsabilidad clave |
|---|---|
| `medications.service.ts` | Lista y detalle. Transforma `_id` ObjectId → string |
| `orders.service.ts` | Revalida precios desde DB (ignora precios del cliente), valida stock, aplica ITBMS 7% |
| `checkout.service.ts` | Crea Stripe Checkout Session, persiste `stripeSessionId` en la orden, crea registro en `payments` |

### Middleware (`middleware/`)

| Middleware | Descripción |
|---|---|
| `requireAuth` | Verifica JWT de Clerk con `verifyToken`. Inyecta `userId` (Clerk sub) en el contexto Hono |

### Integración Stripe (`integrations/stripe/`)

| Archivo | Descripción |
|---|---|
| `client.ts` | Instancia `new Stripe(env.STRIPE_SECRET_KEY)` |
| `webhook.ts` | `constructEventAsync` (Bun requiere async crypto), `handleEvent` (maneja `completed`/`expired`, idempotente por `event.id`, descuenta stock al pagar) |

---

## 5. Endpoints Implementados

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/api/health` | Pública | Estado del servidor |
| `GET` | `/api/medications` | Pública | Lista medicamentos. `?category=dolor\|gripe\|alergias\|digestivo` |
| `GET` | `/api/medications/:id` | Pública | Detalle de un medicamento |
| `POST` | `/api/orders` | Bearer JWT | Crea orden. Body: `{ items: [{ medicationId, quantity }] }` |
| `GET` | `/api/orders` | Bearer JWT | Historial de órdenes del usuario autenticado |
| `GET` | `/api/orders/:id` | Bearer JWT | Detalle de una orden (solo propia) |
| `POST` | `/api/checkout` | Bearer JWT | Crea Stripe Checkout Session. Body: `{ orderId }`. Retorna `{ sessionId, url }` |
| `POST` | `/api/stripe/webhook` | Firma Stripe | Recibe eventos de Stripe. Verifica firma con `STRIPE_WEBHOOK_SECRET` |

---

## 6. Flujo Completo de Pagos

```
Cliente                  Backend                    Stripe              MongoDB
  │                         │                          │                   │
  │  POST /api/orders        │                          │                   │
  ├────────────────────────►│                          │                   │
  │                         │  revalida precios + stock│                   │
  │                         ├──────────────────────────────────────────────►│
  │                         │  crea Order {status:pending}                  │
  │◄── { orderId, total } ──┤                          │                   │
  │                         │                          │                   │
  │  POST /api/checkout      │                          │                   │
  ├────────────────────────►│                          │                   │
  │                         │  crea Checkout Session   │                   │
  │                         ├─────────────────────────►│                   │
  │                         │◄── { id, url } ──────────┤                   │
  │                         │  guarda stripeSessionId  │                   │
  │                         │  crea Payment {pending}  │                   │
  │◄── { sessionId, url } ──┤                          │                   │
  │                         │                          │                   │
  │  redirige a session.url  │                          │                   │
  ├──────────────────────────────────────────────────►│                   │
  │  paga con 4242 4242...   │                          │                   │
  │◄── redirect success_url ─────────────────────────┤                   │
  │                         │                          │                   │
  │                         │  POST /api/stripe/webhook│                   │
  │                         │◄─────────────────────────┤                   │
  │                         │  verifica firma           │                   │
  │                         │  chequea idempotencia     │                   │
  │                         │  Order → status:paid      │                   │
  │                         │  Payment → status:paid    │                   │
  │                         │  stock -= cantidad        │                   │
  │                         ├──────────────────────────────────────────────►│
  │                         │──► 200 OK ───────────────►│                   │
```

### Principios de seguridad del pago

- Los **precios nunca vienen del cliente** — se recalculan desde MongoDB al crear la orden.
- La **confirmación de pago viene del webhook**, no del redirect (el redirect es solo UX).
- El webhook verifica la **firma de Stripe** (`STRIPE_WEBHOOK_SECRET`) en cada request.
- El handler es **idempotente**: guarda `event.id` en `stripeEventIdsProcessed[]` para tolerar reintentos.
- El **stock se descuenta en el webhook** (post-pago confirmado), no al crear la orden.
- Bun requiere `constructEventAsync` en lugar de `constructEvent` (crypto asíncrono).

### Tarjetas de prueba (Stripe sandbox)

| Tarjeta | Resultado |
|---|---|
| `4242 4242 4242 4242` | Pago exitoso |
| `4000 0000 0000 9995` | Pago rechazado |

---

## 7. Variables de Entorno

### `backend/.env`

```env
NODE_ENV=development
PORT=3000
FRONTEND_ORIGIN=http://localhost:5173

MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?...
MONGODB_DB_NAME=mediflow

CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...   # Obtenido con: stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### `frontend/.env`

```env
VITE_API_BASE_URL=                         # Vacío en dev (Vite proxy activo)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

> `MONGODB_URI` y `*_SECRET_KEY` viven **solo** en `backend/.env`. Nunca en frontend.

---

## 8. Estado Actual del Proyecto

### Completado

- [x] Monorepo con Bun workspaces (`shared`, `backend`, `frontend`)
- [x] Config TypeScript estricto compartido (`tsconfig.base.json`)
- [x] Validación de env vars con Zod (falla al arrancar si falta alguna)
- [x] Conexión a MongoDB Atlas con connect/close/getDb
- [x] Dominio tipado: `MedicationDoc`, `OrderDoc`, `PaymentDoc`
- [x] Repositorios: medications, orders, payments
- [x] Servicios: listado/detalle de medicamentos, creación de órdenes con ITBMS, checkout con Stripe
- [x] Middleware `requireAuth` con verificación de JWT de Clerk
- [x] Rutas REST: health, medications, orders, checkout, webhook
- [x] Flujo completo de pago: Checkout Session → Webhook → estado `paid`
- [x] Idempotencia en webhook por `stripeEventIdsProcessed[]`
- [x] Stock se descuenta en el webhook tras pago confirmado (`decrementStock`)
- [x] Fix: webhook usa `constructEventAsync` (requerido por Bun runtime)
- [x] Seed con los 16 medicamentos del catálogo + índices MongoDB
- [x] `ClerkProvider` integrado con `BrowserRouter` y `useNavigate`
- [x] `apiClient` helper con soporte de Bearer token
- [x] Proxy `/api` en Vite apuntando a `localhost:3000`
- [x] Frontend completo: LandingPage, ProductsPage, ProductDetailPage, CartPage, CheckoutPage, OrderConfirmPage
- [x] Carrito con Zustand + persistencia en localStorage
- [x] Flujo auth: invitados pueden agregar al carrito, Clerk modal al intentar pagar
- [x] Stripe CLI instalado vía descarga directa (`~/stripe-cli/stripe.exe`)
- [x] `STRIPE_WEBHOOK_SECRET` configurado con valor real

### Pendiente

- [ ] **Frontend — Admin**: panel protegido por rol — CRUD de productos, listado de órdenes
- [ ] **Backend — Admin endpoints**: `POST/PATCH/DELETE /api/admin/products`, `GET/PATCH /api/admin/orders`
- [ ] **Backend — Carrito persistente**: colección `carts` con merge al autenticarse
- [ ] **Seed de imágenes reales**: reemplazar URLs de placehold.co

---

## 9. Cómo correr el proyecto en desarrollo

```bash
# Terminal 1 — backend + frontend (desde la raíz)
bun run dev

# Terminal 2 — webhook de Stripe (necesario para que el stock baje al pagar)
~/stripe-cli/stripe.exe listen --forward-to localhost:3000/api/stripe/webhook
# Copiar el whsec_... que imprime y pegarlo en backend/.env como STRIPE_WEBHOOK_SECRET
# Reiniciar el backend después de actualizar el .env
```

El frontend corre en `http://localhost:5173` (o el siguiente puerto disponible si está ocupado).
El backend corre en `http://localhost:3000`.
