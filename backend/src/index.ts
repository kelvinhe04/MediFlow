import { createApp } from "./app";
import { env } from "./config/env";
import { connectMongo, closeMongo } from "./db/mongo";

async function main() {
  await connectMongo();

  const app = createApp();

  const server = Bun.serve({
    port: env.PORT,
    fetch: app.fetch,
  });

  console.log(`MediFlow backend escuchando en http://localhost:${server.port}`);

  const shutdown = async () => {
    console.log("Cerrando servidor...");
    server.stop();
    await closeMongo();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error("Fallo al iniciar el servidor:", err);
  process.exit(1);
});
