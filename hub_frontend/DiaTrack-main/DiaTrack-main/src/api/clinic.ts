import { get, put } from './client';

export interface ClinicDetails {
  id: string;
  clinicianId: string;
  clinicName: string;
  address: string;
  scheduleDays: string;
  scheduleHours: string;
  contactPerson: string;
  contactPhone: string;
  updatedAt: string;
}

export interface ClinicDetailsRequest {
  clinicName: string;
  address: string;
  scheduleDays: string;
  scheduleHours: string;
  contactPerson: string;
  contactPhone: string;
}

/**
 * Get clinic details for the current clinician
 * @returns Clinic details
 */
export async function getMyClinicDetails(): Promise<ClinicDetails> {
  return await get<ClinicDetails>('/api/clinics/my-details');
}

/**
 * Update clinic details for the current clinician
 * @param request Updated clinic details
 * @returns Updated clinic details
 */
export async function updateMyClinicDetails(request: ClinicDetailsRequest): Promise<ClinicDetails> {
  return await put<ClinicDetails>('/api/clinics/my-details', request);
}

/**
 * Get clinic details for a specific clinician
 * @param clinicianId Clinician UUID
 * @returns Clinic details
 */
export async function getClinicianDetails(clinicianId: string): Promise<ClinicDetails> {
  return await get<ClinicDetails>(`/api/clinics/clinician/${clinicianId}`);
}
