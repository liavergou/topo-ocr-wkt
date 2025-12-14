// API calls για User Management
// Backend: UserController.cs endpoints

import apiService from '@/services/api.service';
import type {User, UserProjects} from '@/types';
import type { UserCreate, UserUpdate } from '@/schemas/users';

const USERS_ENDPOINT = '/api/users';

// Pagination Response Type
export interface PaginatedResponse<T> {
    data: T[];
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
}


// GET /api/users
export async function getUsers(): Promise<User[]> {
    const response = await apiService.get<User[]>(USERS_ENDPOINT);
    return response.data;
}


// GET /api/users?pageNumber=1&pageSize=10 Paginated
export async function getUsersPaginated (
    pageNumber: number = 1,
    pageSize: number = 10
): Promise<PaginatedResponse<User>>{
    const response = await apiService.get<PaginatedResponse<User>>(`${USERS_ENDPOINT}/paginated`,
        {params: { pageNumber, pageSize }
    });
    return response.data;
}


// GET /api/users/:id για εναν χρήστη
export async function getUser(id: number): Promise<User>  {
    const response = await apiService.get<User>(`${USERS_ENDPOINT}/${id}`);
    return response.data;
}


// POST /api/users (create user στο keycloak, αναθεση role, αποθηκευση βαση με keycloakId)

export async function createUser(userData: UserCreate): Promise<User>  {
    const response = await apiService.post<User>(USERS_ENDPOINT, userData);
    return response.data;
}

// PUT /api/users/:id update μονο email, firstname, lastname, role
export async function updateUser(id: number, userData: UserUpdate): Promise<User> {
    const response = await apiService.put<User>(`${USERS_ENDPOINT}/${id}`, userData);
    return response.data;
}


// DELETE /api/users/:id
export async function deleteUser(id: number): Promise<void> {
    await apiService.delete(`${USERS_ENDPOINT}/${id}`);
}

//user get assigned projects (user management console)
// GET /api/users/:id/projects
export async function getUserProjects(id: number): Promise<UserProjects> {
    const response = await apiService.get<UserProjects>(`${USERS_ENDPOINT}/${id}/projects`);
    return response.data
}
//user update assigned projects (user management console)
// PUT /api/users/:id/projects
export async function updateUserProjects(id: number, data: UserProjects): Promise<UserProjects> {
    const response = await apiService.put<UserProjects>(`${USERS_ENDPOINT}/${id}/projects`,data )
    return response.data;
}