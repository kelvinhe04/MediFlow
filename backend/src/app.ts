import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { env } from "./config/env";
import { apiRoutes } from "./routes";

export function createApp() {
  const app = new Hono();

  app.use("*", logger());
  app.use(
    "*",
    cors({
      origin: env.FRONTEND_ORIGIN,
      credentials: true,
    })
  );

  app.route("/api", apiRoutes);

  app.notFound((c) => c.json({ error: "Not Found" }, 404));
  app.onError((err, c) => {
    if (err instanceof Error && "status" in err && "getResponse" in err) {
      const httpErr = err as { status: number; message: string; getResponse: () => Response };
      return c.json({ error: httpErr.message }, httpErr.status as 400 | 401 | 403 | 404 | 500);
    }
    console.error(err);
    return c.json({ error: "Error interno del servidor" }, 500);
  });

  return app;
}
