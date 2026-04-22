import type Stripe from "stripe";
import { stripe } from "./client";
import { env } from "../../config/env";
import * as ordersRepo from "../../repositories/orders.repo";
import * as paymentsRepo from "../../repositories/payments.repo";
import * as medicationsRepo from "../../repositories/medications.repo";

export function constructEvent(rawBody: string, signature: string) {
  return stripe.webhooks.constructEventAsync(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
}

export async function handleEvent(event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.["orderId"];
      if (!orderId) return;

      const order = await ordersRepo.findById(orderId);
      if (!order || order.stripeEventIdsProcessed.includes(event.id)) return;

      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : (session.payment_intent as Stripe.PaymentIntent | null)?.id ?? "";

      await ordersRepo.markPaid(orderId, paymentIntentId, event.id);
      await paymentsRepo.updateStatus(session.id, "paid", paymentIntentId || undefined);
      await medicationsRepo.decrementStock(order.items);
      console.log(`[webhook] Orden ${orderId} → pagada`);
      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.["orderId"];
      if (!orderId) return;

      const order = await ordersRepo.findById(orderId);
      if (!order || order.stripeEventIdsProcessed.includes(event.id)) return;

      await ordersRepo.markFailed(orderId, event.id);
      await paymentsRepo.updateStatus(session.id, "failed");
      console.log(`[webhook] Orden ${orderId} → fallida (sesión expirada)`);
      break;
    }

    default:
      break;
  }
}
