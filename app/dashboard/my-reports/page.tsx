"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "../_components/ToastContext";
import { getMyIncidents, type Incident } from "@/lib/api/incident";

// ─────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────
function FileTextIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
        </svg>
    );
}
function MapPinIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    );
}
function ClockIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    );
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getStatusColor(status: string): { bg: string; border: string; text: string } {
    switch (status) {
        case "verified":
            return { bg: "#f0fdf4", border: "#bbf7d0", text: "#166534" };
        case "rejected":
            return { bg: "#fef2f2", border: "#fecaca", text: "#991b1b" };
        default:
            return { bg: "#fffbeb", border: "#fde68a", text: "#92400e" };
    }
}

// ─────────────────────────────────────────────
// Incident Card
// ─────────────────────────────────────────────
function IncidentCard({ incident }: { incident: Incident }) {
    const statusColors = getStatusColor(incident.status);

    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 16,
                border: "1.5px solid #E5E7EB",
                padding: "18px 20px",
                boxShadow: "var(--shadow-sm)",
                transition: "all 0.15s",
            }}
        >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: "#f0fdf4",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#16a34a",
                    }}>
                        <FileTextIcon />
                    </div>
                    <div>
                        <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
                            {incident.category}
                        </p>
                        <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>
                            {formatDate(incident.reportedAt)}
                        </p>
                    </div>
                </div>
                <span style={{
                    padding: "4px 10px", borderRadius: 999,
                    fontSize: 11, fontWeight: 700,
                    background: statusColors.bg,
                    color: statusColors.text,
                    border: `1px solid ${statusColors.border}`,
                    textTransform: "capitalize",
                }}>
                    {incident.status}
                </span>
            </div>

            {/* Description */}
            <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, marginBottom: 14 }}>
                {incident.description}
            </p>

            {/* Location */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ color: "#9ca3af" }}><MapPinIcon /></span>
                <span style={{ fontSize: 12, color: "#6b7280" }}>
                    {incident.address || `${incident.latitude.toFixed(6)}, ${incident.longitude.toFixed(6)}`}
                </span>
            </div>

            {incident.photoUrl && (
                <div style={{ marginTop: 12 }}>
                    <img
                        src={incident.photoUrl}
                        alt="Incident photo"
                        style={{
                            width: "100%",
                            maxWidth: 300,
                            height: "auto",
                            borderRadius: 8,
                            border: "1px solid #E5E7EB",
                        }}
                    />
                </div>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function MyReportsPage() {
    const { loading: authLoading } = useAuth();
    const { showToast } = useToast();

    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch incidents
    const fetchIncidents = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getMyIncidents();
            if (response.success) {
                setIncidents(response.data);
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            showToast(err?.response?.data?.message || err?.message || "Failed to fetch reports", "error");
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchIncidents();
    }, [fetchIncidents]);

    if (authLoading || loading) {
        return (
            <div style={{ maxWidth: 800, margin: "0 auto" }}>
                <div style={{ background: "#fff", borderRadius: 22, border: "1px solid #E5E7EB", padding: 32, boxShadow: "var(--shadow-sm)" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="animate-shimmer"
                                style={{
                                    height: 120,
                                    borderRadius: 16,
                                    background: "#f9fafb",
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 800, margin: "0 auto" }}>

            {/* ── Header Card ──────────────────────── */}
            <div
                className="animate-fade-in-up"
                style={{
                    background: "#fff",
                    borderRadius: 22,
                    border: "1px solid #E5E7EB",
                    overflow: "hidden",
                    marginBottom: 20,
                    boxShadow: "var(--shadow-sm)",
                }}
            >
                <div
                    style={{
                        padding: "22px 26px",
                        background: "linear-gradient(135deg, #052e16 0%, #14532d 55%, #166534 100%)",
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                    }}
                >
                    <div
                        style={{
                            width: 48, height: 48, borderRadius: 14,
                            background: "rgba(22,163,74,0.18)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#4ade80",
                        }}
                    >
                        <FileTextIcon />
                    </div>
                    <div>
                        <h2 style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>
                            My Reports
                        </h2>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
                            View your incident report history
                        </p>
                    </div>
                </div>

                {/* Stats row */}
                <div
                    style={{
                        padding: "14px 26px",
                        background: "#f9fafb",
                        borderBottom: "1px solid #E5E7EB",
                        display: "flex",
                        gap: 20,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>
                            {incidents.length} Report{incidents.length !== 1 ? "s" : ""}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Reports List ───────────────────── */}
            <div className="animate-fade-in-up anim-delay-100">
                {incidents.length === 0 ? (
                    <div
                        className="animate-fade-in"
                        style={{
                            background: "#fff",
                            borderRadius: 22,
                            border: "1px solid #E5E7EB",
                            padding: "48px 24px",
                            textAlign: "center",
                            boxShadow: "var(--shadow-sm)",
                        }}
                    >
                        <div style={{
                            width: 64, height: 64, borderRadius: "50%",
                            background: "#f0fdf4",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            margin: "0 auto 16px",
                            color: "#16a34a",
                        }}>
                            <FileTextIcon />
                        </div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
                            No Reports Yet
                        </h3>
                        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>
                            You haven't reported any incidents yet.
                        </p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {incidents.map((incident) => (
                            <IncidentCard key={incident._id} incident={incident} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
