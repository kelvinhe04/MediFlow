import { createMiddleware } from "hono/factory";
import { verifyToken } from "@clerk/backend";
import { env } from "../config/env";
import type { AppEnv } from "../types";

export const requireAuth = createMiddleware<AppEnv>(async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "Se requiere autenticación" }, 401);
  }
  const token = authHeader.slice(7);
  try {
    const payload = await verifyToken(token, { secretKey: env.CLERK_SECRET_KEY });
    c.set("userId", payload.sub);
    await next();
  } catch {
    return c.json({ error: "Token inválido o expirado" }, 401);
  }
});
