import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

/**
 * Fetch the currently authenticated user's profile.
 * Relies on the httpOnly auth_token cookie being present.
 */
export const whoami = async () => {
    const response = await axiosInstance.get(API.AUTH.WHOAMI);
    return response.data;
};

/**
 * Update the authenticated user's profile.
 * Accepts a FormData object so the caller can attach a profilePicture file.
 */
export const updateProfile = async (formData: FormData) => {
    const response = await axiosInstance.post(API.AUTH.UPDATE, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};
