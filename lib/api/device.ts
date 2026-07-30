import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

// Types

export interface Device {
    _id: string;
    userId: string;
    token: string;
    platform: "ios" | "android" | "web";
    deviceName?: string;
    createdAt: string;
    updatedAt: string;
}

export interface RegisterDevicePayload {
    token: string;
    platform: "ios" | "android" | "web";
    deviceName?: string;
}

export interface RemoveDevicePayload {
    deviceId: string;
}

export interface DevicesResponse {
    success: boolean;
    data: Device[];
    message?: string;
}

export interface DeviceResponse {
    success: boolean;
    data: Device;
    message?: string;
}

export interface GenericResponse {
    success: boolean;
    message?: string;
}

// API Functions

/**
 * Register a device for push notifications
 */
export async function registerDevice(data: RegisterDevicePayload): Promise<DeviceResponse> {
    const response = await axiosInstance.post<DeviceResponse>(API.DEVICES.REGISTER, data);
    return response.data;
}

/**
 * Get all devices for the authenticated user
 */
export async function getMyDevices(): Promise<DevicesResponse> {
    const response = await axiosInstance.get<DevicesResponse>(API.DEVICES.LIST);
    return response.data;
}

/**
 * Remove a device from the user's account
 */
export async function removeDevice(data: RemoveDevicePayload): Promise<GenericResponse> {
    const response = await axiosInstance.delete<GenericResponse>(API.DEVICES.REMOVE, { data });
    return response.data;
}
