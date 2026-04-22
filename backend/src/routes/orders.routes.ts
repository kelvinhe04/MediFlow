import { Hono } from "hono";
import { requireAuth } from "../middleware/auth";
import * as ordersService from "../services/orders.service";
import type { AppEnv } from "../types";

export const ordersRoutes = new Hono<AppEnv>();

ordersRoutes.use("*", requireAuth);

ordersRoutes.post("/", async (c) => {
  const userId = c.get("userId") as string;
  const body = await c.req.json<{
    items: Array<{ medicationId: string; quantity: number }>;
  }>();
  const result = await ordersService.createOrder(userId, body.items ?? []);
  return c.json(result, 201);
});

ordersRoutes.get("/", async (c) => {
  const userId = c.get("userId") as string;
  const data = await ordersService.getUserOrders(userId);
  return c.json(data);
});

ordersRoutes.get("/:id", async (c) => {
  const userId = c.get("userId") as string;
  const orderId = c.req.param("id");
  const data = await ordersService.getOrder(orderId, userId);
  return c.json(data);
});
