"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axiosInstance from "@/lib/api/axios-instance";
import { clearAuthCookies } from "@/lib/cookies";
import { useRouter } from "next/navigation";

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────

export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    fullName?: string;
    email: string;
    username: string;
    role: string;
    phoneNumber?: string;
    gender?: string;
    profilePicture?: string;
    createdAt?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    /**
     * Monotonically increasing counter. Increments whenever user data
     * updates. Append as `?v={picVersion}` to avatar URLs to bust
     * browser image cache across all components simultaneously.
     */
    picVersion: number;
    login: (token: string, userData: User) => void;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    /** Optimistically update local user state after a successful profile update */
    updateUser: (updatedUser: Partial<User>) => void;
}

// ────────────────────────────────────────────────────────────
// Helper: build an avatar URL with cache-busting
// ────────────────────────────────────────────────────────────

export function buildAvatarUrl(
    profilePicture: string | undefined | null,
    version: number
): string | null {
    if (!profilePicture || profilePicture === "default-profile.png") return null;
    return `/uploads/${profilePicture}?v=${version}`;
}

// ────────────────────────────────────────────────────────────
// Context
// ────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Returns true if the auth_token cookie exists in the browser. */
function hasAuthCookie(): boolean {
    if (typeof document === "undefined") return false;
    return document.cookie
        .split(";")
        .some((c) => c.trim().startsWith("auth_token="));
}

/** Read user_data from cookie on client side */
function getUserDataFromCookie(): User | null {
    if (typeof document === "undefined") return null;
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split("=");
        if (name === "user_data" && value) {
            try {
                return JSON.parse(decodeURIComponent(value));
            } catch {
                return null;
            }
        }
    }
    return null;
}

// ────────────────────────────────────────────────────────────
// Provider
// ────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser]           = useState<User | null>(null);
    const [loading, setLoading]     = useState(true);
    const [picVersion, setPicVersion] = useState(0);
    const router = useRouter();

    /** Re-fetch the logged-in user from the backend. */
    const refreshUser = useCallback(async () => {
        // First, try to read user data from cookie (set during login)
        const cookieUser = getUserDataFromCookie();
        if (cookieUser) {
            console.log("AuthContext: Read user from cookie:", cookieUser);
            setUser(cookieUser);
            setLoading(false);
            // Optionally refresh from API in background
            try {
                const res = await axiosInstance.get("/api/v1/auth/whoami");
                if (res.data?.success) {
                    console.log("AuthContext: Refreshed user from whoami:", res.data.data);
                    setUser(res.data.data);
                    setPicVersion((v) => v + 1);
                }
            } catch (err) {
                console.log("AuthContext: Whoami failed, keeping cookie data:", err);
            }
            return;
        }

        // No cookie data, try API
        if (!hasAuthCookie()) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const res = await axiosInstance.get("/api/v1/auth/whoami");
            if (res.data?.success) {
                console.log("AuthContext: Whoami response:", res.data.data);
                setUser(res.data.data);
                setPicVersion((v) => v + 1);
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
    }, [refreshUser]);

    const login = (token: string, userData: User) => {
        setUser(userData);
        setPicVersion((v) => v + 1);
        // Role-based redirection
        if (userData.role === "admin") {
            router.push("/admin");
        } else {
            router.push("/dashboard");
        }
    };

    const logout = async () => {
        try {
            await clearAuthCookies();
            setUser(null);
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    /**
     * Merge the full updated user object returned by the backend into
     * local state. Always bump picVersion so avatar URLs are cache-busted
     * across every component that calls buildAvatarUrl().
     */
    const updateUser = (updatedUser: Partial<User>) => {
        setUser((prev) => (prev ? { ...prev, ...updatedUser } : prev));
        setPicVersion((v) => v + 1);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                loading,
                picVersion,
                login,
                logout,
                refreshUser,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// ────────────────────────────────────────────────────────────
// Hook
// ────────────────────────────────────────────────────────────

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
