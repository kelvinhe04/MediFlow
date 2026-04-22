export const CATEGORIES = ["dolor", "gripe", "alergias", "digestivo"] as const;

export type Category = (typeof CATEGORIES)[number];
