"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth, buildAvatarUrl } from "@/context/AuthContext";

// ─────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────
function DashboardIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
    );
}
function UsersIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}
function ReportsIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
        </svg>
    );
}
function IncidentsIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    );
}
function AlertsIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
    );
}
function MapIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
            <line x1="8" y1="2" x2="8" y2="18" />
            <line x1="16" y1="6" x2="16" y2="22" />
        </svg>
    );
}
function AnalyticsIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
    );
}
function SettingsIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
    );
}
function LogoutIcon() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
    );
}

// ─────────────────────────────────────────────
// Nav config
// ─────────────────────────────────────────────
const ADMIN_NAV_ITEMS = [
    { label: "Dashboard",       href: "/admin",              exact: true,  Icon: DashboardIcon },
    { label: "User Management", href: "/admin/users",       exact: false, Icon: UsersIcon },
    { label: "Incidents",       href: "/admin/incidents",   exact: false, Icon: IncidentsIcon },
    { label: "SOS Alerts",      href: "/admin/alerts",      exact: false, Icon: AlertsIcon },
    { label: "Safety Map",      href: "/admin/safety-map",  exact: false, Icon: MapIcon },
    { label: "Reports",         href: "/admin/reports",     exact: false, Icon: ReportsIcon },
    { label: "Analytics",       href: "/admin/analytics",   exact: false, Icon: AnalyticsIcon },
    { label: "Settings",        href: "/admin/settings",    exact: false, Icon: SettingsIcon },
] as const;

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function getInitials(firstName?: string, lastName?: string, username?: string): string {
    if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
    if (firstName) return firstName[0].toUpperCase();
    if (username)  return username[0].toUpperCase();
    return "U";
}

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────
interface AdminSidebarProps {
    open: boolean;       // mobile drawer open
    collapsed: boolean;  // desktop icon-rail mode
    onClose: () => void;
}

// ─────────────────────────────────────────────
// Admin Sidebar Component
// ─────────────────────────────────────────────
export default function AdminSidebar({ open, collapsed, onClose }: AdminSidebarProps) {
    const pathname  = usePathname();
    const { user, loading, logout, picVersion } = useAuth();

    const isActive = (href: string, exact: boolean) =>
        exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

    const avatarUrl = buildAvatarUrl(user?.profilePicture, picVersion);
    const initials  = getInitials(user?.firstName, user?.lastName, user?.username);

    /** CSS classes for responsive sidebar positioning */
    const rootClass = [
        "sidebar-root",
        open ? "mobile-open" : "mobile-closed",
        collapsed ? "desktop-collapsed" : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <aside className={rootClass} style={{ boxShadow: "1px 0 0 #E5E7EB" }}>

            {/* ── LOGO ─────────────────────────── */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: collapsed ? "18px 0" : "18px 20px",
                    borderBottom: "1px solid #F3F4F6",
                    flexShrink: 0,
                    justifyContent: collapsed ? "center" : "flex-start",
                    transition: "padding 0.25s ease, justify-content 0.25s ease",
                    minHeight: 68,
                }}
            >
                <div style={{ flexShrink: 0 }}>
                    <Image
                        src="/logo.png"
                        alt="Aegis+"
                        width={36}
                        height={36}
                        style={{ borderRadius: 10, objectFit: "contain" }}
                    />
                </div>
                <div className="sidebar-label">
                    <div style={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                        <span style={{ color: "#0f172a", fontWeight: 800, fontSize: 17, letterSpacing: "-0.4px", lineHeight: 1 }}>
                            AEGIS
                        </span>
                        <span style={{ color: "#16a34a", fontWeight: 800, fontSize: 17, lineHeight: 1 }}>+</span>
                    </div>
                    <p style={{ color: "#9ca3af", fontSize: 9.5, marginTop: 2, lineHeight: 1.3, letterSpacing: "0.2px" }}>
                        Admin Panel
                    </p>
                </div>
            </div>

            {/* ── NAVIGATION ───────────────────── */}
            <nav style={{ flex: 1, overflowY: "auto", padding: "12px 10px" }}>
                <div className="sidebar-label" style={{ paddingLeft: 4, marginBottom: 8 }}>
                    <p style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#d1d5db",
                        textTransform: "uppercase",
                        letterSpacing: "1.1px",
                    }}>
                        Admin Menu
                    </p>
                </div>

                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 1 }}>
                    {ADMIN_NAV_ITEMS.map(({ label, href, exact, Icon }) => {
                        const active = isActive(href, exact);
                        return (
                            <li key={href} style={{ position: "relative" }}>
                                {active && (
                                    <div style={{
                                        position: "absolute",
                                        left: 0,
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        width: 3,
                                        height: 24,
                                        background: "var(--sidebar-active-bar)",
                                        borderRadius: "0 4px 4px 0",
                                    }} />
                                )}
                                <Link
                                    href={href}
                                    onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12,
                                        padding: collapsed ? "10px 0" : "10px 12px",
                                        borderRadius: 8,
                                        textDecoration: "none",
                                        color: active ? "var(--sidebar-active-text)" : "var(--sidebar-text)",
                                        background: active ? "var(--sidebar-active-bg)" : "transparent",
                                        transition: "background 0.15s, color 0.15s",
                                        justifyContent: collapsed ? "center" : "flex-start",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!active) {
                                            e.currentTarget.style.background = "var(--sidebar-hover-bg)";
                                            e.currentTarget.style.color = "var(--sidebar-hover-text)";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!active) {
                                            e.currentTarget.style.background = "transparent";
                                            e.currentTarget.style.color = "var(--sidebar-text)";
                                        }
                                    }}
                                >
                                    <span style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
                                        <Icon />
                                    </span>
                                    <span className="sidebar-label" style={{ fontSize: 13.5, fontWeight: 500 }}>
                                        {label}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* ── USER SECTION ─────────────────── */}
            <div style={{ padding: "12px 10px", borderTop: "1px solid #F3F4F6" }}>
                {loading ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px" }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#f1f5f9" }} />
                        <div className="sidebar-label">
                            <div style={{ width: 80, height: 10, background: "#f1f5f9", borderRadius: 4, marginBottom: 4 }} />
                            <div style={{ width: 50, height: 8, background: "#f1f5f9", borderRadius: 4 }} />
                        </div>
                    </div>
                ) : (
                    <>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", marginBottom: 8 }}>
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt="Avatar"
                                    style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                                />
                            ) : (
                                <div
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: "50%",
                                        background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 12,
                                        fontWeight: 700,
                                        color: "#16a34a",
                                        flexShrink: 0,
                                    }}
                                >
                                    {initials}
                                </div>
                            )}
                            <div className="sidebar-label" style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>
                                    {user?.role === "admin" ? "Administrator" : "User"}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                width: "100%",
                                padding: collapsed ? "10px 0" : "10px 12px",
                                borderRadius: 8,
                                border: "none",
                                background: "transparent",
                                color: "#dc2626",
                                cursor: "pointer",
                                fontSize: 13.5,
                                fontWeight: 500,
                                transition: "background 0.15s",
                                justifyContent: collapsed ? "center" : "flex-start",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "#fef2f2"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                        >
                            <LogoutIcon />
                            <span className="sidebar-label">Logout</span>
                        </button>
                    </>
                )}
            </div>
        </aside>
    );
}
