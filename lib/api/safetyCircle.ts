import axiosInstance from "./axios-instance";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export interface SafetyCircleMember {
    _id: string;
    userId: string;
    contactId: {
        _id: string;
        name: string;
        phoneNumber: string;
        relation: string;
        isPrimary: boolean;
    };
    status: "active" | "inactive" | "pending";
    lastLocation?: {
        latitude: number;
        longitude: number;
        updatedAt: string;
    };
    lastSeen?: string;
    createdAt: string;
    updatedAt: string;
}

export interface SafetyCircleResponse {
    success: boolean;
    data: SafetyCircleMember[];
    message?: string;
}

export interface SafetyCircleMemberResponse {
    success: boolean;
    data: SafetyCircleMember;
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
 * Get all safety circle members
 */
export async function getSafetyCircle(): Promise<SafetyCircleResponse> {
    const response = await axiosInstance.get<SafetyCircleResponse>("/api/v1/safety-circle");
    return response.data;
}

/**
 * Add a contact to safety circle
 */
export async function addToSafetyCircle(contactId: string): Promise<SafetyCircleMemberResponse> {
    const response = await axiosInstance.post<SafetyCircleMemberResponse>("/api/v1/safety-circle", {
        contactId,
    });
    return response.data;
}

/**
 * Update safety circle member status
 */
export async function updateSafetyCircleStatus(
    circleId: string,
    status: "active" | "inactive" | "pending"
): Promise<SafetyCircleMemberResponse> {
    const response = await axiosInstance.put<SafetyCircleMemberResponse>(
        `/api/v1/safety-circle/${circleId}/status`,
        { status }
    );
    return response.data;
}

/**
 * Update safety circle member location
 */
export async function updateSafetyCircleLocation(
    circleId: string,
    latitude: number,
    longitude: number
): Promise<SafetyCircleMemberResponse> {
    const response = await axiosInstance.put<SafetyCircleMemberResponse>(
        `/api/v1/safety-circle/${circleId}/location`,
        { latitude, longitude }
    );
    return response.data;
}

/**
 * Remove contact from safety circle
 */
export async function removeFromSafetyCircle(circleId: string): Promise<GenericResponse> {
    const response = await axiosInstance.delete<GenericResponse>(
        `/api/v1/safety-circle/${circleId}`
    );
    return response.data;
}
