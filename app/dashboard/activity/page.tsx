"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "../_components/ToastContext";
import { getActivities, type Activity } from "@/lib/api/activity";

// ─────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────
function HistoryIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v5h5" />
            <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
            <path d="M12 7v5l4 2" />
        </svg>
    );
}
function ClockIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    );
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

function getActivityIcon(type: string): { icon: React.ReactNode; color: string; label: string } {
    switch (type) {
        case "login":
            return {
                icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                        <polyline points="10 17 15 12 10 7" />
                        <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                ),
                color: "#16a34a",
                label: "Login",
            };
        case "logout":
            return {
                icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                ),
                color: "#6b7280",
                label: "Logout",
            };
        case "profile_updated":
            return {
                icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                ),
                color: "#0ea5e9",
                label: "Profile Updated",
            };
        case "password_changed":
            return {
                icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                ),
                color: "#f59e0b",
                label: "Password Changed",
            };
        case "contact_added":
            return {
                icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <line x1="23" y1="11" x2="17" y2="11" />
                        <line x1="20" y1="8" x2="20" y2="14" />
                    </svg>
                ),
                color: "#16a34a",
                label: "Contact Added",
            };
        case "alert_triggered":
            return {
                icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2l7 4v5c0 5.25-3.5 9.74-7 11-3.5-1.26-7-5.75-7-11V6l7-4z" />
                        <path d="M12 8v4" />
                        <path d="M12 16h.01" />
                    </svg>
                ),
                color: "#dc2626",
                label: "Alert Triggered",
            };
        case "alert_resolved":
            return {
                icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                ),
                color: "#16a34a",
                label: "Alert Resolved",
            };
        case "incident_reported":
            return {
                icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                ),
                color: "#f59e0b",
                label: "Incident Reported",
            };
        default:
            return {
                icon: <ClockIcon />,
                color: "#6b7280",
                label: type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
            };
    }
}

// ─────────────────────────────────────────────
// Activity Card
// ─────────────────────────────────────────────
function ActivityCard({ activity }: { activity: Activity }) {
    const { icon, color, label } = getActivityIcon(activity.type);

    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 12,
                border: "1.5px solid #E5E7EB",
                padding: "14px 16px",
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                gap: 14,
                transition: "all 0.15s",
            }}
        >
            <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `${color}0f`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color, flexShrink: 0,
            }}>
                {icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: 0 }}>
                        {label}
                    </p>
                    <span style={{ fontSize: 11, color: "#9ca3af", whiteSpace: "nowrap", marginLeft: 8 }}>
                        {formatDate(activity.createdAt)}
                    </span>
                </div>
                <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.4 }}>
                    {activity.description}
                </p>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function ActivityHistoryPage() {
    const { loading: authLoading } = useAuth();
    const { showToast } = useToast();

    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch activities
    const fetchActivities = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getActivities();
            if (response.success) {
                setActivities(response.data);
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            showToast(err?.response?.data?.message || err?.message || "Failed to fetch activities", "error");
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);

    if (authLoading || loading) {
        return (
            <div style={{ maxWidth: 600, margin: "0 auto" }}>
                <div style={{ background: "#fff", borderRadius: 22, border: "1px solid #E5E7EB", padding: 32, boxShadow: "var(--shadow-sm)" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="animate-shimmer"
                                style={{
                                    height: 80,
                                    borderRadius: 12,
                                    background: "#f9fafb",
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 600, margin: "0 auto" }}>

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
                        <HistoryIcon />
                    </div>
                    <div>
                        <h2 style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>
                            Activity History
                        </h2>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
                            Track your account activity
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
                            {activities.length} Activity{activities.length !== 1 ? "ies" : ""}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Activities List ───────────────── */}
            <div className="animate-fade-in-up anim-delay-100">
                {activities.length === 0 ? (
                    <div
                        className="animate-fade-in"
                        style={{
                            background: "#fff",
                            borderRadius: 22,
                            border: "1px solid #E5E7EB",
                            padding: "48px 24px",
                            textAlign: "center",
                            boxShadow: "var(--shadow-sm)",
                        }}
                    >
                        <div style={{
                            width: 64, height: 64, borderRadius: "50%",
                            background: "#f0fdf4",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            margin: "0 auto 16px",
                            color: "#16a34a",
                        }}>
                            <HistoryIcon />
                        </div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
                            No Activity Yet
                        </h3>
                        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 0 }}>
                            Your activity history will appear here.
                        </p>
                    </div>
                ) : (
                    <div>
                        {activities.map((activity) => (
                            <ActivityCard key={activity._id} activity={activity} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
