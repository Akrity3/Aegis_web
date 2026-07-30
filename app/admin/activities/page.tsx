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
function ActivityEmptyIcon() {
    return (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
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
        login: { bg: "#dbeafe", color: "#1e40af", border: "#bfdbfe" },
        logout: { bg: "#fce7f3", color: "#9d174d", border: "#fbcfe8" },
        incident: { bg: "#fef3c7", color: "#b45309", border: "#fde68a" },
        alert: { bg: "#fee2e2", color: "#dc2626", border: "#fecaca" },
        user: { bg: "#e0e7ff", color: "#4338ca", border: "#c7d2fe" },
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
export default function AdminActivitiesPage() {
    const toast = useToast();
    const [activities, setActivities] = useState<AdminActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState<string>("all");

    // Export to CSV
    const exportToCSV = () => {
        const headers = ['ID', 'User ID', 'Type', 'Description', 'IP Address', 'User Agent', 'Created At'];
        const csvContent = [
            headers.join(','),
            ...activities.map(activity => [
                activity._id,
                activity.userId,
                activity.type,
                `"${activity.description.replace(/"/g, '""')}"`,
                activity.ipAddress || '',
                `"${(activity.userAgent || '').replace(/"/g, '""')}"`,
                new Date(activity.createdAt).toISOString()
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `activity-logs-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.showToast('Activity logs exported successfully', 'success');
    };

    // Fetch activities
    const fetchActivities = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const filters: any = {};
            if (selectedType !== "all") filters.type = selectedType;
            if (searchQuery) filters.search = searchQuery;
            
            const response = await getAdminActivities(1, 100, filters);
            if (response.success) {
                setActivities(response.data);
            } else {
                setError(response.message || "Failed to fetch activities");
            }
        } catch (err: any) {
            setError(err?.message || "Failed to fetch activities");
        } finally {
            setLoading(false);
        }
    }, [selectedType, searchQuery]);

    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);

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
                    Activity Logs
                </h1>
                <p style={{ fontSize: 14, color: "#6b7280" }}>
                    View all user activities and system events across the platform.
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
                        placeholder="Search activities..."
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
                        <option value="login">Login</option>
                        <option value="logout">Logout</option>
                        <option value="incident">Incident</option>
                        <option value="alert">Alert</option>
                        <option value="user">User</option>
                    </select>
                    <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#9ca3af" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                    </div>
                </div>

                {/* Export Button */}
                <button
                    onClick={exportToCSV}
                    disabled={activities.length === 0}
                    style={{
                        padding: "10px 20px",
                        borderRadius: 10,
                        border: "1.5px solid #16a34a",
                        background: "#fff",
                        color: "#16a34a",
                        fontSize: 13.5,
                        fontWeight: 600,
                        cursor: activities.length === 0 ? "not-allowed" : "pointer",
                        opacity: activities.length === 0 ? 0.5 : 1,
                        transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => { if (activities.length > 0) { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.color = "#fff"; } }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#16a34a"; }}
                >
                    Export CSV
                </button>
            </div>

            {/* Activities Table */}
            <div
                style={{
                    background: "#fff",
                    borderRadius: 16,
                    border: "1px solid #e5e7eb",
                    boxShadow: "var(--shadow-sm)",
                    overflow: "hidden",
                }}
            >
                {loading ? (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                                {["ID", "User ID", "Type", "Description", "IP Address", "Timestamp"].map((h) => (
                                    <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.7px" }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(5)].map((_, i) => <SkeletonTableRow key={i} />)}
                        </tbody>
                    </table>
                ) : error ? (
                    <div style={{ padding: "64px 32px", textAlign: "center" }}>
                        <p style={{ fontSize: 15, color: "#dc2626", marginBottom: 16 }}>{error}</p>
                        <button
                            onClick={fetchActivities}
                            style={{
                                padding: "10px 20px",
                                background: "#16a34a",
                                color: "#fff",
                                border: "none",
                                borderRadius: 8,
                                cursor: "pointer",
                                fontSize: 14,
                                fontWeight: 600,
                            }}
                        >
                            Retry
                        </button>
                    </div>
                ) : activities.length === 0 ? (
                    <div style={{ padding: "64px 32px", textAlign: "center" }}>
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                            <ActivityEmptyIcon />
                        </div>
                        <p style={{ fontSize: 15, fontWeight: 600, color: "#0f172a", marginBottom: 6 }}>
                            No activities found
                        </p>
                        <p style={{ fontSize: 13, color: "#6b7280" }}>
                            {searchQuery || selectedType !== "all"
                                ? "Try adjusting your filters"
                                : "No activities have been logged yet"}
                        </p>
                    </div>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                                {["ID", "User ID", "Type", "Description", "IP Address", "Timestamp"].map((h) => (
                                    <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.7px" }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {activities.map((activity) => (
                                <tr key={activity._id} style={{ borderBottom: "1px solid #f3f4f6", transition: "background 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#6b7280", fontFamily: "monospace" }}>
                                        {truncateId(activity._id)}
                                    </td>
                                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#6b7280", fontFamily: "monospace" }}>
                                        {truncateId(activity.userId)}
                                    </td>
                                    <td style={{ padding: "14px 16px" }}>
                                        <TypeBadge type={activity.type} />
                                    </td>
                                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151", maxWidth: 250, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {activity.description}
                                    </td>
                                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#6b7280", fontFamily: "monospace" }}>
                                        {activity.ipAddress || "—"}
                                    </td>
                                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#6b7280" }}>
                                        {formatDate(activity.createdAt)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
