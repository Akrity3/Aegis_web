import axiosInstance from "./axios-instance";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export interface Alert {
    _id: string;
    userId: string;
    latitude: number;
    longitude: number;
    address?: string;
    status: "active" | "resolved";
    triggeredAt: string;
    resolvedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface TriggerAlertPayload {
    latitude: number;
    longitude: number;
    address?: string;
}

export interface ResolveAlertPayload {
    alertId: string;
}

export interface AlertsResponse {
    success: boolean;
    data: Alert[];
    message?: string;
}

export interface AlertResponse {
    success: boolean;
    data: Alert;
    message?: string;
}

export interface GenericResponse {
    success: boolean;
    message?: string;
}

// ─────────────────────────────────────────────
// API Functions
// ─────────────────────────────────────────────

/**
 * Get all alerts for the current user
 */
export async function getMyAlerts(): Promise<AlertsResponse> {
    const response = await axiosInstance.get<AlertsResponse>("/api/v1/alerts/my");
    return response.data;
}

/**
 * Trigger a new SOS alert
 */
export async function triggerAlert(data: TriggerAlertPayload): Promise<AlertResponse> {
    const response = await axiosInstance.post<AlertResponse>("/api/v1/alerts/trigger", data);
    return response.data;
}

/**
 * Resolve an active alert
 */
export async function resolveAlert(alertId: string): Promise<GenericResponse> {
    const response = await axiosInstance.put<GenericResponse>(`/api/v1/alerts/resolve/${alertId}`);
    return response.data;
}
