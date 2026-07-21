"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "../_components/ToastContext";
import { createIncident, type IncidentCategory, type CreateIncidentPayload } from "@/lib/api/incident";
import ImageUploader from "../_components/ImageUploader";
import { SkeletonForm } from "../_components/SkeletonLoader";
import ConfirmModal from "../_components/ConfirmModal";

// ─────────────────────────────────────────────
// Schema
// ─────────────────────────────────────────────
const INCIDENT_CATEGORIES = [
    "Harassment",
    "Road Accident",
    "Theft / Robbery",
    "Suspicious Activity",
    "Natural Disaster",
    "Fire Emergency",
    "Unsafe Infrastructure / Road Hazard",
    "Other",
] as const;

const incidentSchema = z.object({
    category: z.enum(INCIDENT_CATEGORIES, {
        error: "Please select an incident category",
    }),
    description: z
        .string()
        .min(10, "Description must be at least 10 characters")
        .max(500, "Description must be at most 500 characters"),
    latitude: z.number().min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90"),
    longitude: z.number().min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180"),
    address: z.string().optional(),
});

type IncidentFormValues = z.infer<typeof incidentSchema>;

// ─────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────
function AlertTriangleIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    );
}
function MapPinIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    );
}
function SpinnerIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="animate-spin">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    );
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
// Page
// ─────────────────────────────────────────────
export default function ReportIncidentPage() {
    const { loading } = useAuth();
    const { showToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [gettingLocation, setGettingLocation] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingData, setPendingData] = useState<IncidentFormValues | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<IncidentFormValues>({
        resolver: zodResolver(incidentSchema),
        defaultValues: {
            description: "",
            latitude: 0,
            longitude: 0,
            address: "",
        },
    });

    // Get current location
    const getCurrentLocation = useCallback(() => {
        if (!navigator.geolocation) {
            showToast("Geolocation is not supported by your browser", "error");
            return;
        }

        setGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lng: longitude });
                setValue("latitude", latitude);
                setValue("longitude", longitude);
                setGettingLocation(false);
            },
            () => {
                showToast("Unable to retrieve your location. Please enter manually.", "error");
                setGettingLocation(false);
            },
            { enableHighAccuracy: true }
        );
    }, [showToast, setValue]);

    // Handle form submission - show confirmation modal
    const onSubmit = (data: IncidentFormValues) => {
        setPendingData(data);
        setShowConfirmModal(true);
    };

    // Handle confirmed submission
    const handleConfirmedSubmit = async () => {
        if (!pendingData) return;

        setIsSubmitting(true);
        try {
            const payload: CreateIncidentPayload = {
                category: pendingData.category,
                description: pendingData.description,
                latitude: pendingData.latitude,
                longitude: pendingData.longitude,
                address: pendingData.address,
                photo: file || undefined,
            };

            const response = await createIncident(payload);
            if (response.success) {
                showToast("Incident reported successfully!", "success");
                // Reset form
                setValue("description", "");
                setValue("address", "");
                setFile(null);
                if (userLocation) {
                    setValue("latitude", userLocation.lat);
                    setValue("longitude", userLocation.lng);
                }
            } else {
                showToast(response.message || "Failed to report incident", "error");
            }
        } catch (err: unknown) {
            const e = err as { response?: { data?: { message?: string } }; message?: string };
            showToast(e?.response?.data?.message || e?.message || "Failed to report incident", "error");
        } finally {
            setIsSubmitting(false);
            setShowConfirmModal(false);
            setPendingData(null);
        }
    };

    // Auto-get location on mount
    useEffect(() => {
        getCurrentLocation();
        // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
    }, [getCurrentLocation]);

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

            {/* ── Page Header ──────────────────────── */}
            <div className="animate-fade-in-up" style={{ marginBottom: 22 }}>
                <h1 style={{ fontSize: 21, fontWeight: 800, color: "#0f172a" }}>Report Incident</h1>
                <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
                    Report a safety incident to help keep your community informed.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>

                {/* ── Incident Details ───────────────── */}
                <div
                    className="animate-fade-in-up anim-delay-100"
                    style={{
                        background: "#fff", borderRadius: 20,
                        border: "1px solid #E5E7EB",
                        padding: "24px", boxShadow: "var(--shadow-sm)", marginBottom: 18,
                    }}
                >
                    <p style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", marginBottom: 3 }}>
                        Incident Details
                    </p>
                    <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 20 }}>
                        Provide details about the incident you want to report.
                    </p>

                    <div style={{ marginBottom: 14 }}>
                        <Field label="Incident Category" error={errors.category?.message} required>
                            <select
                                {...register("category")}
                                style={{ ...inputBase, cursor: "pointer" }}
                                onFocus={(e) => Object.assign(e.target.style, { ...inputBase, ...inputFocus })}
                                onBlur={(e) => Object.assign(e.target.style, errors.category ? { ...inputBase, ...inputError } : inputBase)}
                            >
                                <option value="">Select category</option>
                                {INCIDENT_CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </Field>
                    </div>

                    <div style={{ marginBottom: 14 }}>
                        <Field label="Description" error={errors.description?.message} required>
                            <textarea
                                {...register("description")}
                                rows={4}
                                placeholder="Describe the incident in detail..."
                                style={{
                                    ...inputBase,
                                    resize: "vertical",
                                    minHeight: 100,
                                }}
                                onFocus={(e) => Object.assign(e.target.style, { ...inputBase, ...inputFocus })}
                                onBlur={(e) => Object.assign(e.target.style, errors.description ? { ...inputBase, ...inputError } : inputBase)}
                            />
                        </Field>
                    </div>
                </div>

                {/* ── Location ──────────────────────── */}
                <div
                    className="animate-fade-in-up anim-delay-200"
                    style={{
                        background: "#fff", borderRadius: 20,
                        border: "1px solid #E5E7EB",
                        padding: "24px", boxShadow: "var(--shadow-sm)", marginBottom: 18,
                    }}
                >
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 14,
                    }}>
                        <p style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>
                            Incident Location
                        </p>
                        <button
                            type="button"
                            onClick={getCurrentLocation}
                            disabled={gettingLocation || isSubmitting}
                            style={{
                                padding: "6px 12px",
                                borderRadius: 8,
                                border: "1px solid #bbf7d0",
                                background: "#f0fdf4",
                                color: "#16a34a",
                                fontSize: 11.5,
                                fontWeight: 600,
                                cursor: gettingLocation || isSubmitting ? "not-allowed" : "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) => {
                                if (!gettingLocation && !isSubmitting) {
                                    (e.currentTarget as HTMLButtonElement).style.background = "#dcfce7";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!gettingLocation && !isSubmitting) {
                                    (e.currentTarget as HTMLButtonElement).style.background = "#f0fdf4";
                                }
                            }}
                        >
                            {gettingLocation ? (
                                <>
                                    <SpinnerIcon />
                                    Getting Location…
                                </>
                            ) : (
                                <>
                                    <MapPinIcon />
                                    Use Current Location
                                </>
                            )}
                        </button>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                        <Field label="Latitude" error={errors.latitude?.message} required>
                            <input
                                type="number"
                                step="any"
                                {...register("latitude", { valueAsNumber: true })}
                                placeholder="0.000000"
                                disabled={isSubmitting}
                                style={errors.latitude ? { ...inputBase, ...inputError } : inputBase}
                                onFocus={(e) => Object.assign(e.target.style, { ...inputBase, ...inputFocus })}
                                onBlur={(e) => Object.assign(e.target.style, errors.latitude ? { ...inputBase, ...inputError } : inputBase)}
                            />
                        </Field>
                        <Field label="Longitude" error={errors.longitude?.message} required>
                            <input
                                type="number"
                                step="any"
                                {...register("longitude", { valueAsNumber: true })}
                                placeholder="0.000000"
                                disabled={isSubmitting}
                                style={errors.longitude ? { ...inputBase, ...inputError } : inputBase}
                                onFocus={(e) => Object.assign(e.target.style, { ...inputBase, ...inputFocus })}
                                onBlur={(e) => Object.assign(e.target.style, errors.longitude ? { ...inputBase, ...inputError } : inputBase)}
                            />
                        </Field>
                    </div>

                    <Field label="Address" error={errors.address?.message}>
                        <input
                            type="text"
                            {...register("address")}
                            placeholder="Enter the incident address (optional)"
                            disabled={isSubmitting}
                            style={inputBase}
                            onFocus={(e) => Object.assign(e.target.style, { ...inputBase, ...inputFocus })}
                            onBlur={(e) => Object.assign(e.target.style, inputBase)}
                        />
                    </Field>
                </div>

                {/* ── Photo (Optional) ───────────────── */}
                <div
                    className="animate-fade-in-up anim-delay-300"
                    style={{
                        background: "#fff", borderRadius: 20,
                        border: "1px solid #E5E7EB",
                        padding: "24px", boxShadow: "var(--shadow-sm)", marginBottom: 18,
                    }}
                >
                    <p style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", marginBottom: 3 }}>
                        Photo Evidence
                    </p>
                    <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 20 }}>
                        Optionally attach a photo of the incident. JPEG, PNG, WebP · Max 5 MB.
                    </p>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <ImageUploader
                            currentImageUrl={undefined}
                            initials="I"
                            onFileChange={(f) => setFile(f)}
                        />
                    </div>
                </div>

                {/* ── Warning ───────────────────────── */}
                <div
                    className="animate-fade-in-up anim-delay-400"
                    style={{
                        padding: "12px 14px",
                        borderRadius: 10,
                        background: "#fffbeb",
                        border: "1px solid #fde68a",
                        marginBottom: 22,
                    }}
                >
                    <p style={{ fontSize: 12, color: "#92400e", margin: 0, lineHeight: 1.5 }}>
                        <strong>Important:</strong> Only report genuine incidents. False reports may be subject to review and action.
                    </p>
                </div>

                {/* ── Actions ───────────────────────── */}
                <div className="animate-fade-in-up anim-delay-500" style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                            padding: "11px 24px", borderRadius: 12, border: "none",
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
                        {isSubmitting ? (
                            <><SpinnerIcon /> Submitting…</>
                        ) : (
                            <><AlertTriangleIcon /> Submit Report</>
                        )}
                    </button>
                </div>
            </form>

            {/* Confirmation Modal */}
            <ConfirmModal
                open={showConfirmModal}
                title="Report Incident?"
                message="Are you sure you want to report this incident? This will be visible to your safety circle and may be shared with authorities."
                confirmLabel="Report Incident"
                confirmingLabel="Reporting…"
                onConfirm={handleConfirmedSubmit}
                onCancel={() => {
                    setShowConfirmModal(false);
                    setPendingData(null);
                }}
                loading={isSubmitting}
            />
        </div>
    );
}
