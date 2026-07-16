import axiosInstance from "./axios-instance";

// Types

export interface Contact {
    _id: string;
    userId: string;
    name: string;
    phoneNumber: string;
    relation: string;
    isPrimary: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateContactPayload {
    name: string;
    phoneNumber: string;
    relation?: string;
    isPrimary?: boolean;
}

export interface UpdateContactPayload {
    name?: string;
    phoneNumber?: string;
    relation?: string;
    isPrimary?: boolean;
}

export interface ContactsResponse {
    success: boolean;
    data: Contact[];
}

export interface ContactResponse {
    success: boolean;
    data: Contact;
}

export interface DeleteContactResponse {
    success: boolean;
    message: string;
}

// API Functions

/**
 * Fetch all contacts for the authenticated user.
 */
export const getContacts = async (): Promise<ContactsResponse> => {
    const response = await axiosInstance.get("/api/v1/contacts");
    return response.data;
};

/**
 * Add a new emergency contact.
 */
export const addContact = async (payload: CreateContactPayload): Promise<ContactResponse> => {
    const response = await axiosInstance.post("/api/v1/contacts", payload);
    return response.data;
};

/**
 * Update an existing contact.
 */
export const updateContact = async (id: string, payload: UpdateContactPayload): Promise<ContactResponse> => {
    const response = await axiosInstance.put(`/api/v1/contacts/${id}`, payload);
    return response.data;
};

/**
 * Delete a contact by ID.
 */
export const deleteContact = async (id: string): Promise<DeleteContactResponse> => {
    const response = await axiosInstance.delete(`/api/v1/contacts/${id}`);
    return response.data;
};
