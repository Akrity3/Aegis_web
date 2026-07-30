import axiosInstance from "./axios-instance";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export type NotificationType =
    | "alert_triggered"
    | "alert_resolved"
    | "incident_reported"
    | "incident_verified"
    | "contact_added"
    | "profile_updated"
    | "password_changed"
    | "system";

export interface Notification {
    _id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
}

export interface NotificationsResponse {
    success: boolean;
    data: Notification[];
    message?: string;
}

export interface UnreadCountResponse {
    success: boolean;
    data: { count: number };
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
 * Get all notifications for the current user
 */
export async function getNotifications(limit: number = 50): Promise<NotificationsResponse> {
    const response = await axiosInstance.get<NotificationsResponse>("/api/v1/notifications", {
        params: { limit },
    });
    return response.data;
}

/**
 * Get unread notifications count
 */
export async function getUnreadCount(): Promise<UnreadCountResponse> {
    const response = await axiosInstance.get<UnreadCountResponse>("/api/v1/notifications/unread-count");
    return response.data;
}

/**
 * Mark notifications as read
 */
export async function markAsRead(notificationIds: string[]): Promise<GenericResponse> {
    const response = await axiosInstance.put<GenericResponse>("/api/v1/notifications/mark-read", {
        notificationIds,
    });
    return response.data;
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(): Promise<GenericResponse> {
    const response = await axiosInstance.put<GenericResponse>("/api/v1/notifications/mark-all-read");
    return response.data;
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string): Promise<GenericResponse> {
    const response = await axiosInstance.delete<GenericResponse>(
        `/api/v1/notifications/${notificationId}`
    );
    return response.data;
}
