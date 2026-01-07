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

/**
 * Get all users
 * @returns Array of all users
 */
// GET /api/users
export async function getUsers(): Promise<User[]> {
    const response = await apiService.get<User[]>(USERS_ENDPOINT);
    return response.data;
}

/**
 * Get paginated list of users
 * @param pageNumber - Page number (default: 1)
 * @param pageSize - Page size (default: 10)
 * @returns Paginated users with metadata
 */
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

/**
 * Get user details by id
 * @param id - User id
 * @returns User with details
 */
// GET /api/users/:id για εναν χρήστη
export async function getUser(id: number): Promise<User>  {
    const response = await apiService.get<User>(`${USERS_ENDPOINT}/${id}`);
    return response.data;
}


/**
 * Create new user in Keycloak and database
 * @param userData - User data with username, email, password, role
 * @returns Created user with assigned id and Keycloak id
 */
// POST /api/users (create user στο keycloak, αναθεση role, αποθηκευση βαση με keycloakId)
export async function createUser(userData: UserCreate): Promise<User>  {
    const response = await apiService.post<User>(USERS_ENDPOINT, userData);
    return response.data;
}

/**
 * Update user details (email, firstname, lastname, role)
 * @param id - User id
 * @param userData - Updated user data
 * @returns Updated user
 */
// PUT /api/users/:id update μονο email, firstname, lastname, role
export async function updateUser(id: number, userData: UserUpdate): Promise<User> {
    const response = await apiService.put<User>(`${USERS_ENDPOINT}/${id}`, userData);
    return response.data;
}

/**
 * Delete user from Keycloak and database
 * @param id - User id
 */
// DELETE /api/users/:id
export async function deleteUser(id: number): Promise<void> {
    await apiService.delete(`${USERS_ENDPOINT}/${id}`);
}

/**
 * Get projects assigned to user
 * @param id - User id
 * @returns User's assigned projects
 */
//user get assigned projects (user management console)
// GET /api/users/:id/projects
export async function getUserProjects(id: number): Promise<UserProjects> {
    const response = await apiService.get<UserProjects>(`${USERS_ENDPOINT}/${id}/projects`);
    return response.data
}

/**
 * Update projects assigned to user
 * @param id - User id
 * @param data - Updated project assignments
 * @returns Updated user projects
 */
//user update assigned projects (user management console)
// PUT /api/users/:id/projects
export async function updateUserProjects(id: number, data: UserProjects): Promise<UserProjects> {
    const response = await apiService.put<UserProjects>(`${USERS_ENDPOINT}/${id}/projects`,data )
    return response.data;
}