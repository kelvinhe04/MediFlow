import type { ObjectId } from "mongodb";

export interface OrderItem {
  medicationId: string;
  name: string;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
}

export type OrderStatus = "pending" | "paid" | "failed" | "cancelled";

export interface OrderDoc {
  _id?: ObjectId;
  userId: string;
  items: OrderItem[];
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  status: OrderStatus;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  stripeEventIdsProcessed: string[];
  createdAt: Date;
  updatedAt: Date;
}
