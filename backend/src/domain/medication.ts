import type { ObjectId } from "mongodb";

export const CATEGORIES = ["dolor", "gripe", "alergias", "digestivo"] as const;
export type Category = (typeof CATEGORIES)[number];

export interface MedicationDoc {
  _id?: ObjectId;
  name: string;
  brand: string;
  category: Category;
  activeIngredient: string;
  dose: string;
  packageSize: number;
  priceCents: number;
  imageUrl: string;
  requiresPrescription: false;
  stock: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
