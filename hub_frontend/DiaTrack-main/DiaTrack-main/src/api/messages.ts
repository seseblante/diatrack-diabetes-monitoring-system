import { get, post } from './client';

export interface QuickMessage {
  id: string;
  patientClinicianLinkId: string;
  senderId: string;
  messageContent: string;
  status: string;
  createdAt: string;
  readAt: string | null;
}

export interface QuickMessageRequest {
  messageContent: string;
}

/**
 * Get messages for a patient-clinician link
 * @param linkId Patient-Clinician link UUID
 * @returns List of messages
 */
export async function getMessages(linkId: string): Promise<QuickMessage[]> {
  return await get<QuickMessage[]>(`/api/messages/link/${linkId}`);
}

/**
 * Mark messages as read for a patient
 * @param linkId Patient-Clinician link UUID
 * @returns Updated list of messages
 */
export async function markMessagesAsRead(linkId: string): Promise<QuickMessage[]> {
  return await post<QuickMessage[]>(`/api/messages/link/${linkId}/read`, {});
}

/**
 * Send a message to a patient (clinician only)
 * @param linkId Patient-Clinician link UUID
 * @param request Message data
 * @returns Created message
 */
export async function sendMessage(linkId: string, request: QuickMessageRequest): Promise<QuickMessage> {
  return await post<QuickMessage>(`/api/messages/link/${linkId}`, request);
}
