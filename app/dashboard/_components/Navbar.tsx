"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAuth, buildAvatarUrl } from "@/context/AuthContext";

// Page titles map
const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
    "/dashboard":          { title: "Dashboard",       subtitle: "Welcome to your safety command center" },
    "/dashboard/me":       { title: "My Profile",      subtitle: "View your personal account details" },
    "/dashboard/profile":  { title: "Update Profile",  subtitle: "Manage your personal information" },
    "/dashboard/password": { title: "Security Center", subtitle: "Change your password and manage security" },
};

// Inline icons
const MenuIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
);

const BellIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);

const ChevronDown = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const LogoutIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

const ProfileIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);

const EditIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

// Format current date nicely

function formatDate(): string {
    return new Date().toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

// Props
interface NavbarProps {
    onMenuToggle: () => void;
}

// Navbar Component
export default function Navbar({ onMenuToggle }: NavbarProps) {
    const pathname = usePathname();
    const { user, logout, picVersion } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const pageInfo = PAGE_TITLES[pathname] ?? { title: "Dashboard", subtitle: "Aegis+ Safety Platform" };

    const avatarUrl = buildAvatarUrl(user?.profilePicture, picVersion);
    const initials  = user
        ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "U"
        : "U";

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <header
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 24px",
                height: 68,
                background: "#fff",
                borderBottom: "1px solid #e2e8f0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                position: "sticky",
                top: 0,
                zIndex: 20,
                flexShrink: 0,
            }}
        >
            {/* ── LEFT: Hamburger + Page Title ── */}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {/* Mobile hamburger */}
                <button
                    onClick={onMenuToggle}
                    aria-label="Toggle menu"
                    className="lg:hidden"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        border: "1px solid #e2e8f0",
                        background: "transparent",
                        cursor: "pointer",
                        color: "#475569",
                    }}
                >
                    <MenuIcon />
                </button>

                {/* Page title */}
                <div>
                    <h1 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", lineHeight: 1.2 }}>
                        {pageInfo.title}
                    </h1>
                    <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 1 }}>
                        {pageInfo.subtitle}
                    </p>
                </div>
            </div>

            {/* ── RIGHT: Date + Notifications + User ── */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {/* Date — hidden on small screens */}
                <div
                    className="hidden sm:flex"
                    style={{
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 12px",
                        borderRadius: 9,
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                    }}
                >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "#64748b" }}>
                        {formatDate()}
                    </span>
                </div>

                {/* Notification bell (UI only) */}
                <div style={{ position: "relative" }}>
                    <button
                        aria-label="Notifications"
                        style={{
                            width: 38,
                            height: 38,
                            borderRadius: 10,
                            border: "1px solid #e2e8f0",
                            background: "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: "#64748b",
                            transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background = "#f8fafc";
                            (e.currentTarget as HTMLButtonElement).style.color = "#16a34a";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                            (e.currentTarget as HTMLButtonElement).style.color = "#64748b";
                        }}
                    >
                        <BellIcon />
                    </button>
                    {/* Red dot indicator */}
                    <div style={{
                        position: "absolute",
                        top: 7,
                        right: 7,
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "#dc2626",
                        border: "1.5px solid #fff",
                    }} />
                </div>

                {/* User avatar + dropdown */}
                <div style={{ position: "relative" }} ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen((v) => !v)}
                        aria-expanded={dropdownOpen}
                        aria-haspopup="true"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "5px 10px 5px 5px",
                            borderRadius: 12,
                            border: "1px solid #e2e8f0",
                            background: dropdownOpen ? "#f8fafc" : "transparent",
                            cursor: "pointer",
                            transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                        onMouseLeave={(e) => {
                            if (!dropdownOpen) (e.currentTarget.style.background = "transparent");
                        }}
                    >
                        {/* Avatar */}
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt={user?.firstName || "User"}
                                style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }}
                            />
                        ) : (
                            <div style={{
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #16a34a, #14532d)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 12,
                                fontWeight: 700,
                                color: "#fff",
                                flexShrink: 0,
                            }}>
                                {initials}
                            </div>
                        )}

                        {/* Name (hidden on mobile) */}
                        <span
                            className="hidden md:block"
                            style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}
                        >
                            {user?.firstName}
                        </span>

                        <span style={{ color: "#94a3b8", transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                            <ChevronDown />
                        </span>
                    </button>

                    {/* Dropdown */}
                    {dropdownOpen && (
                        <div
                            className="animate-scale-in"
                            style={{
                                position: "absolute",
                                top: "calc(100% + 8px)",
                                right: 0,
                                width: 220,
                                background: "#fff",
                                borderRadius: 14,
                                border: "1px solid #e2e8f0",
                                boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                                overflow: "hidden",
                                zIndex: 50,
                            }}
                        >
                            {/* User header */}
                            <div style={{ padding: "14px 16px 12px", borderBottom: "1px solid #f1f5f9" }}>
                                <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{user?.email}</p>
                                <span style={{
                                    display: "inline-block",
                                    marginTop: 6,
                                    fontSize: 10,
                                    fontWeight: 600,
                                    color: "#166534",
                                    background: "#dcfce7",
                                    border: "1px solid #bbf7d0",
                                    borderRadius: 999,
                                    padding: "2px 8px",
                                    textTransform: "capitalize",
                                }}>
                                    {user?.role || "User"}
                                </span>
                            </div>

                            {/* Links */}
                            <div style={{ padding: "6px" }}>
                                {[
                                    { href: "/dashboard/me",      label: "My Profile",      Icon: ProfileIcon },
                                    { href: "/dashboard/profile", label: "Update Profile",  Icon: EditIcon    },
                                ].map(({ href, label, Icon }) => (
                                    <Link
                                        key={href}
                                        href={href}
                                        onClick={() => setDropdownOpen(false)}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 10,
                                            padding: "9px 12px",
                                            borderRadius: 9,
                                            fontSize: 13,
                                            fontWeight: 500,
                                            color: "#374151",
                                            textDecoration: "none",
                                            transition: "background 0.15s",
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                    >
                                        <span style={{ color: "#94a3b8" }}><Icon /></span>
                                        {label}
                                    </Link>
                                ))}

                                <div style={{ height: 1, background: "#f1f5f9", margin: "4px 8px" }} />

                                <button
                                    onClick={() => { setDropdownOpen(false); logout(); }}
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 10,
                                        padding: "9px 12px",
                                        borderRadius: 9,
                                        fontSize: 13,
                                        fontWeight: 500,
                                        color: "#dc2626",
                                        background: "transparent",
                                        border: "none",
                                        cursor: "pointer",
                                        textAlign: "left",
                                        transition: "background 0.15s",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = "#fef2f2")}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                >
                                    <LogoutIcon />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
