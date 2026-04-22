import { getDb } from "../db/mongo";
import type { PaymentDoc, PaymentStatus } from "../domain/payment";

const col = () => getDb().collection<PaymentDoc>("payments");

export async function create(payment: Omit<PaymentDoc, "_id">) {
  const result = await col().insertOne(payment as PaymentDoc);
  return result.insertedId;
}

export async function findBySessionId(sessionId: string) {
  return col().findOne({ stripeSessionId: sessionId });
}

export async function updateStatus(
  sessionId: string,
  status: PaymentStatus,
  paymentIntentId?: string
) {
  return col().updateOne(
    { stripeSessionId: sessionId },
    {
      $set: {
        status,
        updatedAt: new Date(),
        ...(paymentIntentId ? { stripePaymentIntentId: paymentIntentId } : {}),
      },
    }
  );
}
