import { get, put } from './client';

export interface PatientDetail {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  isActive: boolean;
  dob: string; // ISO date string
  sex: string;
  timezone: string;
}

export interface PatientUpdateRequest {
  fullName?: string;
  phone?: string;
  dob?: string;
  sex?: string;
  timezone?: string;
}

export interface PatientClinicianLink {
  id: string;
  patientId: string;
  clinicianId: string;
  clinicianName: string;
  clinicianEmail: string;
  linkedAt: string;
}

/**
 * Get current user profile
 * @returns Current user details
 */
export async function getCurrentUserProfile(): Promise<PatientDetail> {
  return await get<PatientDetail>('/api/auth/me');
}

/**
 * Get clinicians linked to a patient
 * @param patientId Patient UUID
 * @returns List of patient-clinician links
 */
export async function getPatientClinicians(patientId: string): Promise<PatientClinicianLink[]> {
  return await get<PatientClinicianLink[]>(`/api/links/patients/${patientId}`);
}

/**
 * Get patient profile by ID
 * @param patientId Patient UUID
 * @returns Patient details
 */
export async function getPatientProfile(patientId: string): Promise<PatientDetail> {
  return await get<PatientDetail>(`/api/patients/${patientId}`);
}

/**
 * Update patient profile
 * @param patientId Patient UUID
 * @param updates Patient profile updates
 * @returns Updated patient details
 */
export async function updatePatientProfile(patientId: string, updates: PatientUpdateRequest): Promise<PatientDetail> {
  return await put<PatientDetail>(`/api/patients/${patientId}`, updates);
}

/**
 * Search for patients by email or name
 * @param query Search query string
 * @returns List of matching patients
 */
export async function searchPatients(query: string): Promise<PatientDetail[]> {
  return await get<PatientDetail[]>(`/api/users/search?query=${encodeURIComponent(query)}`);
}
