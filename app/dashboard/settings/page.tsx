"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

// ─────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────
function SettingsIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
    );
}
function UserIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}
function LockIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    );
}
function BellIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
    );
}
function ShieldIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    );
}
function ChevronRightIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
        </svg>
    );
}

// ─────────────────────────────────────────────
// Settings Card
// ─────────────────────────────────────────────
function SettingsCard({
    icon,
    title,
    description,
    href,
    accentColor,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    href: string;
    accentColor: string;
}) {
    return (
        <Link
            href={href}
            style={{
                display: "block",
                textDecoration: "none",
            }}
        >
            <div
                style={{
                    background: "#fff",
                    borderRadius: 16,
                    border: "1.5px solid #E5E7EB",
                    padding: "20px 24px",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    boxShadow: "var(--shadow-sm)",
                    transition: "all 0.15s",
                    cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = accentColor;
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "#E5E7EB";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-sm)";
                }}
            >
                <div
                    style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: `${accentColor}0f`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: accentColor,
                        flexShrink: 0,
                    }}
                >
                    {icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0, marginBottom: 4 }}>
                        {title}
                    </h3>
                    <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
                        {description}
                    </p>
                </div>
                <div style={{ color: "#9ca3af", flexShrink: 0 }}>
                    <ChevronRightIcon />
                </div>
            </div>
        </Link>
    );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function SettingsPage() {
    const { user } = useAuth();

    const settings = [
        {
            icon: <UserIcon />,
            title: "Profile Information",
            description: "Update your name, phone, gender, and profile photo",
            href: "/dashboard/profile",
            accentColor: "#0ea5e9",
        },
        {
            icon: <LockIcon />,
            title: "Security & Password",
            description: "Change your password and manage account security",
            href: "/dashboard/password",
            accentColor: "#f59e0b",
        },
        {
            icon: <BellIcon />,
            title: "Notification Preferences",
            description: "Manage how you receive alerts and notifications",
            href: "/dashboard/notifications",
            accentColor: "#16a34a",
        },
        {
            icon: <ShieldIcon />,
            title: "Privacy Settings",
            description: "Control your privacy and data sharing preferences",
            href: "/dashboard/me",
            accentColor: "#7c3aed",
        },
    ];

    return (
        <div style={{ maxWidth: 700, margin: "0 auto" }}>

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
                        <SettingsIcon />
                    </div>
                    <div>
                        <h2 style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>
                            Settings
                        </h2>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
                            Manage your account preferences
                        </p>
                    </div>
                </div>

                {/* User info */}
                <div
                    style={{
                        padding: "16px 26px",
                        background: "#f9fafb",
                        borderBottom: "1px solid #E5E7EB",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                    }}
                >
                    <div
                        style={{
                            width: 40, height: 40, borderRadius: 12,
                            background: "#f0fdf4",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#16a34a",
                            fontSize: 16, fontWeight: 700,
                        }}
                    >
                        {user?.firstName?.charAt(0) || user?.username?.charAt(0) || "U"}
                    </div>
                    <div>
                        <p style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", margin: 0 }}>
                            {user?.firstName && user?.lastName
                                ? `${user.firstName} ${user.lastName}`
                                : user?.username || "User"}
                        </p>
                        <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
                            {user?.email}
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Settings List ───────────────────── */}
            <div className="animate-fade-in-up anim-delay-100">
                <p style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>
                    Account Settings
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {settings.map((setting, index) => (
                        <div
                            key={setting.href}
                            className="animate-fade-in-up"
                            style={{ animationDelay: `${(index + 1) * 100}ms` }}
                        >
                            <SettingsCard {...setting} />
                        </div>
                    ))}
                </div>
            </div>

            {/* ── App Info ───────────────────────── */}
            <div
                className="animate-fade-in-up anim-delay-500"
                style={{
                    marginTop: 32,
                    padding: "20px",
                    borderRadius: 16,
                    background: "#f9fafb",
                    border: "1px solid #E5E7EB",
                    textAlign: "center",
                }}
            >
                <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
                    Aegis Safety App v1.0.0
                </p>
                <p style={{ fontSize: 11, color: "#d1d5db", marginTop: 4, margin: 0 }}>
                    © 2026 Aegis. All rights reserved.
                </p>
            </div>
        </div>
    );
}
