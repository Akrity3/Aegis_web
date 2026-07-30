"use client";

import { useEffect, useMemo, useState } from "react";
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
    type AdminAlert,
    type AdminIncident,
    type RiskZoneSummary,
    getAdminAlerts,
    getAdminDashboard,
    getAdminIncidents,
} from "@/lib/api/admin";

const DEFAULT_CENTER: [number, number] = [27.7172, 85.324];

function createPinIcon(color: string, size: number = 18): L.DivIcon {
    return L.divIcon({
        className: "custom-admin-map-marker",
        html: `
            <div style="
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 10px rgba(15,23,42,0.28);
            "></div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -(size / 2)],
    });
}

const alertIcon = L.divIcon({
    className: "custom-admin-alert-marker",
    html: `
        <div style="
            width: 20px;
            height: 20px;
            background: #ef4444;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 0 0 6px rgba(239, 68, 68, 0.20), 0 2px 10px rgba(15,23,42,0.28);
        "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
});

function getIncidentColor(category: string): string {
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
            return "#0ea5e9";
        case "Fire Emergency":
            return "#ef4444";
        case "Unsafe Infrastructure / Road Hazard":
            return "#65a30d";
        default:
            return "#6b7280";
    }
}

function getRiskZoneStyle(riskLevel: string) {
    switch (riskLevel) {
        case "high":
            return { color: "#dc2626", fillOpacity: 0.24, radius: 900 };
        case "medium":
            return { color: "#f59e0b", fillOpacity: 0.18, radius: 650 };
        default:
            return { color: "#8b5cf6", fillOpacity: 0.14, radius: 450 };
    }
}

function isValidCoordinate(latitude: unknown, longitude: unknown): latitude is number {
    return (
        typeof latitude === "number" &&
        Number.isFinite(latitude) &&
        typeof longitude === "number" &&
        Number.isFinite(longitude)
    );
}

function MapCenterController({ center }: { center: [number, number] }) {
    const map = useMap();

    useEffect(() => {
        map.setView(center, map.getZoom(), { animate: false });
    }, [center, map]);

    return null;
}

interface AdminLeafletMapProps {
    showIncidents: boolean;
    showAlerts: boolean;
    showRiskZones: boolean;
    showHeatmap: boolean;
    onIncidentClick?: (incident: AdminIncident) => void;
}

