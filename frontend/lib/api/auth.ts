import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export type RegisterPayload = {
    fullName: string;
    email: string;
    password: string;
};

export type LoginPayload = {
    email: string;
    password: string;
};

export const register = async (data: RegisterPayload) => {
    try {
        const response = await axiosInstance.post(API.AUTH.REGISTER, data);
        return response.data;
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        throw new Error(
            err?.response?.data?.message || "Registration failed"
        );
    }
};

export const login = async (data: LoginPayload) => {
    try {
        const response = await axiosInstance.post(API.AUTH.LOGIN, data);
        return response.data;
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        throw new Error(err?.response?.data?.message || "Login failed");
    }
};
