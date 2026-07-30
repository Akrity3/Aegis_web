import axiosInstance from "./axios-instance";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export type IncidentCategory =
    | "Harassment"
    | "Road Accident"
    | "Theft / Robbery"
    | "Suspicious Activity"
    | "Natural Disaster"
    | "Fire Emergency"
    | "Unsafe Infrastructure / Road Hazard"
    | "Other";

export interface Incident {
    _id: string;
    userId: string;
    category: IncidentCategory;
    description: string;
    latitude: number;
    longitude: number;
    address?: string;
    photoUrl?: string;
    status: "pending" | "verified" | "rejected";
    reportedAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateIncidentPayload {
    category: IncidentCategory;
    description: string;
    latitude: number;
    longitude: number;
    address?: string;
    photo?: File;
}

export interface IncidentsResponse {
    success: boolean;
    data: Incident[];
    message?: string;
}

export interface IncidentResponse {
    success: boolean;
    data: Incident;
    message?: string;
}

// ─────────────────────────────────────────────
// API Functions
// ─────────────────────────────────────────────

/**
 * Get all incidents for the current user
 */
export async function getMyIncidents(): Promise<IncidentsResponse> {
    const response = await axiosInstance.get<IncidentsResponse>("/api/v1/incidents/my");
    return response.data;
}

/**
 * Create a new incident report
 */
export async function createIncident(data: CreateIncidentPayload): Promise<IncidentResponse> {
    const fd = new FormData();
    fd.append("category", data.category);
    fd.append("description", data.description);
    fd.append("latitude", data.latitude.toString());
    fd.append("longitude", data.longitude.toString());
    if (data.address) fd.append("address", data.address);
    if (data.photo) fd.append("photo", data.photo);

    const response = await axiosInstance.post<IncidentResponse>("/api/v1/incidents", fd, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
}

/**
 * Get public incidents (for safety map/feed)
 */
export async function getPublicIncidents(): Promise<IncidentsResponse> {
    const response = await axiosInstance.get<IncidentsResponse>("/api/v1/incidents/public");
    return response.data;
}
