import { Hono } from "hono";
import * as medicationsService from "../services/medications.service";

export const medicationsRoutes = new Hono();

medicationsRoutes.get("/", async (c) => {
  const category = c.req.query("category") ?? undefined;
  const data = await medicationsService.listMedications(category);
  return c.json(data);
});

medicationsRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");
  const data = await medicationsService.getMedication(id);
  if (!data) return c.json({ error: "Medicamento no encontrado" }, 404);
  return c.json(data);
});
