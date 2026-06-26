"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "@/lib/api/axios-instance";
import { clearAuthCookies } from "@/lib/cookies";
import { useRouter } from "next/navigation";

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
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (token: string, userData: User) => void;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const refreshUser = async () => {
        try {
            const res = await axiosInstance.get("/api/v1/auth/whoami");
            if (res.data && res.data.success) {
                setUser(res.data.data);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Failed to fetch whoami:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const login = (token: string, userData: User) => {
        setUser(userData);
        router.push("/dashboard");
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

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                loading,
                login,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
