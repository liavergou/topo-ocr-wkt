
import apiService from './api.service';
import { type Project } from '../schemas/projects';

const PROJECTS_ENDPOINT = '/api/projects';

export interface PaginatedResult<T> {
    data: T[];
    totalRecords: number;
    pageNumber: number;
    pageSize: number;
}

// GET /api/projects?pageNumber=1&pageSize=10 Paginated
export const getPaginatedProjects = async (page: number, pageSize: number, filter?:string): Promise<PaginatedResult<Project>> => {
    const response = await apiService.get<PaginatedResult<Project>>(PROJECTS_ENDPOINT, {
        params: {
            pageNumber: page,
            pageSize: pageSize,
            projectName:filter,
        },
    });
    return response.data
};

// GET /api/projects/all
export async function getProjects(): Promise<Project[]> {
    const response = await apiService.get<Project[]>(`${PROJECTS_ENDPOINT}/all`);
    return response.data;
}

// GET /api/projects/:id για ενα project
export async function getProjectById(id: number): Promise<Project>  {
    const response = await apiService.get<Project>(`${PROJECTS_ENDPOINT}/${id}`);
    return response.data;
}

// POST /api/projects
export async function createProject(projectData: Omit<Project, 'id'>): Promise<Project>{
    const response = await apiService.post<Project>(PROJECTS_ENDPOINT, projectData);
    return response.data;

}

// PUT /api/projects/:id update
export async function updateProject(id: number, data:Partial<Omit<Project,'id'>>): Promise<Project> {
    const response = await apiService.put<Project>(`${PROJECTS_ENDPOINT}/${id}`,data);
    return response.data;
}

// DELETE /api/projects/:id
export async function deleteProject(id: number): Promise<void> {
    await apiService.delete(`${PROJECTS_ENDPOINT}/${id}`);
}