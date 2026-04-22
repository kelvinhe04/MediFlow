export type Category = 'dolor' | 'gripe' | 'alergias' | 'digestivo';

export interface Medication {
  id: string;
  name: string;
  brand: string;
  category: Category;
  activeIngredient: string;
  dose: string;
  packageSize: number;
  priceCents: number;
  imageUrl: string;
  requiresPrescription: boolean;
  stock: number;
  active: boolean;
}

export interface CartItem {
  medicationId: string;
  name: string;
  priceCents: number;
  quantity: number;
  imageUrl: string;
}

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'cancelled';

export interface OrderItem {
  medicationId: string;
  name: string;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  status: OrderStatus;
  stripeSessionId?: string;
  createdAt: string;
}

export interface CreateOrderResponse {
  orderId: string;
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
}

export interface CheckoutSession {
  sessionId: string;
  url: string;
}
