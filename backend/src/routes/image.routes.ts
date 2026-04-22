import { Hono } from "hono";
import { listMedications as getMedications } from "../services/medications.service";

type MedicationStub = {
  id: string;
  name: string;
  brand: string;
  category: string;
  dose: string;
  packageSize: number;
};

const categoryColors: Record<string, string> = {
  dolor: "#e0f2fe",
  gripe: "#dcfce7",
  alergias: "#fef9c3",
  digestivo: "#fce7f3",
};

const categoryAccents: Record<string, string> = {
  dolor: "#0284c7",
  gripe: "#16a34a",
  alergias: "#ca8a04",
  digestivo: "#db2777",
};

export function imageRoutes() {
  const app = new Hono();

  app.get("/svg/:id", async (c) => {
    const id = c.req.param("id");
    const meds = (await getMedications()) as MedicationStub[];
    const med = meds.find((m) => m.id === id);

    if (!med) {
      return c.json({ error: "Not found" }, 404);
    }

    const bg = categoryColors[med.category] ?? "#f3f4f6";
    const accent = categoryAccents[med.category] ?? "#6b7280";
    const initials = med.name
      .split(" ")
      .slice(0, 3)
      .map((w) => w[0])
      .join("")
      .toUpperCase();

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${bg}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${bg}" stop-opacity="0.6"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#g)"/>
  <rect x="20" y="20" width="360" height="360" rx="24" fill="${bg}" stroke="${accent}" stroke-width="2" opacity="0.5"/>
  <text x="200" y="160" font-family="system-ui, -apple-system, sans-serif" font-size="72" font-weight="700" fill="${accent}" text-anchor="middle" dominant-baseline="middle">${initials}</text>
  <text x="200" y="240" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="600" fill="#374151" text-anchor="middle" dominant-baseline="middle">${med.dose}</text>
  <text x="200" y="270" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#6b7280" text-anchor="middle" dominant-baseline="middle">x${med.packageSize} tabletas</text>
  <text x="200" y="300" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="${accent}" font-weight="600" text-anchor="middle" dominant-baseline="middle">${med.brand}</text>
  <rect x="0" y="360" width="400" height="40" rx="0" fill="${accent}" opacity="0.15"/>
  <text x="200" y="388" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="${accent}" text-anchor="middle" dominant-baseline="middle">MediFlow · OTC</text>
</svg>`;

    c.header("Content-Type", "image/svg+xml");
    c.header("Cache-Control", "public, max-age=86400");
    return c.body(svg);
  });

  return app;
}