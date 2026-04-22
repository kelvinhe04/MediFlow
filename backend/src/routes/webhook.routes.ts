import { Hono } from "hono";
import { constructEvent, handleEvent } from "../integrations/stripe/webhook";

export const webhookRoutes = new Hono();

webhookRoutes.post("/", async (c) => {
  const rawBody = await c.req.text();
  const signature = c.req.header("stripe-signature") ?? "";

  let event;
  try {
    event = await constructEvent(rawBody, signature);
  } catch (err) {
    console.error("[webhook] Firma inválida:", err);
    return c.json({ error: "Firma inválida" }, 400);
  }

  await handleEvent(event);
  return c.json({ received: true });
});
