"use client";

import { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import IncidentMarker from "./IncidentMarker";
import RiskZoneOverlay from "./RiskZoneOverlay";
import MapControls from "./MapControls";
import { getCurrentLocation, isGeolocationSupported } from "@/lib/utils/location";
import type { Incident } from "@/lib/api/incident";
import { getNearbyIncidents, getRiskZones, getPublicIncidents } from "@/lib/api/incident";

// Custom user location icon
const userLocationIcon = L.divIcon({
    className: "custom-user-marker",
    html: `
        <div style="
            width: 20px;
            height: 20px;
            background: #3b82f6;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            position: relative;
        ">
            <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 8px;
                height: 8px;
                background: white;
                border-radius: 50%;
            "></div>
        </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
});

interface LeafletMapProps {
    onIncidentClick?: (incident: Incident) => void;
}

// Component to center map on user location
function MapCenterController({ center }: { center: [number, number] | null }) {
    const map = useMap();

    useEffect(() => {
        if (center) {
            map.setView(center, 13);
        }
    }, [center, map]);

    return null;
}

export default function LeafletMap({ onIncidentClick }: LeafletMapProps) {
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [riskZones, setRiskZones] = useState<any[]>([]);
    const [communityIncidents, setCommunityIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [radius, setRadius] = useState(10);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([
        "Harassment",
        "Road Accident",
        "Theft / Robbery",
        "Suspicious Activity",
        "Natural Disaster",
        "Fire Emergency",
        "Unsafe Infrastructure / Road Hazard",
        "Other",
    ]);
    const [showCommunityLayer, setShowCommunityLayer] = useState(false);

    // Get user location on mount
    useEffect(() => {
        const fetchLocation = async () => {
            if (!isGeolocationSupported()) {
                setError("Geolocation is not supported by your browser. Showing the default area instead.");
                setLoading(false);
                return;
            }

            try {
                const location = await getCurrentLocation();
                setUserLocation([location.latitude, location.longitude]);
            } catch (err: any) {
                setError((err.message || "Unable to get your location") + " Showing the default area instead.");
                setLoading(false);
            }
        };

        fetchLocation();
    }, []);

    // Fetch incidents when location or radius changes
    useEffect(() => {
        const fetchData = async () => {
            const searchCenter: [number, number] = userLocation || [27.7172, 85.324];

            setLoading(true);
            setError(null);

            try {
                // Fetch nearby incidents (primary data source)
                const nearbyResponse = await getNearbyIncidents(
                    searchCenter[0],
                    searchCenter[1],
                    radius
                );

                if (nearbyResponse.success) {
                    // Filter by selected categories
                    const filtered = nearbyResponse.data.filter((incident) =>
                        selectedCategories.includes(incident.category)
                    );
                    setIncidents(filtered);
                }

                // Fetch risk zones
                const riskZonesResponse = await getRiskZones(
                    searchCenter[0],
                    searchCenter[1],
                    radius
                );

                if (riskZonesResponse.success) {
                    const rawZones = Array.isArray(riskZonesResponse.data)
                        ? riskZonesResponse.data
                        : Object.entries(riskZonesResponse.data || {}).map(
                              ([category, data]: [string, any]) => ({
                                  category,
                                  count: data?.count || 0,
                                  incidents: data?.incidents || [],
                              })
                          );

                    const zones = rawZones
                        .map((zone: any) => {
                            const incidentsForZone = Array.isArray(zone.incidents) ? zone.incidents : [];
                            const latitudes = incidentsForZone
                                .map((incident: any) => incident.latitude)
                                .filter((lat: unknown) => typeof lat === "number" && Number.isFinite(lat));
                            const longitudes = incidentsForZone
                                .map((incident: any) => incident.longitude)
                                .filter((lng: unknown) => typeof lng === "number" && Number.isFinite(lng));

                            const averageLatitude =
                                latitudes.length > 0
                                    ? latitudes.reduce((sum: number, lat: number) => sum + lat, 0) / latitudes.length
                                    : searchCenter[0];
                            const averageLongitude =
                                longitudes.length > 0
                                    ? longitudes.reduce((sum: number, lng: number) => sum + lng, 0) / longitudes.length
                                    : searchCenter[1];

                            const normalizedCount = typeof zone.count === "number" ? zone.count : incidentsForZone.length;

                            return {
                                center: [averageLatitude, averageLongitude] as [number, number],
                                radius: Math.max(1, Math.min(radius, normalizedCount || 1)),
                                count: normalizedCount,
                                category: zone.category || "Other",
                            };
                        })
                        .filter((zone) => zone.count > 0);

                    setRiskZones(zones);
                }

                // Fetch community incidents if layer is enabled
                if (showCommunityLayer) {
                    const publicResponse = await getPublicIncidents();
                    if (publicResponse.success) {
                        const filtered = publicResponse.data.filter((incident) =>
                            selectedCategories.includes(incident.category)
                        );
                        setCommunityIncidents(filtered);
                    }
                } else {
                    setCommunityIncidents([]);
                }
            } catch (err: any) {
                setError(err.message || "Failed to fetch incidents");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userLocation, radius, selectedCategories, showCommunityLayer]);

    const handleCategoryToggle = useCallback((category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    }, []);

    const handleRefresh = useCallback(() => {
        if (userLocation) {
            // Trigger re-fetch by toggling loading state
            setLoading(true);
            setTimeout(() => setLoading(false), 100);
        }
    }, [userLocation]);

    const handleCenterOnUser = useCallback(() => {
        if (userLocation) {
            setUserLocation([...userLocation]); // Force re-render
        }
    }, [userLocation]);

    // Show loading state
    if (loading && !userLocation) {
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
                        Getting your location...
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div style={{ position: "relative", height: 450, borderRadius: 16, overflow: "hidden" }}>
            {error && (
                <div
                    style={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        right: 12,
                        zIndex: 1100,
                        padding: "10px 12px",
                        borderRadius: 10,
                        background: "rgba(254, 242, 242, 0.96)",
                        border: "1px solid #fecaca",
                        color: "#991b1b",
                        fontSize: 12,
                        boxShadow: "0 4px 12px rgba(15,23,42,0.08)",
                    }}
                >
                    {error}
                </div>
            )}
            <MapContainer
                center={userLocation || [27.7172, 85.324]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapCenterController center={userLocation} />

                {/* User location marker */}
                {userLocation && (
                    <Marker position={userLocation} icon={userLocationIcon} />
                )}

                {/* Risk zone overlays */}
                <RiskZoneOverlay riskZones={riskZones} />

                {/* Nearby incident markers */}
                {incidents.map((incident) => (
                    <IncidentMarker
                        key={incident._id}
                        incident={incident}
                        onClick={onIncidentClick}
                    />
                ))}

                {/* Community incident markers */}
                {showCommunityLayer &&
                    communityIncidents
                        .filter(
                            (ci) => !incidents.some((i) => i._id === ci._id)
                        )
                        .map((incident) => (
                            <IncidentMarker
                                key={`community-${incident._id}`}
                                incident={incident}
                                onClick={onIncidentClick}
                            />
                        ))}
            </MapContainer>

            {/* Map controls */}
            <MapControls
                radius={radius}
                onRadiusChange={setRadius}
                selectedCategories={selectedCategories}
                onCategoryToggle={handleCategoryToggle}
                showCommunityLayer={showCommunityLayer}
                onCommunityLayerToggle={setShowCommunityLayer}
                onRefresh={handleRefresh}
                onCenterOnUser={handleCenterOnUser}
                loading={loading}
            />
        </div>
    );
}
