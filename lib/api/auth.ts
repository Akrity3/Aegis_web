import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export type RegisterPayload = {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phoneNumber: string;
    password: string;
};

export type LoginPayload = {
    email: string;
    password: string;
};

export type GoogleLoginPayload = {
    idToken: string;
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

export const googleLogin = async (data: GoogleLoginPayload) => {
    try {
        const response = await axiosInstance.post(API.AUTH.GOOGLE, data);
        return response.data;
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        throw new Error(err?.response?.data?.message || "Google authentication failed");
    }
};

export const refreshToken = async (refreshToken: string) => {
    try {
        const response = await axiosInstance.post(API.AUTH.REFRESH, { refreshToken });
        return response.data;
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        throw new Error(err?.response?.data?.message || "Token refresh failed");
    }
};

export const logout = async () => {
    try {
        const response = await axiosInstance.post(API.AUTH.LOGOUT);
        return response.data;
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        throw new Error(err?.response?.data?.message || "Logout failed");
    }
};

export const sendVerificationEmail = async (email: string) => {
    try {
        const response = await axiosInstance.post(API.AUTH.SEND_VERIFICATION, { email });
        return response.data;
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        throw new Error(err?.response?.data?.message || "Failed to send verification email");
    }
};

export const verifyEmail = async (token: string) => {
    try {
        const response = await axiosInstance.post(API.AUTH.VERIFY_EMAIL, { token });
        return response.data;
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        throw new Error(err?.response?.data?.message || "Failed to verify email");
    }
};
