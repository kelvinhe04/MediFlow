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

  app.use("/images/*", async (c) => {
    const path = c.req.path.replace(/^\//, "");
    const filePath = `./public/${path}`;
    try {
      const file = Bun.file(filePath);
      const ext = path.split(".").pop()?.toLowerCase();
      const contentTypes: Record<string, string> = {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        webp: "image/webp",
        gif: "image/gif",
      };
      return new Response(file, {
        headers: {
          "Content-Type": contentTypes[ext ?? ""] ?? "application/octet-stream",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {
      return c.json({ error: "Not Found" }, 404);
    }
  });

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
