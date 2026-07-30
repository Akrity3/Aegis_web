import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

// Types

export interface AdminUser {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    role: "admin" | "user";
    status: "active" | "inactive";
    phoneNumber?: string;
    gender?: string;
    profilePicture?: string;
    createdAt?: string;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface AdminUsersResponse {
    success: boolean;
    message: string;
    data: AdminUser[];
    meta: PaginationMeta;
}

export interface AdminUserResponse {
    success: boolean;
    message: string;
    data: AdminUser;
}

export interface CreateUserPayload {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    role?: "admin" | "user";
    status?: "active" | "inactive";
    phoneNumber?: string;
    gender?: string;
}

export interface UpdateUserPayload {
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    password?: string;
    role?: "admin" | "user";
    status?: "active" | "inactive";
    phoneNumber?: string;
    gender?: string;
}

// API Functions

/**
 * Fetch a paginated, searchable list of all users (admin only).
 */
export const getAdminUsers = async (
    page: number = 1,
    limit: number = 10,
    search?: string
): Promise<AdminUsersResponse> => {
    const params: Record<string, string | number> = { page, limit };
    if (search && search.trim()) params.search = search.trim();
    const response = await axiosInstance.get(API.ADMIN.USERS, { params });
    return response.data;
};


// Fetch a single user by ID (admin only).

export const getAdminUser = async (id: string): Promise<AdminUserResponse> => {
    const response = await axiosInstance.get(API.ADMIN.USER(id));
    return response.data;
};


//Create a new user (admin only).

export const createAdminUser = async (
    payload: CreateUserPayload
): Promise<AdminUserResponse> => {
    const response = await axiosInstance.post(API.ADMIN.USERS, payload);
    return response.data;
};


// Update an existing user (admin only).
// Password is only updated when explicitly included in the payload.
 
export const updateAdminUser = async (
    id: string,
    payload: UpdateUserPayload
): Promise<AdminUserResponse> => {
    const response = await axiosInstance.patch(API.ADMIN.USER(id), payload);
    return response.data;
};

// Delete a user by ID (admin only).

export const deleteAdminUser = async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.delete(API.ADMIN.USER(id));
    return response.data;
};
