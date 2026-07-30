"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "../_components/ToastContext";
import { getPublicIncidents, type Incident } from "@/lib/api/incident";

// ─────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────
function MapIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
            <line x1="8" y1="2" x2="8" y2="18" />
            <line x1="16" y1="6" x2="16" y2="22" />
        </svg>
    );
}
function AlertTriangleIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    );
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function getCategoryColor(category: string): string {
    switch (category) {
        case "Harassment":
            return "#dc2626";
        case "Road Accident":
            return "#f59e0b";
        case "Theft / Robbery":
            return "#7c3aed";
        case "Suspicious Activity":
            return "#0891b2";
        case "Natural Disaster":
            return "#ea580c";
        case "Fire Emergency":
            return "#ef4444";
        case "Unsafe Infrastructure / Road Hazard":
            return "#65a30d";
        default:
            return "#6b7280";
    }
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function SafetyMapPage() {
    const { loading: authLoading } = useAuth();
    const { showToast } = useToast();

    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

    // Fetch public incidents
    const fetchIncidents = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getPublicIncidents();
            if (response.success) {
                setIncidents(response.data);
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            showToast(err?.response?.data?.message || err?.message || "Failed to fetch incidents", "error");
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchIncidents();
        // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
    }, [fetchIncidents]);

    if (authLoading || loading) {
        return (
            <div style={{ maxWidth: 900, margin: "0 auto" }}>
                <div style={{ background: "#fff", borderRadius: 22, border: "1px solid #E5E7EB", padding: 32, boxShadow: "var(--shadow-sm)" }}>
                    <div
                        className="animate-shimmer"
                        style={{
                            height: 500,
                            borderRadius: 16,
                            background: "#f9fafb",
                        }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 900, margin: "0 auto" }}>

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
                        <MapIcon />
                    </div>
                    <div>
                        <h2 style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>
                            Safety Map
                        </h2>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
                            View community-reported incidents in your area
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
                            {incidents.length} Incident{incidents.length !== 1 ? "s" : ""}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Map Container ──────────────────── */}
            <div className="animate-fade-in-up anim-delay-100">
                <div
                    style={{
                        background: "#fff",
                        borderRadius: 22,
                        border: "1px solid #E5E7EB",
                        padding: "20px",
                        boxShadow: "var(--shadow-sm)",
                        marginBottom: 20,
                    }}
                >
                    {/* Simple Map Placeholder */}
                    <div
                        style={{
                            height: 450,
                            borderRadius: 16,
                            background: "#f0fdf4",
                            border: "2px dashed #bbf7d0",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                        }}
                    >
                        <MapIcon />
                        <p style={{ fontSize: 14, fontWeight: 600, color: "#166534", marginTop: 12 }}>
                            Interactive Map Coming Soon
                        </p>
                        <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4, textAlign: "center", maxWidth: 300 }}>
                            Leaflet + OpenStreetMap integration will be added to display incidents on an interactive map.
                        </p>

                        {/* Incident markers preview */}
                        <div style={{ position: "absolute", top: 20, right: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                            {incidents.slice(0, 5).map((incident) => (
                                <div
                                    key={incident._id}
                                    onClick={() => setSelectedIncident(incident)}
                                    style={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: "50%",
                                        background: getCategoryColor(incident.category),
                                        cursor: "pointer",
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                        transition: "transform 0.15s",
                                    }}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLDivElement).style.transform = "scale(1.3)";
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Incidents List ───────────────── */}
                <div
                    style={{
                        background: "#fff",
                        borderRadius: 22,
                        border: "1px solid #E5E7EB",
                        padding: "20px",
                        boxShadow: "var(--shadow-sm)",
                    }}
                >
                    <p style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>
                        Recent Incidents
                    </p>
                    {incidents.length === 0 ? (
                        <div
                            style={{
                                padding: "32px 24px",
                                textAlign: "center",
                                borderRadius: 16,
                                background: "#f9fafb",
                            }}
                        >
                            <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
                                No incidents reported yet.
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {incidents.slice(0, 10).map((incident) => (
                                <div
                                    key={incident._id}
                                    onClick={() => setSelectedIncident(incident)}
                                    style={{
                                        padding: "14px 16px",
                                        borderRadius: 12,
                                        border: "1.5px solid #E5E7EB",
                                        background: "#fff",
                                        cursor: "pointer",
                                        transition: "all 0.15s",
                                    }}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLDivElement).style.borderColor = "#bbf7d0";
                                        (e.currentTarget as HTMLDivElement).style.background = "#f0fdf4";
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLDivElement).style.borderColor = "#E5E7EB";
                                        (e.currentTarget as HTMLDivElement).style.background = "#fff";
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <div
                                            style={{
                                                width: 10,
                                                height: 10,
                                                borderRadius: "50%",
                                                background: getCategoryColor(incident.category),
                                                flexShrink: 0,
                                            }}
                                        />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                                                <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: 0 }}>
                                                    {incident.category}
                                                </p>
                                                <span style={{ fontSize: 11, color: "#9ca3af", whiteSpace: "nowrap", marginLeft: 8 }}>
                                                    {new Date(incident.reportedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p style={{ fontSize: 12, color: "#6b7280", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {incident.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Incident Detail Modal ───────────── */}
            {selectedIncident && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                        padding: 20,
                    }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setSelectedIncident(null);
                    }}
                >
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 20,
                            padding: "24px",
                            width: "100%",
                            maxWidth: 450,
                            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div
                                    style={{
                                        width: 40, height: 40, borderRadius: 10,
                                        background: `${getCategoryColor(selectedIncident.category)}15`,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        color: getCategoryColor(selectedIncident.category),
                                    }}
                                >
                                    <AlertTriangleIcon />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 }}>
                                        {selectedIncident.category}
                                    </h3>
                                    <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
                                        {new Date(selectedIncident.reportedAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedIncident(null)}
                                style={{
                                    padding: "6px",
                                    borderRadius: 8,
                                    border: "none",
                                    background: "#f3f4f6",
                                    color: "#6b7280",
                                    cursor: "pointer",
                                    fontSize: 18,
                                    lineHeight: 1,
                                }}
                            >
                                ×
                            </button>
                        </div>
                        <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, marginBottom: 16 }}>
                            {selectedIncident.description}
                        </p>
                        <div style={{ padding: "12px", borderRadius: 10, background: "#f9fafb", marginBottom: 16 }}>
                            <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
                                <strong>Location:</strong> {selectedIncident.address || `${selectedIncident.latitude.toFixed(6)}, ${selectedIncident.longitude.toFixed(6)}`}
                            </p>
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <button
                                onClick={() => setSelectedIncident(null)}
                                style={{
                                    padding: "10px 20px",
                                    borderRadius: 10,
                                    border: "1px solid #E5E7EB",
                                    background: "#fff",
                                    color: "#374151",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
