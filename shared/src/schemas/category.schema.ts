import { z } from "zod";
import { CATEGORIES } from "../types/category";

export const categorySchema = z.enum(CATEGORIES);
