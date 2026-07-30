"use client";

import { useState } from "react";

interface MapControlsProps {
    radius: number;
    onRadiusChange: (radius: number) => void;
    selectedCategories: string[];
    onCategoryToggle: (category: string) => void;
    showCommunityLayer: boolean;
    onCommunityLayerToggle: (show: boolean) => void;
    onRefresh: () => void;
    onCenterOnUser: () => void;
    loading: boolean;
}

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

function MapPinIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    );
}

function RefreshIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
        </svg>
    );
}

export default function MapControls({
    radius,
    onRadiusChange,
    selectedCategories,
    onCategoryToggle,
    showCommunityLayer,
    onCommunityLayerToggle,
    onRefresh,
    onCenterOnUser,
    loading,
}: MapControlsProps) {
    const [showFilters, setShowFilters] = useState(false);

    return (
        <div
            style={{
                position: "absolute",
                top: 20,
                right: 20,
                zIndex: 1000,
                display: "flex",
                flexDirection: "column",
                gap: 10,
            }}
        >
            {/* Main controls */}
            <div
                style={{
                    background: "#fff",
                    borderRadius: 12,
                    padding: 12,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    minWidth: 200,
                }}
            >
                {/* Radius slider */}
                <div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 6,
                        }}
                    >
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>
                            Search Radius
                        </span>
                        <span style={{ fontSize: 12, color: "#6b7280" }}>{radius} km</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="50"
                        value={radius}
                        onChange={(e) => onRadiusChange(Number(e.target.value))}
                        style={{
                            width: "100%",
                            cursor: "pointer",
                        }}
                    />
                </div>

                {/* Toggle filters button */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    style={{
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: "1px solid #E5E7EB",
                        background: "#fff",
                        color: "#374151",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#f9fafb";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#fff";
                    }}
                >
                    <span>Filters ({selectedCategories.length})</span>
                    <span style={{ fontSize: 10 }}>{showFilters ? "▼" : "▶"}</span>
                </button>

                {/* Category filters */}
                {showFilters && (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 6,
                            padding: 8,
                            background: "#f9fafb",
                            borderRadius: 8,
                        }}
                    >
                        {INCIDENT_CATEGORIES.map((category) => (
                            <label
                                key={category}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    cursor: "pointer",
                                    fontSize: 11,
                                    color: "#374151",
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(category)}
                                    onChange={() => onCategoryToggle(category)}
                                    style={{
                                        width: 14,
                                        height: 14,
                                        accentColor: "#16a34a",
                                        cursor: "pointer",
                                    }}
                                />
                                <div
                                    style={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: "50%",
                                        background: getCategoryColor(category),
                                        flexShrink: 0,
                                    }}
                                />
                                <span>{category}</span>
                            </label>
                        ))}
                    </div>
                )}

                {/* Community layer toggle */}
                <label
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        cursor: "pointer",
                        fontSize: 12,
                        color: "#374151",
                    }}
                >
                    <input
                        type="checkbox"
                        checked={showCommunityLayer}
                        onChange={(e) => onCommunityLayerToggle(e.target.checked)}
                        style={{
                            width: 14,
                            height: 14,
                            accentColor: "#16a34a",
                            cursor: "pointer",
                        }}
                    />
                    <span>Show Community Layer</span>
                </label>
            </div>

            {/* Action buttons */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                }}
            >
                <button
                    onClick={onRefresh}
                    disabled={loading}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        border: "none",
                        background: "#fff",
                        color: "#374151",
                        cursor: loading ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        transition: "all 0.15s",
                        opacity: loading ? 0.6 : 1,
                    }}
                    onMouseEnter={(e) => {
                        if (!loading) {
                            e.currentTarget.style.background = "#f9fafb";
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#fff";
                    }}
                    title="Refresh"
                >
                    {loading ? (
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            className="animate-spin"
                        >
                            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                        </svg>
                    ) : (
                        <RefreshIcon />
                    )}
                </button>

                <button
                    onClick={onCenterOnUser}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        border: "none",
                        background: "#16a34a",
                        color: "#fff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 12px rgba(22,163,74,0.3)",
                        transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#15803d";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#16a34a";
                    }}
                    title="Center on my location"
                >
                    <MapPinIcon />
                </button>
            </div>
        </div>
    );
}
