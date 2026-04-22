import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { requireAuth } from "../middleware/auth";
import * as checkoutService from "../services/checkout.service";
import type { AppEnv } from "../types";

export const checkoutRoutes = new Hono<AppEnv>();

checkoutRoutes.use("*", requireAuth);

checkoutRoutes.post("/", async (c) => {
  const userId = c.get("userId") as string;
  const { orderId } = await c.req.json<{ orderId: string }>();
  if (!orderId) throw new HTTPException(400, { message: "orderId es requerido" });
  const data = await checkoutService.createCheckoutSession(orderId, userId);
  return c.json(data);
});
