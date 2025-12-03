import { get, post } from './client';

export interface MedicationRegimen {
  id: string;
  patientId: string;
  medicationName: string;
  doseAmount: number;
  doseUnit: string;
  frequencyType: string; // e.g., "DAILY", "WEEKLY"
  frequencyValue: number;
  timesOfDay: string[]; // Array of time strings
  isActive: boolean;
  instructions?: string;
}

export interface MedicationLog {
  id: string;
  regimenId: string;
  takenAt: string;
}

export interface MedicationLogRequest {
  regimenId: string;
  takenAt: string;
}

/**
 * Get active medication regimens for a patient
 * @param patientId Patient UUID
 * @returns List of active medication regimens
 */
export async function getMedicationRegimens(patientId: string): Promise<MedicationRegimen[]> {
  return await get<MedicationRegimen[]>(`/api/patients/${patientId}/medications/regimens`);
}

/**
 * Log that a medication was taken
 * @param patientId Patient UUID
 * @param request Medication log data
 * @returns The created medication log
 */
export async function logMedicationTaken(patientId: string, request: MedicationLogRequest): Promise<MedicationLog> {
  return await post<MedicationLog>(`/api/patients/${patientId}/medications/logs`, request);
}

/**
 * Get medication logs for a patient
 * @param patientId Patient UUID
 * @returns List of medication logs
 */
export async function getMedicationLogs(patientId: string): Promise<MedicationLog[]> {
  return await get<MedicationLog[]>(`/api/patients/${patientId}/medications/logs`);
}
