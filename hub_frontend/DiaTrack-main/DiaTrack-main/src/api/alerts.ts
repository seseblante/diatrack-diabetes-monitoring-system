import { get, post } from './client';

export interface Alert {
  id: string;
  patientId: string;
  type: string;
  detectedAt: string;
  status: string;
  acknowledgedAt?: string;
  notes?: string;
}

/**
 * Get open alerts for a patient
 * @param patientId Patient UUID
 * @returns List of open alerts
 */
export async function getAlerts(patientId: string): Promise<Alert[]> {
  return await get<Alert[]>(`/api/alerts/patient/${patientId}`);
}

/**
 * Acknowledge an alert
 * @param alertId Alert UUID
 * @returns Updated alert
 */
export async function acknowledgeAlert(alertId: string): Promise<Alert> {
  return await post<Alert>(`/api/alerts/${alertId}/acknowledge`, {});
}
