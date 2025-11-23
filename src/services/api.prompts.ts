import apiService from './api.service';
import { type Prompt } from '../schemas/prompts';

const PROMPTS_ENDPOINT = '/api/prompts';

export interface PaginatedResult<T> {
    data: T[];
    totalRecords: number;
    pageNumber: number;
    pageSize: number;
}

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

// GET /api/prompts/all
export async function getPrompts(): Promise<Prompt[]> {
    const response = await apiService.get<Prompt[]>(`${PROMPTS_ENDPOINT}/all`);
    return response.data;
}

// GET /api/prompts/:id για ενα prompt
export async function getPromptById(id: number): Promise<Prompt>  {
    const response = await apiService.get<Prompt>(`${PROMPTS_ENDPOINT}/${id}`);
    return response.data;
}

// POST /api/prompts
export async function createPrompt(promptData: Omit<Prompt, 'id'>): Promise<Prompt>{
    const response = await apiService.post<Prompt>(PROMPTS_ENDPOINT, promptData);
    return response.data;

}

// PUT /api/prompts/:id update
export async function updatePrompt(id: number, data:Partial<Omit<Prompt,'id'>>): Promise<Prompt> {
    const response = await apiService.put<Prompt>(`${PROMPTS_ENDPOINT}/${id}`,data);
    return response.data;
}

// DELETE /api/prompts/:id
export async function deletePrompt(id: number): Promise<void> {
    await apiService.delete(`${PROMPTS_ENDPOINT}/${id}`);
}