import { get } from './client';

export interface EducationalResource {
  id: string;
  title: string;
  content: string;
  category: string;
  isActive: boolean;
  createdAt: string;
}

/**
 * Get active educational resources
 * @returns List of active educational resources
 */
export async function getEducationalResources(): Promise<EducationalResource[]> {
  return await get<EducationalResource[]>('/api/education/resources');
}