export default function AdminLeafletMap({
    showIncidents,
    showAlerts,
    showRiskZones,
    showHeatmap,
    onIncidentClick,
}: AdminLeafletMapProps) {
    const [incidents, setIncidents] = useState<AdminIncident[]>([]);
    const [alerts, setAlerts] = useState<AdminAlert[]>([]);
    const [riskZones, setRiskZones] = useState<RiskZoneSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isActive = true;

        const fetchMapData = async () => {
            setLoading(true);
            setError(null);

            try {
                const [incidentResponse, alertResponse, dashboardResponse] = await Promise.all([
                    getAdminIncidents(1, 200),
                    getAdminAlerts(1, 200),
                    getAdminDashboard(),
                ]);

                if (!isActive) return;

                setIncidents(
                    (incidentResponse.data || []).filter((incident) =>
                        isValidCoordinate(incident.latitude, incident.longitude)
                    )
                );
                setAlerts(
                    (alertResponse.data || []).filter((alert) =>
                        isValidCoordinate(alert.latitude, alert.longitude)
                    )
                );
                setRiskZones(
                    (dashboardResponse.data?.riskZoneSummary || []).filter((zone) =>
                        isValidCoordinate(zone.latitude, zone.longitude)
                    )
                );
            } catch (err: any) {
                if (!isActive) return;
                setError(err?.message || "Failed to load admin map data");
            } finally {
                if (isActive) {
                    setLoading(false);
                }
            }
        };

        fetchMapData();

        return () => {
            isActive = false;
        };
    }, []);

    const mapCenter = useMemo<[number, number]>(() => {
        const points: Array<[number, number]> = [];

        if (showIncidents) {
            incidents.forEach((incident) => {
                points.push([incident.latitude, incident.longitude]);
            });
        }

        if (showAlerts) {
            alerts.forEach((alert) => {
                points.push([alert.latitude, alert.longitude]);
            });
        }

        if (showRiskZones) {
            riskZones.forEach((zone) => {
                points.push([zone.latitude, zone.longitude]);
            });
        }

        if (points.length === 0) {
            return DEFAULT_CENTER;
        }

        const [latSum, lngSum] = points.reduce(
            (acc, [lat, lng]) => [acc[0] + lat, acc[1] + lng],
            [0, 0]
        );

        return [latSum / points.length, lngSum / points.length];
    }, [alerts, incidents, riskZones, showAlerts, showIncidents, showRiskZones]);

    if (loading) {
        return (
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
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
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
                    <span style={{ fontSize: 14, color: "#6b7280" }}>Loading admin map data...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div
                style={{
                    height: 450,
                    borderRadius: 16,
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 20,
                }}
            >
                <div style={{ maxWidth: 360, textAlign: "center" }}>
                    <p style={{ fontSize: 14, color: "#991b1b", margin: 0, marginBottom: 8 }}>{error}</p>
                    <p style={{ fontSize: 12, color: "#b91c1c", margin: 0 }}>
                        The map will recover once the admin incident and alert APIs respond again.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ position: "relative", height: 450, borderRadius: 16, overflow: "hidden" }}>
            <MapContainer center={mapCenter} zoom={12} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapCenterController center={mapCenter} />

                {showHeatmap &&
                    showIncidents &&
                    incidents.map((incident) => (
                        <Circle
                            key={`heat-${incident._id}`}
                            center={[incident.latitude, incident.longitude]}
                            radius={250}
                            pathOptions={{
                                color: getIncidentColor(incident.category),
                                fillColor: getIncidentColor(incident.category),
                                fillOpacity: 0.08,
                                opacity: 0,
                            }}
                        />
                    ))}

                {showRiskZones &&
                    riskZones.map((zone, index) => {
                        const style = getRiskZoneStyle(zone.riskLevel);

                        return (
                            <Circle
                                key={`risk-zone-${index}`}
                                center={[zone.latitude, zone.longitude]}
                                radius={style.radius}
                                pathOptions={{
                                    color: style.color,
                                    fillColor: style.color,
                                    fillOpacity: style.fillOpacity,
                                    weight: 2,
                                }}
                            >
                                <Popup>
                                    <div style={{ minWidth: 180 }}>
                                        <strong style={{ fontSize: 13, color: "#0f172a" }}>Risk Zone</strong>
                                        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
                                            Incidents clustered here: {zone.incidentCount}
                                        </div>
                                        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                                            Risk level: {zone.riskLevel}
                                        </div>
                                    </div>
                                </Popup>
                            </Circle>
                        );
                    })}

                {showIncidents &&
                    incidents.map((incident) => (
                        <Marker
                            key={incident._id}
                            position={[incident.latitude, incident.longitude]}
                            icon={createPinIcon(getIncidentColor(incident.category))}
                            eventHandlers={{
                                click: () => onIncidentClick?.(incident),
                            }}
                        >
                            <Popup>
                                <div style={{ minWidth: 220 }}>
                                    <strong style={{ fontSize: 13, color: "#0f172a" }}>{incident.category}</strong>
                                    <p style={{ fontSize: 12, color: "#6b7280", margin: "8px 0" }}>
                                        {incident.description}
                                    </p>
                                    <div style={{ fontSize: 11, color: "#6b7280" }}>
                                        Status: {incident.status}
                                    </div>
                                    <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>
                                        {incident.address || `${incident.latitude.toFixed(6)}, ${incident.longitude.toFixed(6)}`}
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                {showAlerts &&
                    alerts.map((alert) => (
                        <Marker
                            key={alert._id}
                            position={[alert.latitude, alert.longitude]}
                            icon={alertIcon}
                        >
                            <Popup>
                                <div style={{ minWidth: 220 }}>
                                    <strong style={{ fontSize: 13, color: "#0f172a" }}>SOS Alert</strong>
                                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>
                                        Status: {alert.status}
                                    </div>
                                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                                        {alert.address || `${alert.latitude.toFixed(6)}, ${alert.longitude.toFixed(6)}`}
                                    </div>
                                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 6 }}>
                                        {new Date(alert.triggeredAt).toLocaleString()}
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
            </MapContainer>
        </div>
    );
}
