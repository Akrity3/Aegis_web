"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { AdminIncident } from "@/lib/api/admin";

// Dynamic import of admin-specific Leaflet map to avoid SSR issues
const AdminLeafletMap = dynamic(() => import("@/lib/components/map/AdminLeafletMap"), {
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
            <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#16a34a"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="animate-spin"
            >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
        </div>
    ),
});

export default function AdminSafetyMapPage() {
    const [showIncidents, setShowIncidents] = useState(true);
    const [showAlerts, setShowAlerts] = useState(true);
    const [showRiskZones, setShowRiskZones] = useState(true);
    const [showHeatmap, setShowHeatmap] = useState(false);

    const handleIncidentClick = (incident: AdminIncident) => {
        console.log("Incident clicked:", incident._id);
    };

    return (
        <div className="animate-fade-in-up" style={{ maxWidth: 1400, margin: "0 auto" }}>
            {/* Page Header */}
            <div style={{ marginBottom: 28 }}>
                <h1
                    style={{
                        fontSize: 26,
                        fontWeight: 800,
                        color: "#0f172a",
                        letterSpacing: "-0.5px",
                        lineHeight: 1.2,
                        marginBottom: 6,
                    }}
                >
                    Admin Safety Map
                </h1>
                <p style={{ fontSize: 14, color: "#6b7280" }}>
                    View all incidents, alerts, and risk zones across the platform.
                </p>
            </div>

            {/* Map Filters */}
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 16,
                    marginBottom: 24,
                    padding: "20px",
                    borderRadius: 16,
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    boxShadow: "var(--shadow-sm)",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input
                        type="checkbox"
                        id="show-incidents"
                        checked={showIncidents}
                        onChange={(e) => setShowIncidents(e.target.checked)}
                        style={{ width: 18, height: 18, cursor: "pointer" }}
                    />
                    <label htmlFor="show-incidents" style={{ fontSize: 14, fontWeight: 600, color: "#374151", cursor: "pointer" }}>
                        Incidents
                    </label>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input
                        type="checkbox"
                        id="show-alerts"
                        checked={showAlerts}
                        onChange={(e) => setShowAlerts(e.target.checked)}
                        style={{ width: 18, height: 18, cursor: "pointer" }}
                    />
                    <label htmlFor="show-alerts" style={{ fontSize: 14, fontWeight: 600, color: "#374151", cursor: "pointer" }}>
                        SOS Alerts
                    </label>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input
                        type="checkbox"
                        id="show-risk-zones"
                        checked={showRiskZones}
                        onChange={(e) => setShowRiskZones(e.target.checked)}
                        style={{ width: 18, height: 18, cursor: "pointer" }}
                    />
                    <label htmlFor="show-risk-zones" style={{ fontSize: 14, fontWeight: 600, color: "#374151", cursor: "pointer" }}>
                        Risk Zones
                    </label>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input
                        type="checkbox"
                        id="show-heatmap"
                        checked={showHeatmap}
                        onChange={(e) => setShowHeatmap(e.target.checked)}
                        style={{ width: 18, height: 18, cursor: "pointer" }}
                    />
                    <label htmlFor="show-heatmap" style={{ fontSize: 14, fontWeight: 600, color: "#374151", cursor: "pointer" }}>
                        Heatmap
                    </label>
                </div>
            </div>

            {/* Map Container */}
            <div
                style={{
                    background: "#fff",
                    borderRadius: 16,
                    border: "1px solid #e5e7eb",
                    boxShadow: "var(--shadow-sm)",
                    padding: "20px",
                }}
            >
                <AdminLeafletMap
                    showIncidents={showIncidents}
                    showAlerts={showAlerts}
                    showRiskZones={showRiskZones}
                    showHeatmap={showHeatmap}
                    onIncidentClick={handleIncidentClick}
                />
            </div>

            {/* Legend */}
            <div
                style={{
                    marginTop: 20,
                    padding: "20px",
                    borderRadius: 16,
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    boxShadow: "var(--shadow-sm)",
                }}
            >
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>
                    Map Legend
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div
                            style={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                background: "#3b82f6",
                                border: "2px solid white",
                                boxShadow: "0 0 0 2px #3b82f6",
                            }}
                        />
                        <span style={{ fontSize: 13, color: "#374151" }}>Your Location</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div
                            style={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                background: "#dc2626",
                            }}
                        />
                        <span style={{ fontSize: 13, color: "#374151" }}>Harassment</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div
                            style={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                background: "#f59e0b",
                            }}
                        />
                        <span style={{ fontSize: 13, color: "#374151" }}>Road Accident</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div
                            style={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                background: "#8b5cf6",
                            }}
                        />
                        <span style={{ fontSize: 13, color: "#374151" }}>Theft / Robbery</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div
                            style={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                background: "#3b82f6",
                            }}
                        />
                        <span style={{ fontSize: 13, color: "#374151" }}>Suspicious Activity</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div
                            style={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                background: "#06b6d4",
                            }}
                        />
                        <span style={{ fontSize: 13, color: "#374151" }}>Natural Disaster</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div
                            style={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                background: "#ef4444",
                            }}
                        />
                        <span style={{ fontSize: 13, color: "#374151" }}>Fire Emergency</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div
                            style={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                background: "#a855f7",
                            }}
                        />
                        <span style={{ fontSize: 13, color: "#374151" }}>Infrastructure Hazard</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div
                            style={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                background: "#6b7280",
                            }}
                        />
                        <span style={{ fontSize: 13, color: "#374151" }}>Other</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div
                            style={{
                                width: 24,
                                height: 24,
                                borderRadius: "50%",
                                background: "rgba(239, 68, 68, 0.2)",
                                border: "2px solid #ef4444",
                            }}
                        />
                        <span style={{ fontSize: 13, color: "#374151" }}>Risk Zone</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div
                            style={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                background: "#ef4444",
                                border: "2px solid white",
                            }}
                        />
                        <span style={{ fontSize: 13, color: "#374151" }}>SOS Alert</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div
                            style={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                background: "#8b5cf6",
                                border: "2px solid white",
                            }}
                        />
                        <span style={{ fontSize: 13, color: "#374151" }}>High Risk Area</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
