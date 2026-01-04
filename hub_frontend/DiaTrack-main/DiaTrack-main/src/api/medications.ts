import { get, post, put, del } from './client';

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

export interface MedicationRegimenRequest {
  medicationName: string;
  doseAmount: number;
  doseUnit: string;
  frequencyType: string;
  frequencyValue: number;
  timesOfDay: string[];
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

/**
 * Create a new medication regimen for a patient
 * @param patientId Patient UUID
 * @param request Medication regimen data
 * @returns The created medication regimen
 */
export async function createMedicationRegimen(patientId: string, request: MedicationRegimenRequest): Promise<MedicationRegimen> {
  return await post<MedicationRegimen>(`/api/patients/${patientId}/medications/regimens`, request);
}

/**
 * Update an existing medication regimen
 * @param patientId Patient UUID
 * @param regimenId Regimen UUID
 * @param request Updated medication regimen data
 * @returns The updated medication regimen
 */
export async function updateMedicationRegimen(patientId: string, regimenId: string, request: MedicationRegimenRequest): Promise<MedicationRegimen> {
  return await put<MedicationRegimen>(`/api/patients/${patientId}/medications/regimens/${regimenId}`, request);
}

/**
 * Delete a medication log entry
 * @param patientId Patient UUID
 * @param logId Log UUID
 * @returns void
 */
export async function deleteMedicationLog(patientId: string, logId: string): Promise<void> {
  return await del<void>(`/api/patients/${patientId}/medications/logs/${logId}`);
}
