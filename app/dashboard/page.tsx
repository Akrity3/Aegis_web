"use client";

import { useAuth, buildAvatarUrl } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StatCard from "./_components/StatCard";
import { SkeletonWelcome, SkeletonStatGrid } from "./_components/SkeletonLoader";
import type { User } from "@/context/AuthContext";
import { useEffect, useState, useCallback } from "react";
import { useToast } from "./_components/ToastContext";
import { getMyAlerts } from "@/lib/api/alert";
import { getMyIncidents } from "@/lib/api/incident";
import { getUnreadCount } from "@/lib/api/notification";
import { getSafetyCircle } from "@/lib/api/safetyCircle";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function getGreeting(): string {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
}

/** Calculate profile completion based on filled fields (0–100). */
function getProfileCompletion(user: User): number {
    const fields = [
        !!user.firstName,
        !!user.lastName,
        !!user.email,
        !!user.phoneNumber,
        !!user.gender,
    ];
    const hasPic = !!(user.profilePicture && user.profilePicture !== "default-profile.png");
    const totalFields = fields.length + 1; // +1 for profile picture
    const filled = fields.filter(Boolean).length + (hasPic ? 1 : 0);
    return Math.round((filled / totalFields) * 100);
}

function formatMemberSince(dateStr?: string): string {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

// ─────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────
function ShieldCheckIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l7 4v5c0 5.25-3.5 9.74-7 11-3.5-1.26-7-5.75-7-11V6l7-4z" />
            <polyline points="9 12 11 14 15 10" />
        </svg>
    );
}
function UserCheckIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <polyline points="16 11 18 13 22 9" />
        </svg>
    );
}
function BarChartIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6"  y1="20" x2="6"  y2="14" />
        </svg>
    );
}
function CalendarIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8"  y1="2" x2="8"  y2="6" />
            <line x1="3"  y1="10" x2="21" y2="10" />
        </svg>
    );
}
function UserIcon() {
    return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}
function PencilIcon() {
    return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    );
}
function LockIcon() {
    return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    );
}
function SOSIcon() {
    return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l7 4v5c0 5.25-3.5 9.74-7 11-3.5-1.26-7-5.75-7-11V6l7-4z" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
        </svg>
    );
}
function ContactsIcon() {
    return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}
function ArrowRightIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
        </svg>
    );
}
function LoginIcon() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
        </svg>
    );
}
function EyeIcon() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}
function CheckCircleIcon() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    );
}
function AlertIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l7 4v5c0 5.25-3.5 9.74-7 11-3.5-1.26-7-5.75-7-11V6l7-4z" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
        </svg>
    );
}
function IncidentIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    );
}
function BellIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
    );
}
function UsersIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}

// ─────────────────────────────────────────────
// Quick Action Card
// ─────────────────────────────────────────────
interface QuickActionProps {
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
    accentColor: string;
    animClass?: string;
}

