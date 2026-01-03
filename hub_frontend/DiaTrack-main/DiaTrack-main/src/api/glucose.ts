import { get, post } from './client';

export type GlucoseContextType = 'Before Meal' | 'After Meal' | 'Fasting' | 'Bedtime' | 'Random' | 'Other';

export interface GlucoseReading {
  id: string;
  patientId: string;
  measuredAt: string;
  lastMealAt?: string;
  valueMgdl: number;
  context: GlucoseContextType;
}

export interface GlucoseLogRequest {
  measuredAt: string;
  lastMealAt?: string;
  valueMgdl: number;
  context: GlucoseContextType;
}

/**
 * Log a new glucose reading for a patient
 * @param patientId Patient UUID
 * @param request Glucose reading data
 * @returns The created glucose reading
 */
export async function logGlucoseReading(
  patientId: string,
  request: GlucoseLogRequest
): Promise<GlucoseReading> {
  return await post<GlucoseReading>(`/api/patients/${patientId}/glucose`, request);
}

/**
 * Get all glucose readings for a patient
 * @param patientId Patient UUID
 * @returns List of glucose readings
 */
export async function getGlucoseReadings(patientId: string): Promise<GlucoseReading[]> {
  // [FIX] Added timestamp query param to bypass browser caching
  const timestamp = new Date().getTime();
  return await get<GlucoseReading[]>(`/api/patients/${patientId}/glucose?t=${timestamp}`);
}
