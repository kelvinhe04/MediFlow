import { HTTPException } from "hono/http-exception";
import * as medicationsRepo from "../repositories/medications.repo";
import * as ordersRepo from "../repositories/orders.repo";

const ITBMS = 0.07;

export async function createOrder(
  userId: string,
  items: Array<{ medicationId: string; quantity: number }>
) {
  if (!items.length) {
    throw new HTTPException(400, { message: "Se requiere al menos un ítem" });
  }

  const meds = await medicationsRepo.findByIds(items.map((i) => i.medicationId));
  const medMap = new Map(meds.map((m) => [m._id!.toString(), m]));

  for (const item of items) {
    const med = medMap.get(item.medicationId);
    if (!med) {
      throw new HTTPException(400, { message: `Medicamento ${item.medicationId} no encontrado` });
    }
    if (item.quantity < 1) {
      throw new HTTPException(400, { message: "La cantidad debe ser mayor a 0" });
    }
    if (med.stock < item.quantity) {
      throw new HTTPException(400, { message: `Stock insuficiente para ${med.name}` });
    }
  }

  const orderItems = items.map((item) => {
    const med = medMap.get(item.medicationId)!;
    return {
      medicationId: item.medicationId,
      name: med.name,
      quantity: item.quantity,
      unitPriceCents: med.priceCents,
      lineTotalCents: med.priceCents * item.quantity,
    };
  });

  const subtotalCents = orderItems.reduce((sum, i) => sum + i.lineTotalCents, 0);
  const taxCents = Math.round(subtotalCents * ITBMS);
  const totalCents = subtotalCents + taxCents;
  const now = new Date();

  const orderId = await ordersRepo.create({
    userId,
    items: orderItems,
    subtotalCents,
    taxCents,
    totalCents,
    status: "pending",
    stripeEventIdsProcessed: [],
    createdAt: now,
    updatedAt: now,
  });

  return { orderId: orderId.toString(), subtotalCents, taxCents, totalCents };
}

export async function getUserOrders(userId: string) {
  const docs = await ordersRepo.findByUserId(userId);
  return docs.map(({ _id, ...rest }) => ({ id: _id!.toString(), ...rest }));
}

export async function getOrder(orderId: string, userId: string) {
  const doc = await ordersRepo.findById(orderId);
  if (!doc) throw new HTTPException(404, { message: "Orden no encontrada" });
  if (doc.userId !== userId) throw new HTTPException(403, { message: "Sin autorización" });
  const { _id, ...rest } = doc;
  return { id: _id!.toString(), ...rest };
}
