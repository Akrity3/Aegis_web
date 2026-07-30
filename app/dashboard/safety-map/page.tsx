"use client";

import { useAuth } from "@/context/AuthContext";
import { type Incident } from "@/lib/api/incident";
import dynamic from "next/dynamic";
import { useState } from "react";

// Dynamic import for LeafletMap (client-side only)
const LeafletMap = dynamic(() => import("@/lib/components/map/LeafletMap"), {
    ssr: false,
    loading: () => (
        <div
            style={{
                height: 450,
                borderRadius: 16,
                background: "#f9fafb",
                border: "1px solid #E5E7EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 12,
                }}
            >
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="animate-spin"
                    style={{ color: "#16a34a" }}
                >
                    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                </svg>
                <span style={{ fontSize: 14, color: "#6b7280" }}>
                    Loading map...
                </span>
            </div>
        </div>
    ),
});

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
    const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

    if (authLoading) {
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
                            Interactive Safety Map
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
                    <LeafletMap onIncidentClick={setSelectedIncident} />
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
