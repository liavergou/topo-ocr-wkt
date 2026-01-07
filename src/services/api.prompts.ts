import apiService from './api.service';
import { type Prompt } from '../schemas/prompts';

const PROMPTS_ENDPOINT = '/api/prompts';

export interface PaginatedResult<T> {
    data: T[];
    totalRecords: number;
    pageNumber: number;
    pageSize: number;
}

/**
 * Get paginated list of prompts with optional filtering
 * @param page number of page
 * @param pageSize number of records per page
 * @param filter string to filter prompts by name
 * @returns {Promise<PaginatedResult<Project>>} paginated list of prompts
 */
// GET /api/prompts?pageNumber=1&pageSize=10 Paginated
export const getPaginatedPrompts = async (page: number, pageSize: number, filter?:string):
    Promise<PaginatedResult<Prompt>> => {
    const response = await apiService.get<PaginatedResult<Prompt>>(PROMPTS_ENDPOINT, {
        params: {
            pageNumber: page,
            pageSize: pageSize,
            promptName:filter,
        },
    });
    return response.data
};

/**
 * Get all active prompts (role checking: Admin/Manager)
 * @returns {Promise<Project[]>} array of prompts
 */
// GET /api/prompts/all
export async function getPrompts(): Promise<Prompt[]> {
    const response = await apiService.get<Prompt[]>(`${PROMPTS_ENDPOINT}/all`);
    return response.data;
}

/**
 * Get prompt by id
 * @param id prompt id
 * @returns {Promise<Prompt>} prompt detailed data
 */
// GET /api/prompts/:id για ενα prompt
export async function getPromptById(id: number): Promise<Prompt>  {
    const response = await apiService.get<Prompt>(`${PROMPTS_ENDPOINT}/${id}`);
    return response.data;
}

/**
 * Create a new prompt
 * @param promptData Prompt data excluding id and jobsCount
 * @returns {Promise<Prompt>} created prompt with assigned id
 */
// POST /api/prompts
export async function createPrompt(promptData: Omit<Prompt, 'id'>): Promise<Prompt>{
    const response = await apiService.post<Prompt>(PROMPTS_ENDPOINT, promptData);
    return response.data;

}

/**
 * Update existing prompt
 * @param id - prompt id
 * @param data - Updated prompt data (partial)
 * @returns Updated prompt
 */
// PUT /api/prompts/:id update
export async function updatePrompt(id: number, data:Partial<Omit<Prompt,'id'>>): Promise<Prompt> {
    const response = await apiService.put<Prompt>(`${PROMPTS_ENDPOINT}/${id}`,data);
    return response.data;
}

/**
 * Delete prompt by id
 * @param id - Prompt id
 * @returns {Promise<void>}
 */
// DELETE /api/prompts/:id
export async function deletePrompt(id: number): Promise<void> {
    await apiService.delete(`${PROMPTS_ENDPOINT}/${id}`);
}