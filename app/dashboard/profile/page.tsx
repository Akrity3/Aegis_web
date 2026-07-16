"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useAuth, buildAvatarUrl } from "@/context/AuthContext";
import axiosInstance from "@/lib/api/axios-instance";
import { useToast } from "../_components/ToastContext";
import ImageUploader from "../_components/ImageUploader";
import { SkeletonForm } from "../_components/SkeletonLoader";
import ConfirmModal, { type ChangeItem } from "../_components/ConfirmModal";

// ─────────────────────────────────────────────
// Schema
// ─────────────────────────────────────────────
const profileSchema = z.object({
    firstName:   z.string().trim().min(1, "First name is required"),
    lastName:    z.string().trim().min(1, "Last name is required"),
    gender:      z.string().optional(),
    phoneNumber: z.string().optional(),
});
type ProfileFormValues = z.infer<typeof profileSchema>;

// ─────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────
function SaveIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
        </svg>
    );
}
function SpinnerIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="animate-spin">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    );
}
function ArrowLeftIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
        </svg>
    );
}
function AlertDotIcon() {
    return <svg width="8" height="8" viewBox="0 0 8 8" fill="#d97706"><circle cx="4" cy="4" r="4" /></svg>;
}

// ─────────────────────────────────────────────
// Shared input styles
// ─────────────────────────────────────────────
const inputBase: React.CSSProperties = {
    width: "100%", padding: "11px 14px",
    border: "1.5px solid #E5E7EB", borderRadius: 12,
    fontSize: 14, color: "#0f172a", background: "#f9fafb",
    outline: "none", transition: "all 0.15s",
    fontFamily: "Inter, sans-serif",
};
const inputFocus: React.CSSProperties = { borderColor: "#16a34a", background: "#fff", boxShadow: "0 0 0 3px rgba(22,163,74,0.1)" };
const inputError: React.CSSProperties = { borderColor: "#ef4444", background: "#fef2f2", boxShadow: "0 0 0 3px rgba(239,68,68,0.08)" };

