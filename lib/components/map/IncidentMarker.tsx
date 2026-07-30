"use client";

import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import type { Incident } from "@/lib/api/incident";

// Custom icon creator
function createCustomIcon(color: string): L.DivIcon {
    return L.divIcon({
        className: "custom-incident-marker",
        html: `
            <div style="
                width: 24px;
                height: 24px;
                background: ${color};
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                cursor: pointer;
                transition: transform 0.2s;
            "></div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12],
    });
}

// Category color mapping (same as in safety-map page)
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

interface IncidentMarkerProps {
    incident: Incident;
    onClick?: (incident: Incident) => void;
}

export default function IncidentMarker({ incident, onClick }: IncidentMarkerProps) {
    const color = getCategoryColor(incident.category);
    const customIcon = createCustomIcon(color);

    return (
        <Marker
            position={[incident.latitude, incident.longitude]}
            icon={customIcon}
            eventHandlers={{
                click: () => {
                    if (onClick) {
                        onClick(incident);
                    }
                },
            }}
        >
            <Popup>
                <div style={{ minWidth: 200 }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 8,
                        }}
                    >
                        <div
                            style={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                background: color,
                                flexShrink: 0,
                            }}
                        />
                        <strong style={{ fontSize: 14, color: "#0f172a" }}>
                            {incident.category}
                        </strong>
                    </div>
                    <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 8px 0" }}>
                        {incident.description}
                    </p>
                    <div
                        style={{
                            fontSize: 11,
                            color: "#9ca3af",
                            padding: "6px 8px",
                            background: "#f9fafb",
                            borderRadius: 4,
                        }}
                    >
                        {incident.address ||
                            `${incident.latitude.toFixed(6)}, ${incident.longitude.toFixed(6)}`}
                    </div>
                    <div
                        style={{
                            fontSize: 10,
                            color: "#9ca3af",
                            marginTop: 6,
                        }}
                    >
                        {new Date(incident.reportedAt).toLocaleString()}
                    </div>
                </div>
            </Popup>
        </Marker>
    );
}
