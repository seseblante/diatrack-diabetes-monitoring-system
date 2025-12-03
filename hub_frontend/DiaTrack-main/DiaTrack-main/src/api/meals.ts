import { get, post } from './client';

export interface Meal {
  id: string;
  patientId: string;
  loggedAt: string;
  description: string;
  carbsG?: number;
}

export interface MealLogRequest {
  loggedAt: string;
  description: string;
  carbsG?: number;
}

/**
 * Log a new meal for a patient
 * @param patientId Patient UUID
 * @param request Meal data
 * @returns The created meal log
 */
export async function logMeal(
  patientId: string,
  request: MealLogRequest
): Promise<Meal> {
  return await post<Meal>(`/api/patients/${patientId}/logs/meals`, request);
}

/**
 * Get all meal logs for a patient
 * @param patientId Patient UUID
 * @returns List of meal logs
 */
export async function getMealLogs(patientId: string): Promise<Meal[]> {
  return await get<Meal[]>(`/api/patients/${patientId}/logs/meals`);
}
