import { apiClient } from '../shared/apiClient';
import type { Medication } from '../types';

export function getMedications(category?: string): Promise<Medication[]> {
  const path = category ? `/medications?category=${category}` : '/medications';
  return apiClient<Medication[]>(path);
}

export function getMedicationById(id: string): Promise<Medication> {
  return apiClient<Medication>(`/medications/${id}`);
}
