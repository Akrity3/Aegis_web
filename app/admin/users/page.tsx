"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/dashboard/_components/ToastContext";
import ConfirmModal from "@/app/dashboard/_components/ConfirmModal";
import {
    getAdminUsers,
    getAdminUser,
    createAdminUser,
    updateAdminUser,
    deleteAdminUser,
    AdminUser,
    CreateUserPayload,
    UpdateUserPayload,
} from "@/lib/api/admin";

// SVG Icons (consistent with project style)
function PlusIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    );
}
function SearchIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    );
}
function EditIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    );
}
function TrashIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
    );
}
function XIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}
function SpinnerIcon({ size = 16 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="animate-spin">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    );
}
function UsersEmptyIcon() {
    return (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}
function AlertTriangleIcon() {
    return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    );
}
function DeleteIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
    );
}

// Helpers
function formatDate(dateStr?: string): string {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function truncateId(id: string): string {
    return id.length > 8 ? `${id.slice(0, 8)}…` : id;
}

// Skeleton row for table loading state
function SkeletonTableRow() {
    return (
        <tr>
            {[140, 160, 200, 80, 80, 100, 80].map((w, i) => (
                <td key={i} style={{ padding: "14px 16px" }}>
                    <div
                        className="animate-shimmer"
                        style={{ height: 14, width: w, borderRadius: 6 }}
                    />
                </td>
            ))}
        </tr>
    );
}

// Status badge
function StatusBadge({ status }: { status: "active" | "inactive" }) {
    const isActive = status === "active";
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "3px 10px",
                borderRadius: 999,
                fontSize: 11.5,
                fontWeight: 600,
                background: isActive ? "#f0fdf4" : "#f9fafb",
                color: isActive ? "#16a34a" : "#6b7280",
                border: `1px solid ${isActive ? "#bbf7d0" : "#e5e7eb"}`,
            }}
        >
            <span
                style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: isActive ? "#16a34a" : "#9ca3af",
                    flexShrink: 0,
                }}
            />
            {isActive ? "Active" : "Inactive"}
        </span>
    );
}

// Role badge
function RoleBadge({ role }: { role: "admin" | "user" }) {
    const isAdmin = role === "admin";
    return (
        <span
            style={{
                display: "inline-block",
                padding: "3px 10px",
                borderRadius: 999,
                fontSize: 11.5,
                fontWeight: 600,
                background: isAdmin ? "#eff6ff" : "#f9fafb",
                color: isAdmin ? "#1d4ed8" : "#374151",
                border: `1px solid ${isAdmin ? "#bfdbfe" : "#e5e7eb"}`,
            }}
        >
            {isAdmin ? "Admin" : "User"}
        </span>
    );
}

// Form field component
interface FieldProps {
    label: string;
    id: string;
    error?: string;
    required?: boolean;
    children: React.ReactNode;
}
function FormField({ label, id, error, required, children }: FieldProps) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label
                htmlFor={id}
                style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}
            >
                {label}
                {required && (
                    <span style={{ color: "#dc2626", marginLeft: 3 }}>*</span>
                )}
            </label>
            {children}
            {error && (
                <p style={{ fontSize: 12, color: "#dc2626", marginTop: 2 }}>{error}</p>
            )}
        </div>
    );
}

const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 10,
    border: "1.5px solid #e5e7eb",
    fontSize: 13.5,
    color: "#0f172a",
    background: "#fff",
    outline: "none",
    transition: "border-color 0.15s",
};
const inputErrorStyle: React.CSSProperties = {
    ...inputStyle,
    borderColor: "#fca5a5",
};
const selectStyle: React.CSSProperties = {
    ...inputStyle,
    appearance: "none",
    cursor: "pointer",
};

// Create/Edit Modal
interface UserFormData {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    role: "admin" | "user";
    status: "active" | "inactive";
}

interface UserFormErrors {
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    password?: string;
    role?: string;
    status?: string;
}

const EMPTY_FORM: UserFormData = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    role: "user",
    status: "active",
};

function validateForm(form: UserFormData, isCreate: boolean): UserFormErrors {
    const errors: UserFormErrors = {};
    if (!form.firstName.trim()) errors.firstName = "First name is required";
    if (!form.lastName.trim()) errors.lastName = "Last name is required";
    if (!form.username.trim()) errors.username = "Username is required";
    if (!form.email.trim()) {
        errors.email = "Email is required";
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form.email)) {
        errors.email = "Please enter a valid email address";
    }
    if (isCreate) {
        if (!form.password) {
            errors.password = "Password is required";
        } else if (form.password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        }
    } else if (form.password && form.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
    }
    return errors;
}

interface UserModalProps {
    open: boolean;
    mode: "create" | "edit";
    initialData?: AdminUser | null;
    onClose: () => void;
    onSave: (data: UserFormData) => void;
    loading: boolean;
    serverError?: string;
}

