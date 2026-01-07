import apiService from './api.service';
import { type Project} from '../schemas/projects';

const PROJECTS_ENDPOINT = '/api/projects';

export interface PaginatedResult<T> {
    data: T[];
    totalRecords: number;
    pageNumber: number;
    pageSize: number;
}

/**
 * Get paginated list of projects with optional filtering
 * @param page number of page
 * @param pageSize number of records per page
 * @param filter string to filter projects by name
 * @returns {Promise<PaginatedResult<Project>>} paginated list of projects
 */
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

/**
 * Get all active projects (role checking: Admin/Manager)
 * @returns {Promise<Project[]>} array of projects
 */
// GET /api/projects/all (select project page ολα τα project με role checking. Μονο admin, manager.
export async function getAllProjects(): Promise<Project[]> {
    const response = await apiService.get<Project[]>(`${PROJECTS_ENDPOINT}/all`);
    return response.data;
}

/**
 * Get project by id
 * @param id Project id
 * @returns {Promise<Project>} project detailed data
 */
// GET /api/projects/:id για ενα project (management console)
export async function getAllProjectById(id: number): Promise<Project>  {
    const response = await apiService.get<Project>(`${PROJECTS_ENDPOINT}/${id}`);
    return response.data;
}

/**
 * Create a new project
 * @param projectData Project data excluding id and jobsCount
 * @returns {Promise<Project>} created project with assigned id
 */
// POST /api/projects
export async function createProject(projectData: Omit<Project,"id" | "jobsCount">): Promise<Project>{
    const response = await apiService.post<Project>(PROJECTS_ENDPOINT, projectData);
    return response.data;

}

/**
 * Update an existing project
 * @param id Project id
 * @param data Project data excluding id and jobsCount
 * @returns {Promise<Project>} updated project
 */
// PUT /api/projects/:id update
export async function updateProject(id: number, data:Omit<Project,"id" | "jobsCount">): Promise<Project> {
    const response = await apiService.put<Project>(`${PROJECTS_ENDPOINT}/${id}`,data);
    return response.data;
}

/**
 * Delete a project by id
 * @param id Project id
 * @returns {Promise<void>}
 */
// DELETE /api/projects/:id
export async function deleteProject(id: number): Promise<void> {
    await apiService.delete(`${PROJECTS_ENDPOINT}/${id}`);
}

/**
 * Get GeoJSON data for all Conversion Jobs within a project (GeoServer WFS).
 * @param id Project id
 * @returns {Promise<GeoJSON.FeatureCollection>} GeoJSON data
 */
//GET PROJECT-JOBS ΑΠΟ GEOSERVER /api/projects/{id}/jobs
export async function getProjectGeoserverJobs(id:number): Promise<GeoJSON.FeatureCollection>{
    const response = await apiService.get<GeoJSON.FeatureCollection>(`${PROJECTS_ENDPOINT}/${id}/conversion-jobs`);
    return response.data;
}

/**
 * Download a Shapefile(zip) containing all Conversion Jobs for a project.
 * @param id Project id
 * @returns {Promise<Blob>} Shapefile in zip format
 */
//GET GEOSERVER SHP EXPORT /api/{id}/shapefile
export async function exportSHPProjectGeoserverJobs(id:number): Promise<Blob>{
    const response = await apiService.get(`${PROJECTS_ENDPOINT}/${id}/conversion-jobs/shp`,{responseType: 'blob'})
    return response.data;

}