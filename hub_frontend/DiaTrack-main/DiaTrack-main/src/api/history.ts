import { get } from './client';
import type { GlucoseReading } from './glucose';
import type { MealLog } from './meals';
import type { MedicationLog } from './medications';

export interface SymptomNote {
  id: string;
  patientId: string;
  symptomText: string;
  severity: string;
  loggedAt: string;
}

export interface ActivityLog {
  id: string;
  patientId: string;
  activityType: string;
  durationMinutes: number;
  intensity: string;
  loggedAt: string;
}

export interface HistoryResponse {
  glucoseReadings: GlucoseReading[];
  medicationLogs: MedicationLog[];
  meals: MealLog[];
  symptoms: SymptomNote[];
  activities: ActivityLog[];
}

/**
 * Get comprehensive patient history
 * @param patientId Patient UUID
 * @returns Complete patient history including glucose, medications, meals, symptoms, and activities
 */
export async function getPatientHistory(patientId: string): Promise<HistoryResponse> {
  return await get<HistoryResponse>(`/api/patients/${patientId}/history`);
}