function UserModal({
    open,
    mode,
    initialData,
    onClose,
    onSave,
    loading,
    serverError,
}: UserModalProps) {
    const [form, setForm] = useState<UserFormData>(EMPTY_FORM);
    const [errors, setErrors] = useState<UserFormErrors>({});

    // Populate form when editing
    useEffect(() => {
        if (open) {
            if (mode === "edit" && initialData) {
                setForm({
                    firstName: initialData.firstName ?? "",
                    lastName: initialData.lastName ?? "",
                    username: initialData.username ?? "",
                    email: initialData.email ?? "",
                    password: "",
                    role: initialData.role ?? "user",
                    status: initialData.status ?? "active",
                });
            } else {
                setForm(EMPTY_FORM);
            }
            setErrors({});
        }
    }, [open, mode, initialData]);

    // Lock scroll and handle Escape
    useEffect(() => {
        if (!open) return;
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !loading) onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", onKey);
        };
    }, [open, loading, onClose]);

    if (!open) return null;

    const set = (field: keyof UserFormData) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validateForm(form, mode === "create");
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        onSave(form);
    };

    const isCreate = mode === "create";

    return (
        <div
            onClick={() => { if (!loading) onClose(); }}
            style={{
                position: "fixed", inset: 0, zIndex: 8000,
                background: "rgba(15,23,42,0.45)", backdropFilter: "blur(4px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "20px",
            }}
        >
            <div
                className="animate-scale-in"
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: "#fff", borderRadius: 22,
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 24px 60px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.08)",
                    width: "100%", maxWidth: 560,
                    maxHeight: "90vh", overflowY: "auto",
                }}
            >
                {/* Modal header */}
                <div
                    style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "22px 24px", borderBottom: "1px solid #f3f4f6",
                    }}
                >
                    <div>
                        <h2 style={{ fontSize: 17, fontWeight: 800, color: "#0f172a" }}>
                            {isCreate ? "Add New User" : "Edit User"}
                        </h2>
                        <p style={{ fontSize: 13, color: "#6b7280", marginTop: 3 }}>
                            {isCreate
                                ? "Fill in the details to create a new user."
                                : "Update the user's information below."}
                        </p>
                    </div>
                    {!loading && (
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close"
                            style={{
                                width: 32, height: 32, borderRadius: 8, border: "none",
                                background: "transparent", cursor: "pointer",
                                color: "#9ca3af", display: "flex", alignItems: "center",
                                justifyContent: "center", transition: "background 0.15s, color 0.15s",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.background = "#f3f4f6";
                                (e.currentTarget as HTMLButtonElement).style.color = "#374151";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                                (e.currentTarget as HTMLButtonElement).style.color = "#9ca3af";
                            }}
                        >
                            <XIcon />
                        </button>
                    )}
                </div>

                {/* Server error */}
                {serverError && (
                    <div
                        style={{
                            margin: "16px 24px 0",
                            padding: "12px 14px",
                            borderRadius: 10,
                            background: "#fef2f2",
                            border: "1px solid #fecaca",
                            fontSize: 13,
                            color: "#991b1b",
                        }}
                    >
                        {serverError}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate>
                    <div
                        style={{
                            padding: "20px 24px",
                            display: "flex",
                            flexDirection: "column",
                            gap: 16,
                        }}
                    >
                        {/* Row: First + Last name */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                            <FormField label="First Name" id="firstName" error={errors.firstName} required>
                                <input
                                    id="firstName"
                                    type="text"
                                    value={form.firstName}
                                    onChange={set("firstName")}
                                    placeholder="John"
                                    disabled={loading}
                                    style={errors.firstName ? inputErrorStyle : inputStyle}
                                    onFocus={(e) => { if (!errors.firstName) (e.target as HTMLInputElement).style.borderColor = "#16a34a"; }}
                                    onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = errors.firstName ? "#fca5a5" : "#e5e7eb"; }}
                                />
                            </FormField>
                            <FormField label="Last Name" id="lastName" error={errors.lastName} required>
                                <input
                                    id="lastName"
                                    type="text"
                                    value={form.lastName}
                                    onChange={set("lastName")}
                                    placeholder="Rai"
                                    disabled={loading}
                                    style={errors.lastName ? inputErrorStyle : inputStyle}
                                    onFocus={(e) => { if (!errors.lastName) (e.target as HTMLInputElement).style.borderColor = "#16a34a"; }}
                                    onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = errors.lastName ? "#fca5a5" : "#e5e7eb"; }}
                                />
                            </FormField>
                        </div>

                        {/* Username */}
                        <FormField label="Username" id="username" error={errors.username} required>
                            <input
                                id="username"
                                type="text"
                                value={form.username}
                                onChange={set("username")}
                                placeholder="your_username"
                                disabled={loading}
                                style={errors.username ? inputErrorStyle : inputStyle}
                                onFocus={(e) => { if (!errors.username) (e.target as HTMLInputElement).style.borderColor = "#16a34a"; }}
                                onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = errors.username ? "#fca5a5" : "#e5e7eb"; }}
                            />
                        </FormField>

                        {/* Email */}
                        <FormField label="Email Address" id="email" error={errors.email} required>
                            <input
                                id="email"
                                type="email"
                                value={form.email}
                                onChange={set("email")}
                                placeholder="abc@gmail.com"
                                disabled={loading}
                                style={errors.email ? inputErrorStyle : inputStyle}
                                onFocus={(e) => { if (!errors.email) (e.target as HTMLInputElement).style.borderColor = "#16a34a"; }}
                                onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = errors.email ? "#fca5a5" : "#e5e7eb"; }}
                            />
                        </FormField>

                        {/* Password */}
                        <FormField
                            label={isCreate ? "Password" : "New Password (leave blank to keep unchanged)"}
                            id="password"
                            error={errors.password}
                            required={isCreate}
                        >
                            <input
                                id="password"
                                type="password"
                                value={form.password}
                                onChange={set("password")}
                                placeholder={isCreate ? "Min. 6 characters" : "Leave blank to keep current password"}
                                disabled={loading}
                                style={errors.password ? inputErrorStyle : inputStyle}
                                onFocus={(e) => { if (!errors.password) (e.target as HTMLInputElement).style.borderColor = "#16a34a"; }}
                                onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = errors.password ? "#fca5a5" : "#e5e7eb"; }}
                            />
                        </FormField>

                        {/* Row: Role + Status */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                            <FormField label="Role" id="role" error={errors.role} required>
                                <div style={{ position: "relative" }}>
                                    <select
                                        id="role"
                                        value={form.role}
                                        onChange={set("role")}
                                        disabled={loading}
                                        style={errors.role ? { ...selectStyle, borderColor: "#fca5a5" } : selectStyle}
                                        onFocus={(e) => { if (!errors.role) (e.target as HTMLSelectElement).style.borderColor = "#16a34a"; }}
                                        onBlur={(e) => { (e.target as HTMLSelectElement).style.borderColor = errors.role ? "#fca5a5" : "#e5e7eb"; }}
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#9ca3af" }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                                    </div>
                                </div>
                            </FormField>
                            <FormField label="Status" id="status" error={errors.status} required>
                                <div style={{ position: "relative" }}>
                                    <select
                                        id="status"
                                        value={form.status}
                                        onChange={set("status")}
                                        disabled={loading}
                                        style={errors.status ? { ...selectStyle, borderColor: "#fca5a5" } : selectStyle}
                                        onFocus={(e) => { if (!errors.status) (e.target as HTMLSelectElement).style.borderColor = "#16a34a"; }}
                                        onBlur={(e) => { (e.target as HTMLSelectElement).style.borderColor = errors.status ? "#fca5a5" : "#e5e7eb"; }}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                    <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#9ca3af" }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                                    </div>
                                </div>
                            </FormField>
                        </div>
                    </div>

                    {/* Footer */}
                    <div
                        style={{
                            display: "flex", justifyContent: "flex-end", gap: 10,
                            padding: "16px 24px", borderTop: "1px solid #f3f4f6",
                        }}
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            style={{
                                padding: "10px 18px", borderRadius: 11,
                                border: "1.5px solid #e5e7eb", background: "#fff",
                                fontSize: 13.5, fontWeight: 600, color: "#374151",
                                cursor: loading ? "not-allowed" : "pointer",
                                opacity: loading ? 0.5 : 1,
                                transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) => { if (!loading) (e.currentTarget.style.borderColor = "#d1d5db"); }}
                            onMouseLeave={(e) => { if (!loading) (e.currentTarget.style.borderColor = "#e5e7eb"); }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: "10px 22px", borderRadius: 11, border: "none",
                                background: "#16a34a", color: "#fff",
                                fontSize: 13.5, fontWeight: 700,
                                cursor: loading ? "not-allowed" : "pointer",
                                display: "flex", alignItems: "center", gap: 8,
                                boxShadow: "var(--shadow-green)",
                                opacity: loading ? 0.85 : 1,
                                transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) => { if (!loading) (e.currentTarget.style.background = "#15803d"); }}
                            onMouseLeave={(e) => { if (!loading) (e.currentTarget.style.background = "#16a34a"); }}
                        >
                            {loading ? (
                                <><SpinnerIcon /> {isCreate ? "Creating…" : "Saving…"}</>
                            ) : (
                                isCreate ? "Create User" : "Save Changes"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Delete Confirmation Dialog
interface DeleteDialogProps {
    open: boolean;
    userName: string;
    loading: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}
function DeleteDialog({ open, userName, loading, onConfirm, onCancel }: DeleteDialogProps) {
    useEffect(() => {
        if (!open) return;
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !loading) onCancel();
        };
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", onKey);
        };
    }, [open, loading, onCancel]);

    if (!open) return null;

    return (
        <div
            onClick={() => { if (!loading) onCancel(); }}
            style={{
                position: "fixed", inset: 0, zIndex: 9000,
                background: "rgba(15,23,42,0.45)", backdropFilter: "blur(4px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "20px",
            }}
        >
            <div
                className="animate-scale-in"
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: "#fff", borderRadius: 22,
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 24px 60px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.08)",
                    width: "100%", maxWidth: 440, overflow: "hidden",
                }}
            >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "22px 24px 0" }}>
                    <div
                        style={{
                            width: 44, height: 44, borderRadius: 12,
                            background: "#fef2f2", border: "1px solid #fecaca",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#dc2626", flexShrink: 0,
                        }}
                    >
                        <DeleteIcon />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h2 style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>
                            Delete User
                        </h2>
                        <p style={{ fontSize: 13.5, color: "#6b7280", lineHeight: 1.55 }}>
                            Are you sure you want to permanently delete{" "}
                            <strong style={{ color: "#0f172a" }}>{userName}</strong>?{" "}
                            This action cannot be undone.
                        </p>
                    </div>
                    {!loading && (
                        <button
                            onClick={onCancel}
                            aria-label="Close"
                            style={{
                                width: 30, height: 30, borderRadius: 8,
                                border: "none", background: "transparent",
                                cursor: "pointer", color: "#9ca3af",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                flexShrink: 0, transition: "background 0.15s, color 0.15s",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.background = "#f3f4f6";
                                (e.currentTarget as HTMLButtonElement).style.color = "#374151";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                                (e.currentTarget as HTMLButtonElement).style.color = "#9ca3af";
                            }}
                        >
                            <XIcon />
                        </button>
                    )}
                </div>

                {/* Footer */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "20px 24px" }}>
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        style={{
                            padding: "10px 18px", borderRadius: 11,
                            border: "1.5px solid #e5e7eb", background: "#fff",
                            fontSize: 13.5, fontWeight: 600, color: "#374151",
                            cursor: loading ? "not-allowed" : "pointer",
                            opacity: loading ? 0.5 : 1, transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => { if (!loading) (e.currentTarget.style.borderColor = "#d1d5db"); }}
                        onMouseLeave={(e) => { if (!loading) (e.currentTarget.style.borderColor = "#e5e7eb"); }}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        style={{
                            padding: "10px 20px", borderRadius: 11, border: "none",
                            background: "#dc2626", color: "#fff",
                            fontSize: 13.5, fontWeight: 700,
                            cursor: loading ? "not-allowed" : "pointer",
                            display: "flex", alignItems: "center", gap: 8,
                            boxShadow: "0 4px 12px rgba(220,38,38,0.22)",
                            opacity: loading ? 0.85 : 1, transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => { if (!loading) (e.currentTarget.style.background = "#b91c1c"); }}
                        onMouseLeave={(e) => { if (!loading) (e.currentTarget.style.background = "#dc2626"); }}
                    >
                        {loading ? <><SpinnerIcon /> Deleting…</> : <><TrashIcon /> Delete</>}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Pagination
interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}
function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages: (number | "…")[] = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        pages.push(1);
        if (page > 3) pages.push("…");
        for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
        if (page < totalPages - 2) pages.push("…");
        pages.push(totalPages);
    }

    const btnBase: React.CSSProperties = {
        minWidth: 36, height: 36, borderRadius: 9, border: "1.5px solid #e5e7eb",
        background: "#fff", fontSize: 13, fontWeight: 500, color: "#374151",
        cursor: "pointer", display: "inline-flex", alignItems: "center",
        justifyContent: "center", padding: "0 10px", transition: "all 0.15s",
    };

    return (
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                style={{ ...btnBase, opacity: page === 1 ? 0.4 : 1, cursor: page === 1 ? "not-allowed" : "pointer" }}
                onMouseEnter={(e) => { if (page !== 1) (e.currentTarget.style.borderColor = "#16a34a"); }}
                onMouseLeave={(e) => { (e.currentTarget.style.borderColor = "#e5e7eb"); }}
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
                <span style={{ marginLeft: 4 }}>Prev</span>
            </button>

            {pages.map((p, i) =>
                p === "…" ? (
                    <span key={`ellipsis-${i}`} style={{ padding: "0 4px", color: "#9ca3af", fontSize: 13 }}>…</span>
                ) : (
                    <button
                        key={p}
                        onClick={() => onPageChange(p as number)}
                        style={{
                            ...btnBase,
                            background: p === page ? "#16a34a" : "#fff",
                            color: p === page ? "#fff" : "#374151",
                            borderColor: p === page ? "#16a34a" : "#e5e7eb",
                            fontWeight: p === page ? 700 : 500,
                            boxShadow: p === page ? "var(--shadow-green)" : "none",
                        }}
                        onMouseEnter={(e) => { if (p !== page) (e.currentTarget.style.borderColor = "#16a34a"); }}
                        onMouseLeave={(e) => { if (p !== page) (e.currentTarget.style.borderColor = "#e5e7eb"); }}
                    >
                        {p}
                    </button>
                )
            )}

            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                style={{ ...btnBase, opacity: page === totalPages ? 0.4 : 1, cursor: page === totalPages ? "not-allowed" : "pointer" }}
                onMouseEnter={(e) => { if (page !== totalPages) (e.currentTarget.style.borderColor = "#16a34a"); }}
                onMouseLeave={(e) => { (e.currentTarget.style.borderColor = "#e5e7eb"); }}
            >
                <span style={{ marginRight: 4 }}>Next</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
        </div>
    );
}

