import { get, post, put, del } from './client';

export interface PatientClinicianLink {
  id: string;
  patientId: string;
  clinicianId: string;
  patientName: string;
  patientEmail: string;
  linkedAt: string;
  nextAppointmentAt?: string;
}

export interface ClinicianNote {
  id: string;
  patientClinicianLinkId: string;
  noteText: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClinicianNoteRequest {
  noteText: string;
}

/**
 * Get all patients linked to a clinician
 * @param clinicianId Clinician UUID
 * @returns List of patient-clinician links
 */
export async function getClinicianPatients(clinicianId: string): Promise<PatientClinicianLink[]> {
  return await get<PatientClinicianLink[]>(`/api/links/clinicians/${clinicianId}`);
}

/**
 * Get notes for a patient-clinician link
 * @param linkId Patient-Clinician link UUID
 * @returns List of clinician notes
 */
export async function getClinicianNotes(linkId: string): Promise<ClinicianNote[]> {
  return await get<ClinicianNote[]>(`/api/notes/link/${linkId}`);
}

/**
 * Create a note for a patient
 * @param linkId Patient-Clinician link UUID
 * @param request Note data
 * @returns Created note
 */
export async function createClinicianNote(linkId: string, request: ClinicianNoteRequest): Promise<ClinicianNote> {
  return await post<ClinicianNote>(`/api/notes/link/${linkId}`, request);
}

/**
 * Update a clinician note
 * @param noteId Note UUID
 * @param request Updated note data
 * @returns Updated note
 */
export async function updateClinicianNote(noteId: string, request: ClinicianNoteRequest): Promise<ClinicianNote> {
  return await put<ClinicianNote>(`/api/notes/${noteId}`, request);
}

/**
 * Delete a clinician note
 * @param noteId Note UUID
 */
export async function deleteClinicianNote(noteId: string): Promise<void> {
  return await del(`/api/notes/${noteId}`);
}

/**
 * Create a link between a patient and clinician
 * @param patientId Patient UUID
 * @param clinicianId Clinician UUID
 * @returns Created patient-clinician link
 */
export async function createPatientClinicianLink(patientId: string, clinicianId: string): Promise<PatientClinicianLink> {
  return await post<PatientClinicianLink>('/api/links/patient-clinician', { patientId, clinicianId });
}

/**
 * Update next appointment for a patient-clinician link
 * @param linkId Patient-Clinician link UUID
 * @param nextAppointmentAt ISO 8601 date string for next appointment
 * @returns Updated patient-clinician link
 */
export async function updateNextAppointment(linkId: string, nextAppointmentAt: string): Promise<PatientClinicianLink> {
  return await put<PatientClinicianLink>(`/api/links/${linkId}/appointment`, { nextAppointmentAt });
}
