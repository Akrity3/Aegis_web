"use server";

import { cookies } from "next/headers";

const TOKEN_KEY = "auth_token";

export async function setTokenCookie(token: string) {
    const cookieStore = await cookies();
    cookieStore.set({
        name: TOKEN_KEY,
        value: token,
        httpOnly: true,
        sameSite: "lax",
        path: "/",
    });
}

export async function getTokenCookie() {
    const cookieStore = await cookies();
    return cookieStore.get(TOKEN_KEY)?.value;
}

export async function storeUserData(userData: Record<string, unknown>) {
    const cookieStore = await cookies();
    cookieStore.set({
        name: "user_data",
        value: JSON.stringify(userData),
        httpOnly: false, // Allow client-side access for AuthContext
        sameSite: "lax",
        path: "/",
    });
}

export async function getUserData() {
    const cookieStore = await cookies();
    const userDataCookie = cookieStore.get("user_data")?.value;
    return userDataCookie ? JSON.parse(userDataCookie) : null;
}

export async function clearAuthCookies() {
    const cookieStore = await cookies();
    cookieStore.delete(TOKEN_KEY);
    cookieStore.delete("user_data");
}
