"use client";

import { Circle, Popup } from "react-leaflet";
import L from "leaflet";

interface RiskZoneData {
    center: [number, number];
    radius: number;
    count: number;
    category: string;
}

interface RiskZoneOverlayProps {
    riskZones: RiskZoneData[];
}

// Risk level colors based on incident count
function getRiskColor(count: number): string {
    if (count >= 10) return "#dc2626"; // High risk - red
    if (count >= 5) return "#f59e0b"; // Medium risk - orange
    return "#fbbf24"; // Low risk - yellow
}

function getRiskOpacity(count: number): number {
    if (count >= 10) return 0.3;
    if (count >= 5) return 0.25;
    return 0.2;
}

export default function RiskZoneOverlay({ riskZones }: RiskZoneOverlayProps) {
    if (riskZones.length === 0) return null;

    return (
        <>
            {riskZones.map((zone, index) => {
                const color = getRiskColor(zone.count);
                const opacity = getRiskOpacity(zone.count);

                return (
                    <Circle
                        key={index}
                        center={zone.center}
                        radius={zone.radius * 1000} // Convert km to meters
                        pathOptions={{
                            color,
                            fillColor: color,
                            fillOpacity: opacity,
                            weight: 2,
                        }}
                    >
                        <Popup>
                            <div style={{ minWidth: 180 }}>
                                <div
                                    style={{
                                        fontSize: 13,
                                        fontWeight: 700,
                                        color: "#0f172a",
                                        marginBottom: 6,
                                    }}
                                >
                                    Risk Zone
                                </div>
                                <div
                                    style={{
                                        fontSize: 11,
                                        color: "#6b7280",
                                        marginBottom: 4,
                                    }}
                                >
                                    Category: {zone.category}
                                </div>
                                <div
                                    style={{
                                        fontSize: 11,
                                        color: "#6b7280",
                                        marginBottom: 4,
                                    }}
                                >
                                    Incidents: {zone.count}
                                </div>
                                <div
                                    style={{
                                        fontSize: 11,
                                        color: "#6b7280",
                                    }}
                                >
                                    Radius: {zone.radius} km
                                </div>
                            </div>
                        </Popup>
                    </Circle>
                );
            })}
        </>
    );
}
