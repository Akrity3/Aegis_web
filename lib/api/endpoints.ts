export const API = {
    AUTH: {
        REGISTER: "/api/v1/auth/register",
        LOGIN: "/api/v1/auth/login",
        WHOAMI: "/api/v1/auth/whoami",
        UPDATE: "/api/v1/auth/update",
    },
    ADMIN: {
        USERS: "/api/v1/admin/users",
        USER: (id: string) => `/api/v1/admin/users/${id}`,
        STATS: "/api/v1/admin/stats",
    },
};
