import { post, get } from './client';

export interface SymptomNote {
  id: string;
  patientId: string;
  symptom: string;
  notes?: string;
  occurredAt: string;
  createdAt: string;
}

export interface SymptomLogRequest {
  symptom: string;
  notes?: string;
  occurredAt?: string;
}

/**
 * Log a symptom for a patient
 * @param patientId Patient UUID
 * @param symptomData Symptom log data
 * @returns Created symptom note
 */
export async function logSymptom(patientId: string, symptomData: SymptomLogRequest): Promise<SymptomNote> {
  return await post<SymptomNote>(`/api/patients/${patientId}/logs/symptoms`, symptomData);
}

/**
 * Get symptom logs for a patient
 * @param patientId Patient UUID
 * @returns List of symptom notes
 */
export async function getSymptomLogs(patientId: string): Promise<SymptomNote[]> {
  return await get<SymptomNote[]>(`/api/patients/${patientId}/logs/symptoms`);
}