// ─────────────────────────────────────────────
// Field wrapper
// ─────────────────────────────────────────────
interface FieldProps { label: string; error?: string; required?: boolean; children: React.ReactNode; }
function Field({ label, error, required, children }: FieldProps) {
    return (
        <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                {label}{required && <span style={{ color: "#ef4444", marginLeft: 2 }}>*</span>}
            </label>
            {children}
            {error && (
                <p style={{ fontSize: 12, color: "#ef4444", marginTop: 5, display: "flex", alignItems: "center", gap: 4 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const GENDER_LABELS: Record<string, string> = {
    male: "Male",
    female: "Female",
    other: "Other",
    prefer_not_to_say: "Prefer not to say",
};

/** Build the list of human-readable changes to show in the confirm modal */
function buildChangeList(
    current: { firstName: string; lastName: string; phoneNumber?: string; gender?: string },
    next: ProfileFormValues,
    hasNewFile: boolean
): ChangeItem[] {
    const items: ChangeItem[] = [];

    if (next.firstName !== current.firstName)
        items.push({ label: "First Name", from: current.firstName, to: next.firstName });

    if (next.lastName !== current.lastName)
        items.push({ label: "Last Name", from: current.lastName, to: next.lastName });

    const currentPhone = current.phoneNumber || "";
    const nextPhone    = next.phoneNumber    || "";
    if (nextPhone !== currentPhone)
        items.push({ label: "Phone Number", from: currentPhone || "Not set", to: nextPhone || "Removed" });

    const currentGender = (current.gender || "").toLowerCase();
    const nextGender    = (next.gender    || "").toLowerCase();
    if (nextGender !== currentGender)
        items.push({
            label: "Gender",
            from: GENDER_LABELS[currentGender] || "Not set",
            to:   GENDER_LABELS[nextGender]    || "Removed",
        });

    if (hasNewFile)
        items.push({ label: "Profile Photo", to: "New photo selected" });

    return items;
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function UpdateProfilePage() {
    const { user, loading, refreshUser, updateUser, picVersion } = useAuth();
    const { showToast } = useToast();

    const [file, setFile]               = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formDirty, setFormDirty]       = useState(false);

    // ── Confirm modal state ──
    const [confirmOpen, setConfirmOpen]    = useState(false);
    const [pendingData, setPendingData]    = useState<ProfileFormValues | null>(null);
    const [pendingChanges, setPendingChanges] = useState<ChangeItem[]>([]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty: rhfDirty },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: { firstName: "", lastName: "", gender: "", phoneNumber: "" },
    });

    // Track any dirty state (form fields OR new file)
    useEffect(() => {
        setFormDirty(rhfDirty || file !== null);
    }, [rhfDirty, file]);

    // ── Pre-fill form once user is available ──
    useEffect(() => {
        if (user) {
            reset({
                firstName:   user.firstName   || "",
                lastName:    user.lastName    || "",
                gender:      (user.gender     || "").toLowerCase(),
                phoneNumber: user.phoneNumber || "",
            });
        }
    }, [user, reset]);

    const avatarUrl = buildAvatarUrl(user?.profilePicture, picVersion);
    const initials  = user
        ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "U"
        : "U";

    // ── Step 1: intercept submit → build diff → open modal ──
    const onSubmit = (data: ProfileFormValues) => {
        if (!user) return;
        const changes = buildChangeList(user, data, file !== null);

        // If nothing changed at all, skip straight to a toast
        if (changes.length === 0) {
            showToast("No changes detected.", "info");
            return;
        }

        setPendingData(data);
        setPendingChanges(changes);
        setConfirmOpen(true);
    };

    // ── Step 2: user confirmed → call API ──
    const handleConfirm = async () => {
        if (!pendingData || !user) return;
        setIsSubmitting(true);

        try {
            const fd = new FormData();
            fd.append("firstName", pendingData.firstName);
            fd.append("lastName",  pendingData.lastName);
            if (pendingData.gender)      fd.append("gender",        pendingData.gender);
            if (pendingData.phoneNumber) fd.append("phoneNumber",   pendingData.phoneNumber);
            if (file)                    fd.append("profilePicture", file);

            const res = await axiosInstance.post("/api/v1/auth/update", fd, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.data?.success) {
                // 1. Optimistically update AuthContext (also bumps picVersion)
                updateUser(res.data.data);
                // 2. Re-fetch from server to get final state
                await refreshUser();
                // 3. Reset local state
                setFile(null);
                setFormDirty(false);
                setConfirmOpen(false);
                setPendingData(null);
                showToast("Profile updated successfully!", "success");
            } else {
                setConfirmOpen(false);
                showToast(res.data?.message || "Update failed", "error");
            }
        } catch (err: unknown) {
            setConfirmOpen(false);
            const e = err as { response?: { data?: { message?: string } }; message?: string };
            showToast(e?.response?.data?.message || e?.message || "Failed to update profile", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (user) {
            reset({
                firstName:   user.firstName   || "",
                lastName:    user.lastName    || "",
                gender:      (user.gender     || "").toLowerCase(),
                phoneNumber: user.phoneNumber || "",
            });
        }
        setFile(null);
        setFormDirty(false);
    };

    if (loading) {
        return (
            <div style={{ maxWidth: 720, margin: "0 auto" }}>
                <div style={{ background: "#fff", borderRadius: 22, border: "1px solid #E5E7EB", padding: 32, boxShadow: "var(--shadow-sm)" }}>
                    <SkeletonForm />
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 720, margin: "0 auto" }}>

            {/* ── Confirmation Modal ───────────────── */}
            <ConfirmModal
                open={confirmOpen}
                title="Save Changes?"
                message="Review your changes before saving. This will update your profile across the entire application."
                changes={pendingChanges}
                confirmLabel="Save Changes"
                confirmingLabel="Saving…"
                loading={isSubmitting}
                onConfirm={handleConfirm}
                onCancel={() => { if (!isSubmitting) setConfirmOpen(false); }}
            />

            {/* ── Page Header ──────────────────────── */}
            <div className="animate-fade-in-up" style={{ marginBottom: 22 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <Link
                        href="/dashboard/me"
                        style={{
                            display: "flex", alignItems: "center", gap: 6,
                            fontSize: 13, fontWeight: 600, color: "#6b7280",
                            textDecoration: "none", padding: "6px 12px",
                            borderRadius: 9, border: "1px solid #E5E7EB", background: "#fff",
                            transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget.style.color = "#16a34a"); (e.currentTarget.style.borderColor = "#bbf7d0"); }}
                        onMouseLeave={(e) => { (e.currentTarget.style.color = "#6b7280"); (e.currentTarget.style.borderColor = "#E5E7EB"); }}
                    >
                        <ArrowLeftIcon /> Back to Profile
                    </Link>

                    {formDirty && (
                        <span style={{
                            fontSize: 12, fontWeight: 600, color: "#d97706",
                            background: "#fffbeb", border: "1px solid #fde68a",
                            padding: "4px 10px", borderRadius: 999,
                            display: "flex", alignItems: "center", gap: 5,
                        }}>
                            <AlertDotIcon /> Unsaved changes
                        </span>
                    )}
                </div>

                <h1 style={{ fontSize: 21, fontWeight: 800, color: "#0f172a" }}>Update Profile</h1>
                <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
                    Your existing information is pre-filled below. Edit any field and click Save.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>

                {/* ── Profile Photo ──────────────────── */}
                <div
                    className="animate-fade-in-up anim-delay-100"
                    style={{
                        background: "#fff", borderRadius: 20,
                        border: "1px solid #E5E7EB",
                        padding: "24px", boxShadow: "var(--shadow-sm)", marginBottom: 18,
                    }}
                >
                    <p style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", marginBottom: 3 }}>
                        Profile Photo
                    </p>
                    <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 20 }}>
                        Drag and drop or click to upload. JPEG, PNG, WebP · Max 5 MB.
                        {user?.profilePicture && user.profilePicture !== "default-profile.png" && (
                            <span style={{ color: "#16a34a", marginLeft: 6, fontWeight: 600 }}>
                                Current photo loaded.
                            </span>
                        )}
                    </p>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <ImageUploader
                            currentImageUrl={avatarUrl}
                            initials={initials}
                            onFileChange={(f) => setFile(f)}
                        />
                    </div>
                </div>

                {/* ── Personal Info ─────────────────── */}
                <div
                    className="animate-fade-in-up anim-delay-200"
                    style={{
                        background: "#fff", borderRadius: 20,
                        border: "1px solid #E5E7EB",
                        padding: "24px", boxShadow: "var(--shadow-sm)", marginBottom: 18,
                    }}
                >
                    <p style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", marginBottom: 3 }}>
                        Personal Information
                    </p>
                    <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 20 }}>
                        Username and email are read-only.
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                        <Field label="First Name" error={errors.firstName?.message} required>
                            <input
                                type="text"
                                {...register("firstName")}
                                style={errors.firstName ? { ...inputBase, ...inputError } : inputBase}
                                onFocus={(e) => Object.assign(e.target.style, { ...inputBase, ...inputFocus })}
                                onBlur={(e) => Object.assign(e.target.style, errors.firstName ? { ...inputBase, ...inputError } : inputBase)}
                                placeholder="First name"
                            />
                        </Field>
                        <Field label="Last Name" error={errors.lastName?.message} required>
                            <input
                                type="text"
                                {...register("lastName")}
                                style={errors.lastName ? { ...inputBase, ...inputError } : inputBase}
                                onFocus={(e) => Object.assign(e.target.style, { ...inputBase, ...inputFocus })}
                                onBlur={(e) => Object.assign(e.target.style, errors.lastName ? { ...inputBase, ...inputError } : inputBase)}
                                placeholder="Last name"
                            />
                        </Field>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <Field label="Phone Number" error={errors.phoneNumber?.message}>
                            <input
                                type="tel"
                                {...register("phoneNumber")}
                                style={inputBase}
                                onFocus={(e) => Object.assign(e.target.style, { ...inputBase, ...inputFocus })}
                                onBlur={(e) => Object.assign(e.target.style, inputBase)}
                                placeholder="+977 98XXXXXXXX"
                            />
                        </Field>
                        <Field label="Gender" error={errors.gender?.message}>
                            <select
                                {...register("gender")}
                                style={{ ...inputBase, cursor: "pointer" }}
                                onFocus={(e) => Object.assign(e.target.style, { ...inputBase, ...inputFocus })}
                                onBlur={(e) => Object.assign(e.target.style, inputBase)}
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="prefer_not_to_say">Prefer not to say</option>
                            </select>
                        </Field>
                    </div>
                </div>

                {/* ── Read-only Fields ──────────────── */}
                <div
                    className="animate-fade-in-up anim-delay-300"
                    style={{
                        background: "#f9fafb", borderRadius: 14,
                        border: "1px solid #E5E7EB",
                        padding: "16px 20px", marginBottom: 22,
                        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18,
                    }}
                >
                    <div>
                        <p style={{ fontSize: 10.5, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 4 }}>
                            Username
                        </p>
                        <p style={{ fontSize: 14, fontWeight: 600, color: "#6b7280" }}>@{user?.username}</p>
                    </div>
                    <div>
                        <p style={{ fontSize: 10.5, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 4 }}>
                            Email Address
                        </p>
                        <p style={{ fontSize: 14, fontWeight: 600, color: "#6b7280" }}>{user?.email}</p>
                    </div>
                </div>

                {/* ── Actions ───────────────────────── */}
                <div className="animate-fade-in-up anim-delay-400" style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        style={{
                            padding: "11px 20px", borderRadius: 12,
                            border: "1.5px solid #E5E7EB", background: "#fff",
                            fontSize: 13.5, fontWeight: 600, color: "#374151",
                            cursor: "pointer", transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                            padding: "11px 22px", borderRadius: 12, border: "none",
                            background: "#16a34a", color: "#fff",
                            fontSize: 13.5, fontWeight: 700,
                            cursor: isSubmitting ? "not-allowed" : "pointer",
                            display: "flex", alignItems: "center", gap: 8,
                            boxShadow: "var(--shadow-green)",
                            opacity: isSubmitting ? 0.8 : 1, transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => { if (!isSubmitting) (e.currentTarget.style.background = "#15803d"); }}
                        onMouseLeave={(e) => { if (!isSubmitting) (e.currentTarget.style.background = "#16a34a"); }}
                    >
                        {isSubmitting ? <><SpinnerIcon /> Saving…</> : <><SaveIcon /> Review & Save</>}
                    </button>
                </div>
            </form>
        </div>
    );
}