// Main Page
export default function AdminUsersPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const { showToast } = useToast();

    // ── Data state ──────────────────────────────────────────────────
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
    const [fetchLoading, setFetchLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    // ── Search state ────────────────────────────────────────────────
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Modal state ─────────────────────────────────────────────────
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [modalServerError, setModalServerError] = useState<string | undefined>();

    // ── Staged data for confirm dialogs ────────────────────────────
    const [pendingUpdate, setPendingUpdate] = useState<{ id: string; form: UserFormData } | null>(null);
    const [confirmUpdateOpen, setConfirmUpdateOpen] = useState(false);
    const [confirmUpdateLoading, setConfirmUpdateLoading] = useState(false);

    const [pendingDelete, setPendingDelete] = useState<AdminUser | null>(null);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);

    // ── Role guard ───────────────────────────────────────────────────
    useEffect(() => {
        if (!authLoading && user && user.role !== "admin") {
            router.replace("/dashboard");
        }
    }, [authLoading, user, router]);

    // ── Fetch users ──────────────────────────────────────────────────
    const fetchUsers = useCallback(
        async (page: number, search: string) => {
            setFetchLoading(true);
            setFetchError(null);
            try {
                const res = await getAdminUsers(page, meta.limit, search);
                // Filter out the current admin from the list
                const filteredUsers = res.data.filter((u) => u._id !== user?._id);
                setUsers(filteredUsers);
                setMeta(res.meta);
            } catch (err: any) {
                const msg =
                    err?.response?.data?.message ||
                    err?.message ||
                    "Unable to load users. Please try again.";
                setFetchError(msg);
            } finally {
                setFetchLoading(false);
            }
        },
        [meta.limit, user?._id]
    );

    // Initial load
    useEffect(() => {
        if (!authLoading && user?.role === "admin") {
            fetchUsers(1, "");
        }
    }, [authLoading, user]);

    // Debounced search
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchInput(val);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setSearchQuery(val);
            fetchUsers(1, val);
            setMeta((prev) => ({ ...prev, page: 1 }));
        }, 400);
    };

    const handlePageChange = (newPage: number) => {
        setMeta((prev) => ({ ...prev, page: newPage }));
        fetchUsers(newPage, searchQuery);
    };

    const refreshTable = () => fetchUsers(meta.page, searchQuery);

    // ── Open modals ─────────────────────────────────────────────────
    const openCreateModal = () => {
        setModalMode("create");
        setEditingUser(null);
        setModalServerError(undefined);
        setModalOpen(true);
    };

    const openEditModal = (u: AdminUser) => {
        setModalMode("edit");
        setEditingUser(u);
        setModalServerError(undefined);
        setModalOpen(true);
    };

    const closeModal = () => {
        if (modalLoading) return;
        setModalOpen(false);
        setEditingUser(null);
        setModalServerError(undefined);
    };

    // ── Create user ─────────────────────────────────────────────────
    const handleCreate = async (form: UserFormData) => {
        setModalLoading(true);
        setModalServerError(undefined);
        try {
            const payload: CreateUserPayload = {
                firstName: form.firstName,
                lastName: form.lastName,
                username: form.username,
                email: form.email,
                password: form.password,
                role: form.role,
                status: form.status,
            };
            await createAdminUser(payload);
            setModalOpen(false);
            showToast("User created successfully.", "success");
            fetchUsers(1, searchQuery);
            setMeta((prev) => ({ ...prev, page: 1 }));
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                "Unable to create user. Please try again.";
            setModalServerError(msg);
        } finally {
            setModalLoading(false);
        }
    };

    // ── Edit: stage for confirmation ────────────────────────────────
    const handleEditSave = (form: UserFormData) => {
        if (!editingUser) return;
        setPendingUpdate({ id: editingUser._id, form });
        setModalOpen(false);
        setConfirmUpdateOpen(true);
    };

    // ── Confirm update ───────────────────────────────────────────────
    const handleConfirmUpdate = async () => {
        if (!pendingUpdate) return;
        setConfirmUpdateLoading(true);
        try {
            const { id, form } = pendingUpdate;
            const payload: UpdateUserPayload = {
                firstName: form.firstName,
                lastName: form.lastName,
                username: form.username,
                email: form.email,
                role: form.role,
                status: form.status,
            };
            if (form.password) payload.password = form.password;

            await updateAdminUser(id, payload);
            setConfirmUpdateOpen(false);
            setPendingUpdate(null);
            showToast("User updated successfully.", "success");
            refreshTable();
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                "Unable to update user. Please try again.";
            showToast(msg, "error");
            setConfirmUpdateOpen(false);
            // Re-open edit modal so user can fix the issue
            if (pendingUpdate && editingUser) {
                setModalServerError(msg);
                setModalOpen(true);
            }
            setPendingUpdate(null);
        } finally {
            setConfirmUpdateLoading(false);
        }
    };

    const handleCancelUpdate = () => {
        if (confirmUpdateLoading) return;
        setConfirmUpdateOpen(false);
        // Re-open the edit modal so user can continue editing
        if (editingUser) setModalOpen(true);
        setPendingUpdate(null);
    };

    // ── Open delete dialog 
    const openDeleteDialog = (u: AdminUser) => {
        setPendingDelete(u);
        setConfirmDeleteOpen(true);
    };

    //  Confirm delete 
    const handleConfirmDelete = async () => {
        if (!pendingDelete) return;
        setConfirmDeleteLoading(true);
        try {
            await deleteAdminUser(pendingDelete._id);
            setConfirmDeleteOpen(false);
            setPendingDelete(null);
            showToast("User deleted successfully.", "success");
            // If deleting last item on page, go to previous page
            const newPage = users.length === 1 && meta.page > 1 ? meta.page - 1 : meta.page;
            fetchUsers(newPage, searchQuery);
            setMeta((prev) => ({ ...prev, page: newPage }));
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                "Unable to delete user. Please try again.";
            showToast(msg, "error");
            setConfirmDeleteOpen(false);
            setPendingDelete(null);
        } finally {
            setConfirmDeleteLoading(false);
        }
    };

    const handleCancelDelete = () => {
        if (confirmDeleteLoading) return;
        setConfirmDeleteOpen(false);
        setPendingDelete(null);
    };

    // Auth loading / guard 
    if (authLoading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
                <SpinnerIcon size={28} />
            </div>
        );
    }
    if (!user || user.role !== "admin") return null;

    // ── Render 
    return (
        <div className="animate-fade-in-up" style={{ maxWidth: 1200, margin: "0 auto" }}>

            {/*  Page Header  */}
            <div
                style={{
                    display: "flex", alignItems: "flex-start",
                    justifyContent: "space-between", flexWrap: "wrap",
                    gap: 16, marginBottom: 24,
                }}
            >
                <div>
                    <h1
                        style={{
                            fontSize: 22, fontWeight: 800, color: "#0f172a",
                            letterSpacing: "-0.4px", lineHeight: 1.2,
                        }}
                    >
                        User Management
                    </h1>
                    <p style={{ fontSize: 13.5, color: "#6b7280", marginTop: 5 }}>
                        Manage all registered users in the system.
                    </p>
                </div>

                <button
                    id="admin-add-user-btn"
                    onClick={openCreateModal}
                    style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        padding: "10px 20px", borderRadius: 12, border: "none",
                        background: "#16a34a", color: "#fff",
                        fontSize: 13.5, fontWeight: 700, cursor: "pointer",
                        boxShadow: "var(--shadow-green)", transition: "all 0.15s",
                        flexShrink: 0,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#15803d")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#16a34a")}
                >
                    <PlusIcon />
                    Add User
                </button>
            </div>

            {/* ── Search Bar ───────────────────────────── */}
            <div
                style={{
                    background: "#fff", borderRadius: 16,
                    border: "1px solid #e5e7eb",
                    boxShadow: "var(--shadow-sm)",
                    padding: "16px 20px",
                    marginBottom: 20,
                    display: "flex", alignItems: "center", gap: 12,
                }}
            >
                <span style={{ color: "#9ca3af", flexShrink: 0, display: "flex" }}>
                    <SearchIcon />
                </span>
                <input
                    id="admin-search-input"
                    type="text"
                    value={searchInput}
                    onChange={handleSearchChange}
                    placeholder="Search by name or email..."
                    style={{
                        flex: 1, border: "none", outline: "none",
                        fontSize: 13.5, color: "#0f172a",
                        background: "transparent",
                    }}
                />
                {searchInput && (
                    <button
                        onClick={() => {
                            setSearchInput("");
                            setSearchQuery("");
                            fetchUsers(1, "");
                            setMeta((prev) => ({ ...prev, page: 1 }));
                        }}
                        style={{
                            background: "none", border: "none", cursor: "pointer",
                            color: "#9ca3af", display: "flex", padding: 4,
                            borderRadius: 6, transition: "color 0.15s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#374151")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
                        aria-label="Clear search"
                    >
                        <XIcon />
                    </button>
                )}
            </div>

            {/* ── Table Card ───────────────────────────── */}
            <div
                style={{
                    background: "#fff", borderRadius: 16,
                    border: "1px solid #e5e7eb",
                    boxShadow: "var(--shadow-sm)",
                    overflow: "hidden",
                }}
            >
                {/* ── Error state ── */}
                {fetchError && !fetchLoading && (
                    <div
                        style={{
                            padding: "48px 24px", textAlign: "center",
                            display: "flex", flexDirection: "column",
                            alignItems: "center", gap: 16,
                        }}
                    >
                        <AlertTriangleIcon />
                        <div>
                            <p style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
                                Something went wrong
                            </p>
                            <p style={{ fontSize: 13.5, color: "#6b7280", maxWidth: 360 }}>
                                {fetchError}
                            </p>
                        </div>
                        <button
                            onClick={() => fetchUsers(meta.page, searchQuery)}
                            style={{
                                padding: "9px 20px", borderRadius: 10, border: "none",
                                background: "#16a34a", color: "#fff", fontSize: 13.5,
                                fontWeight: 700, cursor: "pointer",
                                boxShadow: "var(--shadow-green)",
                            }}
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* ── Table ── */}
                {!fetchError && (
                    <div style={{ overflowX: "auto" }}>
                        <table
                            style={{
                                width: "100%", borderCollapse: "collapse",
                                fontSize: 13.5, tableLayout: "auto",
                            }}
                        >
                            <thead>
                                <tr style={{ background: "#f9fafb", borderBottom: "1px solid #f3f4f6" }}>
                                    {["ID", "Name", "Email", "Role", "Status", "Joined", "Actions"].map((h) => (
                                        <th
                                            key={h}
                                            style={{
                                                padding: "12px 16px", textAlign: "left",
                                                fontSize: 11, fontWeight: 700,
                                                color: "#6b7280", textTransform: "uppercase",
                                                letterSpacing: "0.7px", whiteSpace: "nowrap",
                                            }}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {/* Loading skeletons */}
                                {fetchLoading &&
                                    Array.from({ length: 6 }).map((_, i) => (
                                        <SkeletonTableRow key={i} />
                                    ))}

                                {/* Empty state */}
                                {!fetchLoading && users.length === 0 && (
                                    <tr>
                                        <td colSpan={7} style={{ padding: "56px 24px", textAlign: "center" }}>
                                            <div
                                                style={{
                                                    display: "flex", flexDirection: "column",
                                                    alignItems: "center", gap: 12,
                                                }}
                                            >
                                                <UsersEmptyIcon />
                                                <div>
                                                    <p style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>
                                                        No users found
                                                    </p>
                                                    <p style={{ fontSize: 13, color: "#9ca3af" }}>
                                                        {searchQuery
                                                            ? `No results for "${searchQuery}". Try a different search.`
                                                            : "No users exist yet. Click Add User to get started."}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}

                                {/* Data rows */}
                                {!fetchLoading &&
                                    users.map((u, idx) => (
                                        <tr
                                            key={u._id}
                                            style={{
                                                borderBottom: idx < users.length - 1 ? "1px solid #f9fafb" : "none",
                                                transition: "background 0.12s",
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                        >
                                            {/* ID */}
                                            <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                                                <span
                                                    title={u._id}
                                                    style={{
                                                        fontFamily: "monospace", fontSize: 12,
                                                        color: "#9ca3af", background: "#f9fafb",
                                                        padding: "2px 8px", borderRadius: 6,
                                                        border: "1px solid #f3f4f6",
                                                    }}
                                                >
                                                    {truncateId(u._id)}
                                                </span>
                                            </td>

                                            {/* Name */}
                                            <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                    <div
                                                        style={{
                                                            width: 32, height: 32, borderRadius: "50%",
                                                            background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
                                                            display: "flex", alignItems: "center", justifyContent: "center",
                                                            fontSize: 12, fontWeight: 700, color: "#16a34a",
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        {(u.firstName?.[0] ?? "").toUpperCase()}{(u.lastName?.[0] ?? "").toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p style={{ fontWeight: 600, color: "#0f172a", fontSize: 13.5 }}>
                                                            {u.firstName} {u.lastName}
                                                        </p>
                                                        <p style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 1 }}>
                                                            @{u.username}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Email */}
                                            <td style={{ padding: "14px 16px", color: "#374151" }}>
                                                {u.email}
                                            </td>

                                            {/* Role */}
                                            <td style={{ padding: "14px 16px" }}>
                                                <RoleBadge role={u.role} />
                                            </td>

                                            {/* Status */}
                                            <td style={{ padding: "14px 16px" }}>
                                                <StatusBadge status={u.status ?? "active"} />
                                            </td>

                                            {/* Created date */}
                                            <td style={{ padding: "14px 16px", color: "#6b7280", whiteSpace: "nowrap" }}>
                                                {formatDate(u.createdAt)}
                                            </td>

                                            {/* Actions */}
                                            <td style={{ padding: "14px 16px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                    <button
                                                        id={`edit-user-${u._id}`}
                                                        onClick={() => openEditModal(u)}
                                                        title="Edit user"
                                                        style={{
                                                            width: 32, height: 32, borderRadius: 8,
                                                            border: "1.5px solid #e5e7eb",
                                                            background: "#fff", cursor: "pointer",
                                                            display: "flex", alignItems: "center", justifyContent: "center",
                                                            color: "#374151", transition: "all 0.15s",
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            (e.currentTarget as HTMLButtonElement).style.borderColor = "#16a34a";
                                                            (e.currentTarget as HTMLButtonElement).style.color = "#16a34a";
                                                            (e.currentTarget as HTMLButtonElement).style.background = "#f0fdf4";
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e7eb";
                                                            (e.currentTarget as HTMLButtonElement).style.color = "#374151";
                                                            (e.currentTarget as HTMLButtonElement).style.background = "#fff";
                                                        }}
                                                    >
                                                        <EditIcon />
                                                    </button>
                                                    <button
                                                        id={`delete-user-${u._id}`}
                                                        onClick={() => openDeleteDialog(u)}
                                                        title="Delete user"
                                                        style={{
                                                            width: 32, height: 32, borderRadius: 8,
                                                            border: "1.5px solid #e5e7eb",
                                                            background: "#fff", cursor: "pointer",
                                                            display: "flex", alignItems: "center", justifyContent: "center",
                                                            color: "#374151", transition: "all 0.15s",
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            (e.currentTarget as HTMLButtonElement).style.borderColor = "#fca5a5";
                                                            (e.currentTarget as HTMLButtonElement).style.color = "#dc2626";
                                                            (e.currentTarget as HTMLButtonElement).style.background = "#fef2f2";
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e7eb";
                                                            (e.currentTarget as HTMLButtonElement).style.color = "#374151";
                                                            (e.currentTarget as HTMLButtonElement).style.background = "#fff";
                                                        }}
                                                    >
                                                        <TrashIcon />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ── Table footer: count + pagination ── */}
                {!fetchError && !fetchLoading && users.length > 0 && (
                    <div
                        style={{
                            display: "flex", alignItems: "center",
                            justifyContent: "space-between", flexWrap: "wrap",
                            gap: 12, padding: "14px 20px",
                            borderTop: "1px solid #f3f4f6",
                            background: "#fafafa",
                        }}
                    >
                        <p style={{ fontSize: 12.5, color: "#6b7280" }}>
                            Showing{" "}
                            <span style={{ fontWeight: 600, color: "#374151" }}>
                                {(meta.page - 1) * meta.limit + 1}–
                                {Math.min(meta.page * meta.limit, meta.total)}
                            </span>{" "}
                            of{" "}
                            <span style={{ fontWeight: 600, color: "#374151" }}>
                                {meta.total}
                            </span>{" "}
                            users
                        </p>
                        <Pagination
                            page={meta.page}
                            totalPages={meta.totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>

            {/* ── Create / Edit Modal ────────────────── */}
            <UserModal
                open={modalOpen}
                mode={modalMode}
                initialData={editingUser}
                onClose={closeModal}
                onSave={modalMode === "create" ? handleCreate : handleEditSave}
                loading={modalLoading}
                serverError={modalServerError}
            />

            {/* ── Update Confirmation Dialog ─────────── */}
            <ConfirmModal
                open={confirmUpdateOpen}
                title="Confirm Update"
                message="Are you sure you want to save these changes to this user's information?"
                confirmLabel="Confirm Update"
                confirmingLabel="Updating…"
                onConfirm={handleConfirmUpdate}
                onCancel={handleCancelUpdate}
                loading={confirmUpdateLoading}
            />

            {/* ── Delete Confirmation Dialog ────────── */}
            <DeleteDialog
                open={confirmDeleteOpen}
                userName={pendingDelete ? `${pendingDelete.firstName} ${pendingDelete.lastName}` : ""}
                loading={confirmDeleteLoading}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </div>
    );
}
