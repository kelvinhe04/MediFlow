import type { ObjectId } from "mongodb";

export type PaymentStatus = "pending" | "paid" | "failed";

export interface PaymentDoc {
  _id?: ObjectId;
  orderId: string;
  stripeSessionId: string;
  stripePaymentIntentId?: string;
  amountCents: number;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}
