"use client";

import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/app/dashboard/_components/ToastContext";
import { getAdminActivities, AdminActivity } from "@/lib/api/admin";

// SVG Icons
function SearchIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    );
}
function SpinnerIcon({ size = 16 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="animate-spin">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    );
}
function NotificationEmptyIcon() {
    return (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
    );
}

// Helpers
function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function truncateId(id: string): string {
    return id.length > 8 ? `${id.slice(0, 8)}…` : id;
}

// Type badge
function TypeBadge({ type }: { type: string }) {
    const colors: Record<string, { bg: string; color: string; border: string }> = {
        incident: { bg: "#fef3c7", color: "#b45309", border: "#fde68a" },
        alert: { bg: "#fee2e2", color: "#dc2626", border: "#fecaca" },
        system: { bg: "#e0e7ff", color: "#4338ca", border: "#c7d2fe" },
        safety: { bg: "#dbeafe", color: "#1e40af", border: "#bfdbfe" },
        default: { bg: "#f3f4f6", color: "#374151", border: "#e5e7eb" },
    };
    
    const style = colors[type.toLowerCase()] || colors.default;
    
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "3px 10px",
                borderRadius: 999,
                fontSize: 11.5,
                fontWeight: 600,
                background: style.bg,
                color: style.color,
                border: `1px solid ${style.border}`,
                textTransform: "capitalize",
            }}
        >
            {type}
        </span>
    );
}

// Skeleton row
function SkeletonTableRow() {
    return (
        <tr>
            {[140, 100, 120, 80, 80, 120].map((w, i) => (
                <td key={i} style={{ padding: "14px 16px" }}>
                    <div className="animate-shimmer" style={{ height: 14, width: w, borderRadius: 6 }} />
                </td>
            ))}
        </tr>
    );
}

// Main Page
export default function AdminNotificationsPage() {
    const toast = useToast();
    const [notifications, setNotifications] = useState<AdminActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState<string>("all");

    // Fetch notifications (using activities as proxy for now)
    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const filters: any = {};
            if (selectedType !== "all") filters.type = selectedType;
            if (searchQuery) filters.search = searchQuery;
            
            const response = await getAdminActivities(1, 100, filters);
            if (response.success) {
                setNotifications(response.data);
            } else {
                setError(response.message || "Failed to fetch notifications");
            }
        } catch (err: any) {
            setError(err?.message || "Failed to fetch notifications");
        } finally {
            setLoading(false);
        }
    }, [selectedType, searchQuery]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

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
                    Notifications Center
                </h1>
                <p style={{ fontSize: 14, color: "#6b7280" }}>
                    View and manage system notifications and alerts.
                </p>
            </div>

            {/* Filters */}
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
                {/* Search */}
                <div style={{ position: "relative", flex: 1, minWidth: 250, maxWidth: 400 }}>
                    <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}>
                        <SearchIcon />
                    </span>
                    <input
                        type="text"
                        placeholder="Search notifications..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px 14px 10px 40",
                            borderRadius: 10,
                            border: "1.5px solid #e5e7eb",
                            fontSize: 13.5,
                            color: "#0f172a",
                            background: "#f9fafb",
                            outline: "none",
                        }}
                        onFocus={(e) => { e.target.style.borderColor = "#16a34a"; e.target.style.background = "#fff"; }}
                        onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#f9fafb"; }}
                    />
                </div>

                {/* Type Filter */}
                <div style={{ position: "relative" }}>
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        style={{
                            padding: "10px 14px",
                            borderRadius: 10,
                            border: "1.5px solid #e5e7eb",
                            fontSize: 13.5,
                            color: "#0f172a",
                            background: "#f9fafb",
                            outline: "none",
                            appearance: "none",
                            cursor: "pointer",
                            minWidth: 150,
                        }}
                        onFocus={(e) => { e.target.style.borderColor = "#16a34a"; e.target.style.background = "#fff"; }}
                        onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#f9fafb"; }}
                    >
                        <option value="all">All Types</option>
                        <option value="incident">Incident</option>
                        <option value="alert">Alert</option>
                        <option value="system">System</option>
                        <option value="safety">Safety</option>
                    </select>
                    <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#9ca3af" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                    </div>
                </div>
            </div>

            {/* Notifications Table */}
            <div
                style={{
                    background: "#fff",
                    borderRadius: 16,
                    border: "1px solid #e5e7eb",
                    boxShadow: "var(--shadow-sm)",
                    overflow: "hidden",
                }}
            >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                            <th style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.7px" }}>
                                ID
                            </th>
                            <th style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.7px" }}>
                                Type
                            </th>
                            <th style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.7px" }}>
                                Description
                            </th>
                            <th style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.7px" }}>
                                User ID
                            </th>
                            <th style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.7px" }}>
                                Created At
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => <SkeletonTableRow key={i} />)
                        ) : notifications.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ padding: "64px 16px", textAlign: "center" }}>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                                        <NotificationEmptyIcon />
                                        <p style={{ fontSize: 14, color: "#6b7280" }}>
                                            {searchQuery || selectedType !== "all" ? "No notifications match your filters" : "No notifications found"}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            notifications.map((notification) => (
                                <tr
                                    key={notification._id}
                                    style={{ borderBottom: "1px solid #f3f4f6", transition: "background 0.15s" }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = "#f9fafb"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                                >
                                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#6b7280", fontFamily: "monospace" }}>
                                        {truncateId(notification._id)}
                                    </td>
                                    <td style={{ padding: "14px 16px" }}>
                                        <TypeBadge type={notification.type} />
                                    </td>
                                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151", maxWidth: 300 }}>
                                        {notification.description}
                                    </td>
                                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#6b7280", fontFamily: "monospace" }}>
                                        {truncateId(notification.userId)}
                                    </td>
                                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#6b7280" }}>
                                        {formatDate(notification.createdAt)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {error && (
                <div style={{ marginTop: 20, padding: "16px", borderRadius: 10, background: "#fee2e2", border: "1px solid #fecaca", color: "#dc2626", fontSize: 14 }}>
                    {error}
                </div>
            )}
        </div>
    );
}
