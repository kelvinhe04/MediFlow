import { ObjectId } from "mongodb";
import { getDb } from "../db/mongo";
import type { OrderDoc } from "../domain/order";

function safeId(id: string): ObjectId | null {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

const col = () => getDb().collection<OrderDoc>("orders");

export async function create(order: Omit<OrderDoc, "_id">) {
  const result = await col().insertOne(order as OrderDoc);
  return result.insertedId;
}

export async function findById(id: string) {
  const oid = safeId(id);
  if (!oid) return null;
  return col().findOne({ _id: oid });
}

export async function findByUserId(userId: string) {
  return col().find({ userId }).sort({ createdAt: -1 }).toArray();
}

export async function setStripeSession(orderId: string, sessionId: string) {
  return col().updateOne(
    { _id: new ObjectId(orderId) },
    { $set: { stripeSessionId: sessionId, updatedAt: new Date() } }
  );
}

export async function markPaid(
  orderId: string,
  paymentIntentId: string,
  eventId: string
) {
  return col().updateOne(
    { _id: new ObjectId(orderId) },
    {
      $set: {
        status: "paid",
        stripePaymentIntentId: paymentIntentId,
        updatedAt: new Date(),
      },
      $addToSet: { stripeEventIdsProcessed: eventId },
    }
  );
}

export async function markFailed(orderId: string, eventId: string) {
  return col().updateOne(
    { _id: new ObjectId(orderId) },
    {
      $set: { status: "failed", updatedAt: new Date() },
      $addToSet: { stripeEventIdsProcessed: eventId },
    }
  );
}
