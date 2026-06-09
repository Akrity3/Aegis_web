"use server";

import { LoginFormValues, RegisterFormValues } from "@/app/(auth)/_components/schema";
import { login, register } from "@/lib/api/auth";
import { setTokenCookie, storeUserData } from "@/lib/cookies";

export const handleRegisterUser = async (data: RegisterFormValues) => {
    try {
        const result = await register({
            fullName: data.fullName,
            email: data.email,
            password: data.password,
        });

        if (result.success) {
            return {
                success: true,
                message: result.message,
                data: result.data,
            };
        }

        return {
            success: false,
            message: result.message || "Registration failed",
        };
    } catch (error: unknown) {
        const err = error as { message?: string };
        return {
            success: false,
            message: err?.message || "Registration failed",
        };
    }
};

export const handleLoginUser = async (data: LoginFormValues) => {
    try {
        const result = await login(data);

        if (result.success) {
            const user = result.data.user;
            const token = result.data.token;
            await setTokenCookie(token);
            await storeUserData(user);

            return {
                success: true,
                message: result.message,
                data: result.data,
            };
        }

        return {
            success: false,
            message: result.message || "Login failed",
        };
    } catch (error: unknown) {
        const err = error as { message?: string };
        return {
            success: false,
            message: err?.message || "Login failed",
        };
    }
};
