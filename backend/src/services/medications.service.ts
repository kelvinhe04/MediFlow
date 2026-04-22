import * as medicationsRepo from "../repositories/medications.repo";

export async function listMedications(category?: string) {
  const docs = await medicationsRepo.findAll(category);
  return docs.map(({ _id, ...rest }) => ({ id: _id!.toString(), ...rest }));
}

export async function getMedication(id: string) {
  const doc = await medicationsRepo.findById(id);
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return { id: _id!.toString(), ...rest };
}
