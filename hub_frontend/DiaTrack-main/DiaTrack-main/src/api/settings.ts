import { get, put } from './client';

export interface PatientSettings {
  patientId: string;
  trendWindowDays: number;
  updatedAt: string;
}

/**
 * Get patient settings
 * @param patientId Patient UUID
 * @returns Patient settings
 */
export async function getPatientSettings(patientId: string): Promise<PatientSettings> {
  return await get<PatientSettings>(`/api/patients/${patientId}/settings`);
}

/**
 * Update patient settings
 * @param patientId Patient UUID
 * @param settings Updated settings
 * @returns Updated patient settings
 */
export async function updatePatientSettings(patientId: string, settings: Partial<PatientSettings>): Promise<PatientSettings> {
  return await put<PatientSettings>(`/api/patients/${patientId}/settings`, settings);
}
