import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// ─────────────────────────────────────────────
// Schema
// ─────────────────────────────────────────────
const alertSchema = z.object({
    latitude: z.number().min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90"),
    longitude: z.number().min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180"),
    address: z.string().optional(),
});

type AlertFormValues = z.infer<typeof alertSchema>;

// ─────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────
function MapPinIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    );
}
function CrossIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────
interface AlertModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: { latitude: number; longitude: number; address?: string }) => void;
    loading: boolean;
    serverError?: string;
}

// ─────────────────────────────────────────────
// Alert Modal Component
// ─────────────────────────────────────────────
export default function AlertModal({ open, onClose, onSave, loading, serverError }: AlertModalProps) {
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [gettingLocation, setGettingLocation] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<AlertFormValues>({
        resolver: zodResolver(alertSchema),
        defaultValues: {
            latitude: 0,
            longitude: 0,
            address: "",
        },
    });

    // Get current location
    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser");
            return;
        }

        setGettingLocation(true);
        setLocationError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lng: longitude });
                setValue("latitude", latitude);
                setValue("longitude", longitude);
                setGettingLocation(false);
            },
            (error) => {
                setLocationError("Unable to retrieve your location. Please enter manually.");
                setGettingLocation(false);
            },
            { enableHighAccuracy: true }
        );
    };

    // Auto-get location on open
    useEffect(() => {
        if (open && !userLocation) {
            getCurrentLocation();
        }
    }, [open]);

    const onSubmit = (data: AlertFormValues) => {
        onSave(data);
    };

    if (!open) return null;

    return (
        <div
            className="animate-fade-in"
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 50,
                padding: 16,
            }}
        >
            <div
                className="animate-scale-in"
                style={{
                    background: "#fff",
                    borderRadius: 22,
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                    width: "100%",
                    maxWidth: 480,
                    maxHeight: "90vh",
                    overflowY: "auto",
                }}
            >
                {/* Header */}
                <div style={{
                    padding: "22px 24px 18px",
                    borderBottom: "1px solid #f3f4f6",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}>
                    <div>
                        <h2 style={{ fontSize: 17, fontWeight: 800, color: "#0f172a" }}>
                            Trigger SOS Alert
                        </h2>
                        <p style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                            This will notify your emergency contacts
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        style={{
                            width: 32, height: 32, borderRadius: 8,
                            border: "none", background: "transparent",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: loading ? "not-allowed" : "pointer",
                            color: "#9ca3af",
                            transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "#f3f4f6";
                            if (!loading) (e.currentTarget as HTMLButtonElement).style.color = "#374151";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                            (e.currentTarget as HTMLButtonElement).style.color = "#9ca3af";
                        }}
                    >
                        <CrossIcon />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} style={{ padding: "20px 24px 24px" }}>
                    {/* Location section */}
                    <div style={{ marginBottom: 20 }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 14,
                        }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                                Your Location
                            </p>
                            <button
                                type="button"
                                onClick={getCurrentLocation}
                                disabled={gettingLocation || loading}
                                style={{
                                    padding: "6px 12px",
                                    borderRadius: 8,
                                    border: "1px solid #bbf7d0",
                                    background: "#f0fdf4",
                                    color: "#16a34a",
                                    fontSize: 11.5,
                                    fontWeight: 600,
                                    cursor: gettingLocation || loading ? "not-allowed" : "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                    transition: "all 0.15s",
                                }}
                                onMouseEnter={(e) => {
                                    if (!gettingLocation && !loading) {
                                        (e.currentTarget as HTMLButtonElement).style.background = "#dcfce7";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!gettingLocation && !loading) {
                                        (e.currentTarget as HTMLButtonElement).style.background = "#f0fdf4";
                                    }
                                }}
                            >
                                {gettingLocation ? (
                                    <>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="animate-spin">
                                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                        </svg>
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
                            <div>
                                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                                    Latitude
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    {...register("latitude", { valueAsNumber: true })}
                                    placeholder="0.000000"
                                    disabled={loading}
                                    style={{
                                        width: "100%",
                                        padding: "10px 12px",
                                        borderRadius: 10,
                                        border: `1.5px solid ${errors.latitude ? "#ef4444" : "#E5E7EB"}`,
                                        fontSize: 13,
                                        color: "#0f172a",
                                        background: errors.latitude ? "#fef2f2" : "#f9fafb",
                                        outline: "none",
                                        transition: "all 0.15s",
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = errors.latitude ? "#ef4444" : "#16a34a";
                                        e.target.style.background = "#fff";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = errors.latitude ? "#ef4444" : "#E5E7EB";
                                        e.target.style.background = errors.latitude ? "#fef2f2" : "#f9fafb";
                                    }}
                                />
                                {errors.latitude && (
                                    <p style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>
                                        {errors.latitude.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                                    Longitude
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    {...register("longitude", { valueAsNumber: true })}
                                    placeholder="0.000000"
                                    disabled={loading}
                                    style={{
                                        width: "100%",
                                        padding: "10px 12px",
                                        borderRadius: 10,
                                        border: `1.5px solid ${errors.longitude ? "#ef4444" : "#E5E7EB"}`,
                                        fontSize: 13,
                                        color: "#0f172a",
                                        background: errors.longitude ? "#fef2f2" : "#f9fafb",
                                        outline: "none",
                                        transition: "all 0.15s",
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = errors.longitude ? "#ef4444" : "#16a34a";
                                        e.target.style.background = "#fff";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = errors.longitude ? "#ef4444" : "#E5E7EB";
                                        e.target.style.background = errors.longitude ? "#fef2f2" : "#f9fafb";
                                    }}
                                />
                                {errors.longitude && (
                                    <p style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>
                                        {errors.longitude.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {locationError && (
                            <div style={{
                                padding: "10px 12px",
                                borderRadius: 8,
                                background: "#fffbeb",
                                border: "1px solid #fde68a",
                                marginBottom: 14,
                            }}>
                                <p style={{ fontSize: 12, color: "#92400e", margin: 0 }}>
                                    {locationError}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Address (optional) */}
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                            Address <span style={{ color: "#9ca3af", fontWeight: 400 }}>(Optional)</span>
                        </label>
                        <input
                            type="text"
                            {...register("address")}
                            placeholder="Enter your current address"
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "10px 12px",
                                borderRadius: 10,
                                border: "1.5px solid #E5E7EB",
                                fontSize: 13,
                                color: "#0f172a",
                                background: "#f9fafb",
                                outline: "none",
                                transition: "all 0.15s",
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = "#16a34a";
                                e.target.style.background = "#fff";
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = "#E5E7EB";
                                e.target.style.background = "#f9fafb";
                            }}
                        />
                    </div>

                    {/* Server error */}
                    {serverError && (
                        <div style={{
                            padding: "10px 12px",
                            borderRadius: 8,
                            background: "#fef2f2",
                            border: "1px solid #fecaca",
                            marginBottom: 20,
                        }}>
                            <p style={{ fontSize: 12, color: "#dc2626", margin: 0 }}>
                                {serverError}
                            </p>
                        </div>
                    )}

                    {/* Warning message */}
                    <div style={{
                        padding: "12px 14px",
                        borderRadius: 10,
                        background: "#fef2f2",
                        border: "1px solid #fecaca",
                        marginBottom: 20,
                    }}>
                        <p style={{ fontSize: 12, color: "#991b1b", margin: 0, lineHeight: 1.5 }}>
                            <strong>Warning:</strong> Triggering an SOS alert will notify all your emergency contacts. Only use this in a real emergency.
                        </p>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            style={{
                                padding: "10px 18px",
                                borderRadius: 10,
                                border: "1.5px solid #E5E7EB",
                                background: "#fff",
                                color: "#374151",
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: loading ? "not-allowed" : "pointer",
                                transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) => {
                                if (!loading) (e.currentTarget as HTMLButtonElement).style.borderColor = "#d1d5db";
                            }}
                            onMouseLeave={(e) => {
                                if (!loading) (e.currentTarget as HTMLButtonElement).style.borderColor = "#E5E7EB";
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: "10px 20px",
                                borderRadius: 10,
                                border: "none",
                                background: "#dc2626",
                                color: "#fff",
                                fontSize: 13,
                                fontWeight: 700,
                                cursor: loading ? "not-allowed" : "pointer",
                                boxShadow: "0 4px 12px rgba(220,38,38,0.25)",
                                opacity: loading ? 0.8 : 1,
                                transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) => {
                                if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "#b91c1c";
                            }}
                            onMouseLeave={(e) => {
                                if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "#dc2626";
                            }}
                        >
                            {loading ? "Triggering…" : "Trigger SOS"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
