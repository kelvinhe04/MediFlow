import { Hono } from "hono";
import { healthRoutes } from "./health.routes";
import { medicationsRoutes } from "./medications.routes";
import { ordersRoutes } from "./orders.routes";
import { checkoutRoutes } from "./checkout.routes";
import { webhookRoutes } from "./webhook.routes";

export const apiRoutes = new Hono();

apiRoutes.route("/health", healthRoutes);
apiRoutes.route("/medications", medicationsRoutes);
apiRoutes.route("/orders", ordersRoutes);
apiRoutes.route("/checkout", checkoutRoutes);
apiRoutes.route("/stripe/webhook", webhookRoutes);
