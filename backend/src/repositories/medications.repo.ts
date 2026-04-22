import { ObjectId } from "mongodb";
import { getDb } from "../db/mongo";
import type { MedicationDoc } from "../domain/medication";

function safeId(id: string): ObjectId | null {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

const col = () => getDb().collection<MedicationDoc>("medications");

export async function findAll(category?: string) {
  const query: Record<string, unknown> = { active: true };
  if (category) query["category"] = category;
  return col().find(query).sort({ name: 1 }).toArray();
}

export async function findById(id: string) {
  const oid = safeId(id);
  if (!oid) return null;
  return col().findOne({ _id: oid, active: true });
}

export async function findByIds(ids: string[]) {
  const oids = ids.map(safeId).filter((o): o is ObjectId => o !== null);
  return col().find({ _id: { $in: oids }, active: true }).toArray();
}

export async function decrementStock(items: Array<{ medicationId: string; quantity: number }>) {
  await Promise.all(
    items.map(({ medicationId, quantity }) => {
      const oid = safeId(medicationId);
      if (!oid) return;
      return col().updateOne({ _id: oid }, { $inc: { stock: -quantity } });
    })
  );
}
