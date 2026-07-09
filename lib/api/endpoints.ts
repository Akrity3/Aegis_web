export const API = {
    AUTH: {
        REGISTER: "/api/v1/auth/register",
        LOGIN: "/api/v1/auth/login",
    },
    ADMIN: {
        USERS: "/api/v1/admin/users",
        USER: (id: string) => `/api/v1/admin/users/${id}`,
        STATS: "/api/v1/admin/stats",
    },
};
