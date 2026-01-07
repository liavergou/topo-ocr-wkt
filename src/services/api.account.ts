import apiService from './api.service';
import { type Project } from '../schemas/projects';

/**
 * Service for managing the current user's assigned projects.
 * @returns list of assigned projects
 */
const ACCOUNT_ENDPOINT = '/api/account';

export async function getMyAssignedProjects():Promise<Project[]>{
    const response = await apiService.get<Project[]>(`${ACCOUNT_ENDPOINT}/projects`);
    return response.data;
}