function QuickActionCard({ title, description, href, icon, accentColor, animClass = "" }: QuickActionProps) {
    const router = useRouter();
    return (
        <div
            onClick={() => router.push(href)}
            className={`animate-fade-in-up ${animClass}`}
            style={{
                background: "#fff",
                borderRadius: 18,
                border: "1px solid #E5E7EB",
                padding: "22px",
                cursor: "pointer",
                transition: "box-shadow 0.2s ease, transform 0.2s ease",
                boxShadow: "var(--shadow-sm)",
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-lg)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-sm)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
            }}
        >
            {/* Icon */}
            <div
                style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: `${accentColor}12`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: accentColor,
                    marginBottom: 16,
                    border: `1px solid ${accentColor}20`,
                }}
            >
                {icon}
            </div>

            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 5 }}>
                {title}
            </h3>
            <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.55, marginBottom: 16 }}>
                {description}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 5, color: accentColor, fontSize: 13, fontWeight: 600 }}>
                Open <ArrowRightIcon />
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// Profile Completion Bar
// ─────────────────────────────────────────────
function ProfileCompletionBar({ pct }: { pct: number }) {
    const color = pct < 40 ? "#ef4444" : pct < 75 ? "#f59e0b" : "#16a34a";
    return (
        <div style={{ marginTop: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "#9ca3af" }}>Completion</span>
                <span style={{ fontSize: 12, fontWeight: 700, color }}>{pct}%</span>
            </div>
            <div style={{ height: 5, background: "#f3f4f6", borderRadius: 999, overflow: "hidden" }}>
                <div
                    style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: color,
                        borderRadius: 999,
                        transition: "width 1.2s cubic-bezier(0.16,1,0.3,1)",
                    }}
                />
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function DashboardPage() {
    const { user, loading, picVersion } = useAuth();
    const { showToast } = useToast();

    const [activeAlerts, setActiveAlerts] = useState(0);
    const [myIncidents, setMyIncidents] = useState(0);
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [safetyCircleMembers, setSafetyCircleMembers] = useState(0);
    const [statsLoading, setStatsLoading] = useState(true);

    const completion = user ? getProfileCompletion(user) : 0;
    const avatarUrl  = buildAvatarUrl(user?.profilePicture, picVersion);
    const initials   = user
        ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "U"
        : "U";

    // Fetch dashboard stats
    const fetchStats = useCallback(async () => {
        setStatsLoading(true);
        try {
            const [alertsResponse, incidentsResponse, notificationsResponse, safetyCircleResponse] = await Promise.all([
                getMyAlerts().catch(() => ({ success: false, data: [] })),
                getMyIncidents().catch(() => ({ success: false, data: [] })),
                getUnreadCount().catch(() => ({ success: false, data: { count: 0 } })),
                getSafetyCircle().catch(() => ({ success: false, data: [] })),
            ]);

            if (alertsResponse.success) {
                setActiveAlerts(alertsResponse.data.filter((a: any) => a.status === "active").length);
            }
            if (incidentsResponse.success) {
                setMyIncidents(incidentsResponse.data.length);
            }
            if (notificationsResponse.success) {
                setUnreadNotifications(notificationsResponse.data?.count || 0);
            }
            if (safetyCircleResponse.success) {
                setSafetyCircleMembers(safetyCircleResponse.data.length);
            }
        } catch (error) {
            // Silently fail stats fetch
        } finally {
            setStatsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!loading && user) {
            fetchStats();
        }
    }, [loading, user, fetchStats]);

    return (
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

            {/* ── WELCOME BANNER ─────────────────────── */}
            {loading ? (
                <SkeletonWelcome />
            ) : (
                <div
                    className="animate-fade-in-up"
                    style={{
                        background: "linear-gradient(135deg, #052e16 0%, #14532d 45%, #166534 100%)",
                        borderRadius: 22,
                        padding: "28px 32px",
                        marginBottom: 28,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 20,
                        overflow: "hidden",
                        position: "relative",
                        boxShadow: "0 4px 20px rgba(5,46,22,0.2)",
                    }}
                >
                    {/* Decorative radial tint */}
                    <div style={{
                        position: "absolute", inset: 0, pointerEvents: "none",
                        backgroundImage: "radial-gradient(ellipse at 75% 50%, rgba(74,222,128,0.07) 0%, transparent 60%)",
                    }} />

                    <div style={{ position: "relative" }}>
                        <p style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: "rgba(255,255,255,0.4)",
                            letterSpacing: "1.2px",
                            textTransform: "uppercase",
                            marginBottom: 8,
                        }}>
                            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                        </p>

                        <h1 style={{
                            fontSize: "clamp(1.5rem, 3vw, 2rem)",
                            fontWeight: 800,
                            color: "#fff",
                            lineHeight: 1.2,
                            marginBottom: 10,
                        }}>
                            {getGreeting()}, {user?.firstName || "there"}
                        </h1>

                        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>
                            Welcome back to Aegis+.<br />
                            Your account is active and protected.
                        </p>
                    </div>

                    {/* Avatar bubble */}
                    <div style={{ flexShrink: 0 }}>
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt={user?.firstName || "User"}
                                style={{
                                    width: 80, height: 80,
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    border: "3px solid rgba(255,255,255,0.2)",
                                }}
                            />
                        ) : (
                            <div style={{
                                width: 80, height: 80, borderRadius: "50%",
                                background: "rgba(74,222,128,0.15)",
                                border: "3px solid rgba(255,255,255,0.1)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 28, fontWeight: 800, color: "#4ade80",
                            }}>
                                {initials}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── STAT CARDS ──────────────────────────── */}
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "1.1px", textTransform: "uppercase", marginBottom: 14 }}>
                Safety Command Center
            </p>

            {loading ? (
                <SkeletonStatGrid count={4} />
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                        gap: 16,
                        marginBottom: 32,
                    }}
                >
                    <StatCard
                        title="Active Alerts"
                        value={activeAlerts.toString()}
                        description="Emergency alerts currently active"
                        icon={<AlertIcon />}
                        iconColor={activeAlerts > 0 ? "#dc2626" : "#16a34a"}
                        badge={activeAlerts > 0 ? "Active" : "None"}
                        badgeVariant={activeAlerts > 0 ? "danger" : "success"}
                        animClass="anim-delay-100"
                    />

                    <StatCard
                        title="My Incidents"
                        value={myIncidents.toString()}
                        description="Incidents you have reported"
                        icon={<IncidentIcon />}
                        iconColor="#f59e0b"
                        animClass="anim-delay-200"
                    />

                    <StatCard
                        title="Unread Notifications"
                        value={unreadNotifications.toString()}
                        description="Notifications requiring attention"
                        icon={<BellIcon />}
                        iconColor={unreadNotifications > 0 ? "#0ea5e9" : "#6b7280"}
                        badge={unreadNotifications > 0 ? "New" : "None"}
                        badgeVariant={unreadNotifications > 0 ? "warning" : "neutral"}
                        animClass="anim-delay-300"
                    />

                    <StatCard
                        title="Safety Circle"
                        value={safetyCircleMembers.toString()}
                        description="Trusted contacts in your circle"
                        icon={<UsersIcon />}
                        iconColor="#16a34a"
                        animClass="anim-delay-400"
                    />
                </div>
            )}

            {/* ── QUICK ACTIONS ──────────────────────── */}
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "1.1px", textTransform: "uppercase", marginBottom: 14 }}>
                Safety Quick Actions
            </p>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                    gap: 16,
                    marginBottom: 32,
                }}
            >
                <QuickActionCard
                    title="Emergency Alerts"
                    description="Trigger SOS alerts and manage emergency situations."
                    href="/dashboard/alerts"
                    icon={<AlertIcon />}
                    accentColor="#dc2626"
                    animClass="anim-delay-400"
                />
                <QuickActionCard
                    title="Report Incident"
                    description="Report safety incidents to help your community."
                    href="/dashboard/reports"
                    icon={<IncidentIcon />}
                    accentColor="#f59e0b"
                    animClass="anim-delay-500"
                />
                <QuickActionCard
                    title="Safety Circle"
                    description="Manage trusted contacts in your safety circle."
                    href="/dashboard/safety-circle"
                    icon={<UsersIcon />}
                    accentColor="#16a34a"
                    animClass="anim-delay-600"
                />
                <QuickActionCard
                    title="Safety Map"
                    description="View community incidents on the interactive map."
                    href="/dashboard/safety-map"
                    icon={<BarChartIcon />}
                    accentColor="#0ea5e9"
                    animClass="anim-delay-700"
                />
            </div>

            {/* ── ACCOUNT QUICK ACTIONS ───────────────── */}
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "1.1px", textTransform: "uppercase", marginBottom: 14 }}>
                Account Actions
            </p>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                    gap: 16,
                    marginBottom: 32,
                }}
            >
                <QuickActionCard
                    title="My Profile"
                    description="View your personal details, role, and account information."
                    href="/dashboard/me"
                    icon={<UserIcon />}
                    accentColor="#6b7280"
                    animClass="anim-delay-400"
                />
                <QuickActionCard
                    title="Emergency Contacts"
                    description="Manage trusted contacts who will be notified in emergencies."
                    href="/dashboard/contacts"
                    icon={<ContactsIcon />}
                    accentColor="#16a34a"
                    animClass="anim-delay-500"
                />
                <QuickActionCard
                    title="Notifications"
                    description="View your notifications and alerts."
                    href="/dashboard/notifications"
                    icon={<BellIcon />}
                    accentColor="#0ea5e9"
                    animClass="anim-delay-600"
                />
                <QuickActionCard
                    title="Settings"
                    description="Manage your account preferences and security."
                    href="/dashboard/settings"
                    icon={<LockIcon />}
                    accentColor="#475569"
                    animClass="anim-delay-700"
                />
            </div>

            {/* ── SOS QUICK ACTION ───────────────────── */}
            <div
                className="animate-fade-in-up anim-delay-800"
                style={{
                    background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 55%, #991b1b 100%)",
                    borderRadius: 18,
                    padding: "24px 28px",
                    marginBottom: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 20,
                    boxShadow: "0 4px 20px rgba(220,38,38,0.25)",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Decorative radial tint */}
                <div style={{
                    position: "absolute", inset: 0, pointerEvents: "none",
                    backgroundImage: "radial-gradient(ellipse at 75% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)",
                }} />

                <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                        <div style={{
                            width: 48, height: 48, borderRadius: 12,
                            background: "rgba(255,255,255,0.18)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff",
                        }}>
                            <SOSIcon />
                        </div>
                        <div>
                            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 2 }}>
                                Emergency SOS
                            </h3>
                            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
                                Trigger emergency alert to notify contacts
                            </p>
                        </div>
                    </div>
                </div>

                <Link
                    href="/dashboard/alerts"
                    style={{
                        position: "relative", zIndex: 1,
                        padding: "12px 24px",
                        borderRadius: 12,
                        background: "#fff",
                        color: "#dc2626",
                        fontSize: 14,
                        fontWeight: 700,
                        textDecoration: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        transition: "all 0.15s",
                        flexShrink: 0,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                    Trigger SOS
                </Link>
            </div>

            {/* ── RECENT ACTIVITY ────────────────────── */}
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "1.1px", textTransform: "uppercase", marginBottom: 14 }}>
                Recent Activity
            </p>

            <div
                className="animate-fade-in-up anim-delay-600"
                style={{
                    background: "#fff",
                    borderRadius: 18,
                    border: "1px solid #E5E7EB",
                    padding: "8px 4px",
                    boxShadow: "var(--shadow-sm)",
                }}
            >
                {[
                    { Icon: LoginIcon,      label: "Account login",    time: "Just now",                         color: "#16a34a" },
                    { Icon: EyeIcon,        label: "Profile viewed",   time: "Today",                            color: "#0ea5e9" },
                    { Icon: CheckCircleIcon,label: "Account created",  time: formatMemberSince(user?.createdAt), color: "#16a34a" },
                ].map((item, i, arr) => (
                    <div
                        key={i}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                            padding: "14px 20px",
                            borderBottom: i < arr.length - 1 ? "1px solid #f9fafb" : "none",
                        }}
                    >
                        <div style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: `${item.color}0f`,
                            border: `1px solid ${item.color}1a`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: item.color, flexShrink: 0,
                        }}>
                            <item.Icon />
                        </div>
                        <p style={{ fontSize: 14, fontWeight: 500, color: "#0f172a", flex: 1 }}>
                            {item.label}
                        </p>
                        <span style={{ fontSize: 12, color: "#9ca3af", flexShrink: 0 }}>{item.time}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
