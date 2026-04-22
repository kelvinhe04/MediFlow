import { HTTPException } from "hono/http-exception";
import { stripe } from "../integrations/stripe/client";
import * as ordersRepo from "../repositories/orders.repo";
import * as paymentsRepo from "../repositories/payments.repo";
import { env } from "../config/env";

export async function createCheckoutSession(orderId: string, userId: string) {
  const order = await ordersRepo.findById(orderId);
  if (!order) throw new HTTPException(404, { message: "Orden no encontrada" });
  if (order.userId !== userId) throw new HTTPException(403, { message: "Sin autorización" });
  if (order.status !== "pending") {
    throw new HTTPException(400, { message: "La orden no está pendiente" });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: order.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: item.unitPriceCents,
      },
      quantity: item.quantity,
    })),
    success_url: `${env.FRONTEND_ORIGIN}/orders/${orderId}?success=true`,
    cancel_url: `${env.FRONTEND_ORIGIN}/orders/${orderId}?cancelled=true`,
    metadata: { orderId },
  });

  if (!session.url) {
    throw new HTTPException(500, { message: "No se pudo crear la sesión de pago" });
  }

  await ordersRepo.setStripeSession(orderId, session.id);

  const now = new Date();
  await paymentsRepo.create({
    orderId,
    stripeSessionId: session.id,
    amountCents: order.totalCents,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  });

  return { sessionId: session.id, url: session.url };
}
