"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "../_components/ToastContext";
import {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    type Notification,
} from "@/lib/api/notification";

// ─────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────
function BellIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
    );
}
function CheckIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}
function TrashIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
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
    return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

function getNotificationIcon(type: string): { icon: React.ReactNode; color: string } {
    switch (type) {
        case "alert_triggered":
            return {
                icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2l7 4v5c0 5.25-3.5 9.74-7 11-3.5-1.26-7-5.75-7-11V6l7-4z" />
                        <path d="M12 8v4" />
                        <path d="M12 16h.01" />
                    </svg>
                ),
                color: "#dc2626",
            };
        case "alert_resolved":
            return {
                icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                ),
                color: "#16a34a",
            };
        case "incident_reported":
            return {
                icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                ),
                color: "#f59e0b",
            };
        case "contact_added":
            return {
                icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <line x1="23" y1="11" x2="17" y2="11" />
                        <line x1="20" y1="8" x2="20" y2="14" />
                    </svg>
                ),
                color: "#0ea5e9",
            };
        default:
            return {
                icon: <BellIcon />,
                color: "#6b7280",
            };
    }
}

// ─────────────────────────────────────────────
// Notification Card
// ─────────────────────────────────────────────
function NotificationCard({
    notification,
    onMarkRead,
    onDelete,
}: {
    notification: Notification;
    onMarkRead: (id: string) => void;
    onDelete: (id: string) => void;
}) {
    const { icon, color } = getNotificationIcon(notification.type);

    return (
        <div
            style={{
                background: notification.read ? "#f9fafb" : "#fff",
                borderRadius: 12,
                border: `1.5px solid ${notification.read ? "#E5E7EB" : "#bbf7d0"}`,
                padding: "14px 16px",
                marginBottom: 10,
                transition: "all 0.15s",
            }}
        >
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: `${color}0f`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color, flexShrink: 0,
                }}>
                    {icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: 0 }}>
                            {notification.title}
                        </p>
                        <span style={{ fontSize: 11, color: "#9ca3af", whiteSpace: "nowrap", marginLeft: 8 }}>
                            {formatDate(notification.createdAt)}
                        </span>
                    </div>
                    <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.5, margin: 0 }}>
                        {notification.message}
                    </p>
                </div>
            </div>
            {!notification.read && (
                <div style={{ marginTop: 10, display: "flex", justifyContent: "flex-end" }}>
                    <button
                        onClick={() => onMarkRead(notification._id)}
                        style={{
                            padding: "6px 12px",
                            borderRadius: 8,
                            border: "1px solid #bbf7d0",
                            background: "#f0fdf4",
                            color: "#16a34a",
                            fontSize: 11.5,
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background = "#dcfce7";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background = "#f0fdf4";
                        }}
                    >
                        <CheckIcon /> Mark as Read
                    </button>
                </div>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function NotificationsPage() {
    const { loading: authLoading } = useAuth();
    const { showToast } = useToast();

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    // Fetch notifications
    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        try {
            const [notifResponse, countResponse] = await Promise.all([
                getNotifications(),
                getUnreadCount(),
            ]);
            if (notifResponse.success) {
                setNotifications(notifResponse.data);
            }
            if (countResponse.success) {
                setUnreadCount(countResponse.data.count);
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            showToast(err?.response?.data?.message || err?.message || "Failed to fetch notifications", "error");
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    // Mark as read
    const handleMarkRead = async (notificationId: string) => {
        try {
            const response = await markAsRead([notificationId]);
            if (response.success) {
                setNotifications((prev) =>
                    prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
                );
                setUnreadCount((prev) => Math.max(0, prev - 1));
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            showToast(err?.response?.data?.message || err?.message || "Failed to mark as read", "error");
        }
    };

    // Mark all as read
    const handleMarkAllRead = async () => {
        try {
            const response = await markAllAsRead();
            if (response.success) {
                setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
                setUnreadCount(0);
                showToast("All notifications marked as read", "success");
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            showToast(err?.response?.data?.message || err?.message || "Failed to mark all as read", "error");
        }
    };

    // Delete notification
    const handleDelete = async (notificationId: string) => {
        try {
            const response = await deleteNotification(notificationId);
            if (response.success) {
                setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
                showToast("Notification deleted", "success");
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            showToast(err?.response?.data?.message || err?.message || "Failed to delete notification", "error");
        }
    };

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
                        justifyContent: "space-between",
                        gap: 16,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div
                            style={{
                                width: 48, height: 48, borderRadius: 14,
                                background: "rgba(22,163,74,0.18)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: "#4ade80",
                            }}
                        >
                            <BellIcon />
                        </div>
                        <div>
                            <h2 style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>
                                Notifications
                            </h2>
                            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
                                {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
                            </p>
                        </div>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            style={{
                                padding: "8px 16px",
                                borderRadius: 10,
                                border: "1px solid rgba(255,255,255,0.3)",
                                background: "rgba(255,255,255,0.1)",
                                color: "#fff",
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.2)";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)";
                            }}
                        >
                            Mark All Read
                        </button>
                    )}
                </div>
            </div>

            {/* ── Notifications List ─────────────── */}
            <div className="animate-fade-in-up anim-delay-100">
                {notifications.length === 0 ? (
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
                            <BellIcon />
                        </div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
                            No Notifications
                        </h3>
                        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 0 }}>
                            You're all caught up!
                        </p>
                    </div>
                ) : (
                    <div>
                        {notifications.map((notification) => (
                            <NotificationCard
                                key={notification._id}
                                notification={notification}
                                onMarkRead={handleMarkRead}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
