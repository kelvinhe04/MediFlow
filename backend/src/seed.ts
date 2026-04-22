import { connectMongo, closeMongo, getDb } from "./db/mongo";
import type { MedicationDoc } from "./domain/medication";

const now = new Date();

const medications: Omit<MedicationDoc, "_id">[] = [
  // --- Dolor ---
  {
    name: "Paracetamol 500mg",
    category: "dolor",
    activeIngredient: "Paracetamol",
    dose: "500mg",
    priceCents: 350,
    imageUrl: "https://placehold.co/300x300/e0f2fe/0284c7?text=Paracetamol",
    requiresPrescription: false,
    stock: 150,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    name: "Ibuprofeno 200mg",
    category: "dolor",
    activeIngredient: "Ibuprofeno",
    dose: "200mg",
    priceCents: 400,
    imageUrl: "https://placehold.co/300x300/e0f2fe/0284c7?text=Ibuprofeno+200",
    requiresPrescription: false,
    stock: 120,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    name: "Ibuprofeno 400mg",
    category: "dolor",
    activeIngredient: "Ibuprofeno",
    dose: "400mg",
    priceCents: 550,
    imageUrl: "https://placehold.co/300x300/e0f2fe/0284c7?text=Ibuprofeno+400",
    requiresPrescription: false,
    stock: 100,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    name: "Aspirina 500mg",
    category: "dolor",
    activeIngredient: "Ácido Acetilsalicílico",
    dose: "500mg",
    priceCents: 300,
    imageUrl: "https://placehold.co/300x300/e0f2fe/0284c7?text=Aspirina",
    requiresPrescription: false,
    stock: 200,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    name: "Naproxeno 220mg",
    category: "dolor",
    activeIngredient: "Naproxeno Sódico",
    dose: "220mg",
    priceCents: 650,
    imageUrl: "https://placehold.co/300x300/e0f2fe/0284c7?text=Naproxeno",
    requiresPrescription: false,
    stock: 80,
    active: true,
    createdAt: now,
    updatedAt: now,
  },

  // --- Gripe ---
  {
    name: "Paracetamol + Fenilefrina",
    category: "gripe",
    activeIngredient: "Paracetamol, Fenilefrina",
    dose: "500mg / 5mg",
    priceCents: 550,
    imageUrl: "https://placehold.co/300x300/dcfce7/16a34a?text=Gripe+Day",
    requiresPrescription: false,
    stock: 100,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    name: "Paracetamol + Clorfenamina",
    category: "gripe",
    activeIngredient: "Paracetamol, Clorfenamina",
    dose: "500mg / 2mg",
    priceCents: 500,
    imageUrl: "https://placehold.co/300x300/dcfce7/16a34a?text=Gripe+Noche",
    requiresPrescription: false,
    stock: 90,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    name: "Antigripal combinado",
    category: "gripe",
    activeIngredient: "Paracetamol, Fenilefrina, Clorfenamina",
    dose: "325mg / 5mg / 2mg",
    priceCents: 700,
    imageUrl: "https://placehold.co/300x300/dcfce7/16a34a?text=Antigripal",
    requiresPrescription: false,
    stock: 70,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    name: "Dextrometorfano + Antihistamínico",
    category: "gripe",
    activeIngredient: "Dextrometorfano, Clorfeniramina",
    dose: "15mg / 2mg",
    priceCents: 800,
    imageUrl: "https://placehold.co/300x300/dcfce7/16a34a?text=Tos",
    requiresPrescription: false,
    stock: 60,
    active: true,
    createdAt: now,
    updatedAt: now,
  },

  // --- Alergias ---
  {
    name: "Loratadina 10mg",
    category: "alergias",
    activeIngredient: "Loratadina",
    dose: "10mg",
    priceCents: 500,
    imageUrl: "https://placehold.co/300x300/fef9c3/ca8a04?text=Loratadina",
    requiresPrescription: false,
    stock: 120,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    name: "Cetirizina 10mg",
    category: "alergias",
    activeIngredient: "Cetirizina",
    dose: "10mg",
    priceCents: 550,
    imageUrl: "https://placehold.co/300x300/fef9c3/ca8a04?text=Cetirizina",
    requiresPrescription: false,
    stock: 110,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    name: "Desloratadina 5mg",
    category: "alergias",
    activeIngredient: "Desloratadina",
    dose: "5mg",
    priceCents: 900,
    imageUrl: "https://placehold.co/300x300/fef9c3/ca8a04?text=Desloratadina",
    requiresPrescription: false,
    stock: 75,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    name: "Clorfeniramina 4mg",
    category: "alergias",
    activeIngredient: "Clorfeniramina",
    dose: "4mg",
    priceCents: 350,
    imageUrl: "https://placehold.co/300x300/fef9c3/ca8a04?text=Clorfeniramina",
    requiresPrescription: false,
    stock: 130,
    active: true,
    createdAt: now,
    updatedAt: now,
  },

  // --- Digestivo ---
  {
    name: "Omeprazol 20mg",
    category: "digestivo",
    activeIngredient: "Omeprazol",
    dose: "20mg",
    priceCents: 600,
    imageUrl: "https://placehold.co/300x300/fce7f3/db2777?text=Omeprazol",
    requiresPrescription: false,
    stock: 90,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    name: "Simeticona 80mg",
    category: "digestivo",
    activeIngredient: "Simeticona",
    dose: "80mg",
    priceCents: 450,
    imageUrl: "https://placehold.co/300x300/fce7f3/db2777?text=Simeticona",
    requiresPrescription: false,
    stock: 100,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    name: "Carbonato de Calcio 500mg",
    category: "digestivo",
    activeIngredient: "Carbonato de Calcio",
    dose: "500mg",
    priceCents: 500,
    imageUrl: "https://placehold.co/300x300/fce7f3/db2777?text=Calcio",
    requiresPrescription: false,
    stock: 80,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
];

async function seed() {
  console.log("Conectando a MongoDB...");
  await connectMongo();
  const db = getDb();
  const col = db.collection<MedicationDoc>("medications");

  console.log("Limpiando colección medications...");
  await col.deleteMany({});

  console.log(`Insertando ${medications.length} medicamentos...`);
  await col.insertMany(medications as MedicationDoc[]);

  console.log("Creando índices...");
  await col.createIndex({ category: 1 });
  await col.createIndex({ name: "text" });
  await db.collection("orders").createIndex({ userId: 1 });
  await db.collection("orders").createIndex({ stripePaymentIntentId: 1 }, { sparse: true });
  await db.collection("payments").createIndex({ stripeSessionId: 1 }, { unique: true });

  console.log("Seed completado.");
  await closeMongo();
}

seed().catch((err) => {
  console.error("Error en seed:", err);
  process.exit(1);
});
