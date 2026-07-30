import axiosInstance from "./axios-instance";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export type ActivityType =
    | "login"
    | "logout"
    | "profile_updated"
    | "password_changed"
    | "contact_added"
    | "contact_updated"
    | "contact_deleted"
    | "alert_triggered"
    | "alert_resolved"
    | "incident_reported"
    | "notification_read"
    | "settings_updated";

export interface Activity {
    _id: string;
    userId: string;
    type: ActivityType;
    description: string;
    metadata?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
    createdAt: string;
}

export interface ActivitiesResponse {
    success: boolean;
    data: Activity[];
    message?: string;
}

// ─────────────────────────────────────────────
// API Functions
// ─────────────────────────────────────────────

/**
 * Get all activities for the current user
 */
export async function getActivities(limit: number = 100): Promise<ActivitiesResponse> {
    const response = await axiosInstance.get<ActivitiesResponse>("/api/v1/activities", {
        params: { limit },
    });
    return response.data;
}

/**
 * Get activities filtered by type
 */
export async function getActivitiesByType(type: ActivityType, limit: number = 50): Promise<ActivitiesResponse> {
    const response = await axiosInstance.get<ActivitiesResponse>(`/api/v1/activities/type/${type}`, {
        params: { limit },
    });
    return response.data;
}

/**
 * Get activities within a date range
 */
export async function getActivitiesByDateRange(
    startDate: string,
    endDate: string,
    limit: number = 100
): Promise<ActivitiesResponse> {
    const response = await axiosInstance.get<ActivitiesResponse>("/api/v1/activities/date-range", {
        params: { startDate, endDate, limit },
    });
    return response.data;
}
