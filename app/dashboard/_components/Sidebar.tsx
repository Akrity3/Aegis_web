"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth, buildAvatarUrl } from "@/context/AuthContext";
import { SkeletonSidebarUser } from "./SkeletonLoader";

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
function ProfileIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
    );
}
function EditIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    );
}
function LockIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
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
function ShieldCheckIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l7 4v5c0 5.25-3.5 9.74-7 11-3.5-1.26-7-5.75-7-11V6l7-4z" />
            <polyline points="9 12 11 14 15 10" />
        </svg>
    );
}
function ChevronRight() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
        </svg>
    );
}

// ─────────────────────────────────────────────
// Nav config
// ─────────────────────────────────────────────
const NAV_ITEMS = [
    { label: "Dashboard",       href: "/dashboard",                  exact: true,  Icon: DashboardIcon, adminOnly: false },
    { label: "My Profile",      href: "/dashboard/me",               exact: false, Icon: ProfileIcon,   adminOnly: false },
    { label: "Update Profile",  href: "/dashboard/profile",          exact: false, Icon: EditIcon,      adminOnly: false },
    { label: "Change Password", href: "/dashboard/password",         exact: false, Icon: LockIcon,      adminOnly: false },
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
interface SidebarProps {
    open: boolean;       // mobile drawer open
    collapsed: boolean;  // desktop icon-rail mode
    onClose: () => void;
}

// ─────────────────────────────────────────────
// Sidebar Component
// ─────────────────────────────────────────────
export default function Sidebar({ open, collapsed, onClose }: SidebarProps) {
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
                {/* Logo image — always visible */}
                <div style={{ flexShrink: 0 }}>
                    <Image
                        src="/logo.png"
                        alt="Aegis+"
                        width={36}
                        height={36}
                        style={{ borderRadius: 10, objectFit: "contain" }}
                    />
                </div>

                {/* Brand text — hidden when collapsed */}
                <div className="sidebar-label">
                    <div style={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                        <span style={{ color: "#0f172a", fontWeight: 800, fontSize: 17, letterSpacing: "-0.4px", lineHeight: 1 }}>
                            AEGIS
                        </span>
                        <span style={{ color: "#16a34a", fontWeight: 800, fontSize: 17, lineHeight: 1 }}>+</span>
                    </div>
                    <p style={{ color: "#9ca3af", fontSize: 9.5, marginTop: 2, lineHeight: 1.3, letterSpacing: "0.2px" }}>
                        Personal Safety Network
                    </p>
                </div>
            </div>

            {/* ── NAVIGATION ───────────────────── */}
            <nav style={{ flex: 1, overflowY: "auto", padding: "12px 10px" }}>
                {/* Section label */}
                <div className="sidebar-label" style={{ paddingLeft: 4, marginBottom: 8 }}>
                    <p style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#d1d5db",
                        textTransform: "uppercase",
                        letterSpacing: "1.1px",
                    }}>
                        Menu
                    </p>
                </div>

                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 1 }}>
                    {NAV_ITEMS.map(({ label, href, exact, Icon }) => {
                        const active = isActive(href, exact);
                        return (
                            <li key={href} style={{ position: "relative" }}>
                                {/* Active left bar */}
                                {active && (
                                    <div style={{
                                        position: "absolute",
                                        left: 0,
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        width: 3,
                                        height: 22,
                                        borderRadius: "0 3px 3px 0",
                                        background: "#16a34a",
                                    }} />
                                )}

                                <Link
                                    href={href}
                                    onClick={onClose}
                                    title={collapsed ? label : undefined}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 10,
                                        padding: collapsed ? "10px 0" : "10px 12px 10px 14px",
                                        borderRadius: 10,
                                        fontSize: 13.5,
                                        fontWeight: active ? 600 : 500,
                                        color: active ? "#16a34a" : "#374151",
                                        background: active ? "#f0fdf4" : "transparent",
                                        textDecoration: "none",
                                        transition: "all 0.15s ease",
                                        justifyContent: collapsed ? "center" : "flex-start",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!active) {
                                            (e.currentTarget as HTMLAnchorElement).style.background = "#f9fafb";
                                            (e.currentTarget as HTMLAnchorElement).style.color = "#16a34a";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!active) {
                                            (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                                            (e.currentTarget as HTMLAnchorElement).style.color = "#374151";
                                        }
                                    }}
                                >
                                    {/* Icon */}
                                    <span style={{ color: active ? "#16a34a" : "#9ca3af", flexShrink: 0, display: "flex" }}>
                                        <Icon />
                                    </span>

                                    {/* Label */}
                                    <span className="sidebar-label" style={{ flex: 1 }}>{label}</span>

                                    {/* Chevron (only when expanded + active) */}
                                    {active && !collapsed && (
                                        <span className="sidebar-label" style={{ color: "#16a34a", opacity: 0.6 }}>
                                            <ChevronRight />
                                        </span>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* Divider */}
                <div style={{ height: 1, background: "#f3f4f6", margin: "14px 4px" }} />

                {/* Safety status pill — hidden when collapsed */}
                <div className="sidebar-label" style={{ maxWidth: "100%", opacity: 1 }}>
                    <div style={{
                        padding: "10px 14px",
                        borderRadius: 10,
                        background: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                    }}>
                        <span style={{ color: "#16a34a", flexShrink: 0, display: "flex" }}>
                            <ShieldCheckIcon />
                        </span>
                        <div style={{ minWidth: 0 }}>
                            <p style={{ fontSize: 12, fontWeight: 700, color: "#16a34a" }}>Protected</p>
                            <p style={{ fontSize: 10.5, color: "#86efac", lineHeight: 1.3 }}>
                                Account is secure
                            </p>
                        </div>
                    </div>
                </div>
            </nav>

            {/* ── USER CARD + LOGOUT ──────────────── */}
            <div style={{ borderTop: "1px solid #F3F4F6", padding: "10px", flexShrink: 0 }}>
                {loading ? (
                    <SkeletonSidebarUser />
                ) : collapsed ? (
                    /* ── Collapsed: avatar only, centered ── */
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <Link href="/dashboard/me" onClick={onClose} title={`${user?.firstName} ${user?.lastName}`}>
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt={user?.firstName || "User"}
                                    style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover", border: "2px solid #E5E7EB" }}
                                />
                            ) : (
                                <div style={{
                                    width: 38, height: 38, borderRadius: "50%",
                                    background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 13, fontWeight: 700, color: "#16a34a",
                                    border: "2px solid #E5E7EB",
                                }}>
                                    {initials}
                                </div>
                            )}
                        </Link>

                        <button
                            onClick={() => logout()}
                            title="Sign Out"
                            style={{
                                width: 36, height: 36, borderRadius: 9,
                                border: "none", background: "transparent",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer", color: "#9ca3af",
                                transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.background = "#fef2f2";
                                (e.currentTarget as HTMLButtonElement).style.color = "#dc2626";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                                (e.currentTarget as HTMLButtonElement).style.color = "#9ca3af";
                            }}
                        >
                            <LogoutIcon />
                        </button>
                    </div>
                ) : (
                    /* ── Expanded: full user card ── */
                    <>
                        <Link
                            href="/dashboard/me"
                            onClick={onClose}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                padding: "10px 12px",
                                borderRadius: 10,
                                textDecoration: "none",
                                background: "#f9fafb",
                                border: "1px solid #F3F4F6",
                                marginBottom: 6,
                                transition: "background 0.15s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "#f9fafb")}
                        >
                            {/* Avatar */}
                            <div style={{ position: "relative", flexShrink: 0 }}>
                                {avatarUrl ? (
                                    <img
                                        src={avatarUrl}
                                        alt={user?.firstName || "User"}
                                        style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }}
                                    />
                                ) : (
                                    <div style={{
                                        width: 36, height: 36, borderRadius: "50%",
                                        background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: 13, fontWeight: 700, color: "#16a34a",
                                    }}>
                                        {initials}
                                    </div>
                                )}
                                {/* Online dot */}
                                <div
                                    className="animate-pulse-dot"
                                    style={{
                                        position: "absolute", bottom: -1, right: -1,
                                        width: 10, height: 10, borderRadius: "50%",
                                        background: "#22c55e",
                                        border: "2px solid #fff",
                                    }}
                                />
                            </div>

                            {/* Name / email */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p style={{ fontSize: 11, color: "#9ca3af", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: 1 }}>
                                    {user?.email}
                                </p>
                            </div>
                        </Link>

                        {/* Logout */}
                        <button
                            onClick={() => logout()}
                            style={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                padding: "9px 12px",
                                borderRadius: 10,
                                fontSize: 13,
                                fontWeight: 600,
                                color: "#ef4444",
                                background: "transparent",
                                border: "none",
                                cursor: "pointer",
                                transition: "all 0.15s",
                                textAlign: "left",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.background = "#fef2f2";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                            }}
                        >
                            <span style={{ color: "#ef4444", display: "flex", flexShrink: 0 }}>
                                <LogoutIcon />
                            </span>
                            Sign Out
                        </button>
                    </>
                )}
            </div>
        </aside>
    );
}
