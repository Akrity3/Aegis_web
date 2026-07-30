"use server";

import { LoginFormValues, RegisterFormValues } from "@/app/(auth)/_components/schema";
import { googleLogin, login, register } from "@/lib/api/auth";
import { setTokenCookie, storeUserData } from "@/lib/cookies";

export const handleRegisterUser = async (data: RegisterFormValues) => {
    try {
        const result = await register({
            firstName: data.firstName,
            lastName: data.lastName,
            username: data.username,
            email: data.email,
            phoneNumber: data.phoneNumber,
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
            // Backend returns { success, token, data } — not result.user
            const user = result.data;
            const token = result.token;
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

export const handleGoogleLoginUser = async (idToken: string) => {
    try {
        const result = await googleLogin({ idToken });

        // Existing user login
        if (result?.success && !result?.isNewUser) {
            const user = result.data;
            const token = result.token;

            if (token) {
                await setTokenCookie(token);
            }
            if (user) {
                await storeUserData(user);
            }

            return {
                success: true,
                isNewUser: false,
                data: user,
                token,
            };
        }

        // New user: return Google profile to prefill registration
        if (result?.success && result?.isNewUser) {
            return {
                success: true,
                isNewUser: true,
                googleProfile: result.googleProfile,
            };
        }

        return {
            success: false,
            message: result?.message || "Google authentication failed",
        };
    } catch (error: unknown) {
        const err = error as { message?: string };
        return {
            success: false,
            message: err?.message || "Google authentication failed",
        };
    }
};
