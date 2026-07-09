"use client";

import { useAuth, buildAvatarUrl } from "@/context/AuthContext";
import Link from "next/link";
import { SkeletonProfile } from "../_components/SkeletonLoader";
import type { User } from "@/context/AuthContext";

// ─────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────
function MailIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
    );
}
function PhoneIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
    );
}
function UserIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}
function CalendarIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    );
}
function GenderIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="11" r="4" />
            <line x1="12" y1="3" x2="12" y2="7" />
            <line x1="9.5" y1="5" x2="14.5" y2="5" />
            <line x1="12" y1="15" x2="12" y2="21" />
            <line x1="9.5" y1="21" x2="14.5" y2="21" />
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
function PencilIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    );
}
function CheckIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}
function AlertTriangleIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    );
}
function LockIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    );
}

// ─────────────────────────────────────────────
// Completion
// ─────────────────────────────────────────────
function getProfileCompletion(user: User): number {
    const fields = [!!user.firstName, !!user.lastName, !!user.email, !!user.phoneNumber, !!user.gender];
    const hasPic = !!(user.profilePicture && user.profilePicture !== "default-profile.png");
    return Math.round(((fields.filter(Boolean).length + (hasPic ? 1 : 0)) / 6) * 100);
}

// ─────────────────────────────────────────────
// Info Row
// ─────────────────────────────────────────────
interface InfoRowProps {
    label: string;
    value?: string | null;
    icon: React.ReactNode;
    placeholder?: string;
    last?: boolean;
}
function InfoRow({ label, value, icon, placeholder = "Not provided", last = false }: InfoRowProps) {
    return (
        <div style={{
            display: "flex", alignItems: "flex-start", gap: 12,
            padding: "14px 0",
            borderBottom: last ? "none" : "1px solid #f9fafb",
        }}>
            <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: "#f8fafc", border: "1px solid #E5E7EB",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#9ca3af", flexShrink: 0,
            }}>
                {icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 3 }}>
                    {label}
                </p>
                <p style={{ fontSize: 14, fontWeight: 600, color: value ? "#0f172a" : "#d1d5db" }}>
                    {value || placeholder}
                </p>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// Security status indicator
// ─────────────────────────────────────────────
interface SecurityItemProps {
    label: string;
    sublabel: string;
    ok: boolean;
    icon: React.ReactNode;
}
function SecurityItem({ label, sublabel, ok, icon }: SecurityItemProps) {
    return (
        <div style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "14px 16px", borderRadius: 12,
            background: ok ? "#f0fdf4" : "#fffbeb",
            border: `1px solid ${ok ? "#bbf7d0" : "#fde68a"}`,
            flex: 1, minWidth: 200,
        }}>
            <div style={{
                width: 34, height: 34, borderRadius: 9,
                background: ok ? "#dcfce7" : "#fef9c3",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: ok ? "#16a34a" : "#d97706", flexShrink: 0,
            }}>
                {icon}
            </div>
            <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: ok ? "#166534" : "#92400e" }}>{label}</p>
                <p style={{ fontSize: 11, color: ok ? "#16a34a" : "#d97706", marginTop: 2 }}>{sublabel}</p>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function MyProfilePage() {
    const { user, loading, picVersion } = useAuth();

    const avatarUrl   = buildAvatarUrl(user?.profilePicture, picVersion);
    const initials    = user
        ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "U"
        : "U";
    const completion  = user ? getProfileCompletion(user) : 0;
    const memberSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })
        : "—";

    if (loading) {
        return (
            <div style={{ maxWidth: 800, margin: "0 auto" }}>
                <SkeletonProfile />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 800, margin: "0 auto" }}>

            {/* ── PROFILE HEADER ──────────────────── */}
            <div
                className="animate-fade-in-up"
                style={{
                    background: "#fff",
                    borderRadius: 22,
                    border: "1px solid #E5E7EB",
                    boxShadow: "var(--shadow-sm)",
                    overflow: "hidden",
                    marginBottom: 20,
                }}
            >
                {/* Green banner */}
                <div style={{
                    height: 96,
                    background: "linear-gradient(135deg, #052e16 0%, #14532d 55%, #166534 100%)",
                    position: "relative",
                }}>
                    <div style={{
                        position: "absolute", inset: 0,
                        backgroundImage: "radial-gradient(ellipse at 80% 50%, rgba(74,222,128,0.08) 0%, transparent 60%)",
                    }} />
                </div>

                <div style={{ padding: "0 28px 26px", marginTop: -46 }}>
                    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
                        {/* Avatar */}
                        <div style={{ position: "relative" }}>
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt={user?.firstName || "User"}
                                    style={{
                                        width: 88, height: 88, borderRadius: "50%",
                                        objectFit: "cover",
                                        border: "4px solid #fff",
                                        boxShadow: "var(--shadow-md)",
                                    }}
                                />
                            ) : (
                                <div style={{
                                    width: 88, height: 88, borderRadius: "50%",
                                    background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
                                    border: "4px solid #fff",
                                    boxShadow: "var(--shadow-md)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 28, fontWeight: 800, color: "#16a34a",
                                }}>
                                    {initials}
                                </div>
                            )}
                            {/* Online dot */}
                            <div style={{
                                position: "absolute", bottom: 5, right: 5,
                                width: 13, height: 13, borderRadius: "50%",
                                background: "#22c55e", border: "2.5px solid #fff",
                            }} />
                        </div>

                        {/* Edit button */}
                        <Link
                            href="/dashboard/profile"
                            style={{
                                display: "flex", alignItems: "center", gap: 7,
                                padding: "9px 16px", borderRadius: 11,
                                background: "#16a34a", color: "#fff",
                                fontSize: 13, fontWeight: 600, textDecoration: "none",
                                boxShadow: "var(--shadow-green)",
                                transition: "background 0.15s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#15803d")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "#16a34a")}
                        >
                            <PencilIcon />
                            Edit Profile
                        </Link>
                    </div>

                    {/* Name + badges */}
                    <div style={{ marginTop: 14 }}>
                        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>
                            {user?.firstName} {user?.lastName}
                        </h2>
                        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>
                            @{user?.username}
                        </p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                            <span style={{ padding: "3px 11px", borderRadius: 999, fontSize: 11.5, fontWeight: 700, background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0", textTransform: "capitalize" }}>
                                {user?.role || "User"}
                            </span>
                            <span style={{ padding: "3px 11px", borderRadius: 999, fontSize: 11.5, fontWeight: 700, background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0", display: "flex", alignItems: "center", gap: 4 }}>
                                <ShieldCheckIcon /> Protected
                            </span>
                            <span style={{
                                padding: "3px 11px", borderRadius: 999, fontSize: 11.5, fontWeight: 700,
                                background: completion === 100 ? "#f0fdf4" : "#fffbeb",
                                color: completion === 100 ? "#166534" : "#92400e",
                                border: `1px solid ${completion === 100 ? "#bbf7d0" : "#fde68a"}`,
                            }}>
                                {completion}% Complete
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── INFO CARDS GRID ─────────────────── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 18 }}>

                {/* Contact info */}
                <div
                    className="animate-fade-in-up anim-delay-100"
                    style={{ background: "#fff", borderRadius: 20, border: "1px solid #E5E7EB", padding: "22px", boxShadow: "var(--shadow-sm)" }}
                >
                    <h3 style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", marginBottom: 3 }}>Contact Information</h3>
                    <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 14 }}>Your personal contact details</p>
                    <InfoRow label="Email Address" value={user?.email}       icon={<MailIcon />}   />
                    <InfoRow label="Phone Number"  value={user?.phoneNumber} icon={<PhoneIcon />}  />
                    <InfoRow label="Gender"        value={user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : null} icon={<GenderIcon />} last />
                </div>

                {/* Account details */}
                <div
                    className="animate-fade-in-up anim-delay-200"
                    style={{ background: "#fff", borderRadius: 20, border: "1px solid #E5E7EB", padding: "22px", boxShadow: "var(--shadow-sm)" }}
                >
                    <h3 style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", marginBottom: 3 }}>Account Details</h3>
                    <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 14 }}>Membership and account information</p>
                    <InfoRow label="Username"     value={user?.username}   icon={<UserIcon />}     />
                    <InfoRow label="Account Role" value={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : null} icon={<UserIcon />} />
                    <InfoRow label="Member Since" value={memberSince}       icon={<CalendarIcon />} last />
                </div>
            </div>

            {/* ── SECURITY OVERVIEW ───────────────── */}
            <div
                className="animate-fade-in-up anim-delay-300"
                style={{
                    marginTop: 18,
                    background: "#fff",
                    borderRadius: 20,
                    border: "1px solid #E5E7EB",
                    padding: "22px",
                    boxShadow: "var(--shadow-sm)",
                }}
            >
                <h3 style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", marginBottom: 3 }}>Security Overview</h3>
                <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 18 }}>Your account security status</p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                    <SecurityItem
                        label="Password Protected"
                        sublabel="All good"
                        ok={true}
                        icon={<CheckIcon />}
                    />
                    <SecurityItem
                        label="Account Active"
                        sublabel="All good"
                        ok={true}
                        icon={<CheckIcon />}
                    />
                    <SecurityItem
                        label="Profile Complete"
                        sublabel={completion === 100 ? "All good" : "Action required"}
                        ok={completion === 100}
                        icon={completion === 100 ? <CheckIcon /> : <AlertTriangleIcon />}
                    />
                </div>

                <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid #f9fafb", display: "flex", justifyContent: "flex-end" }}>
                    <Link
                        href="/dashboard/password"
                        style={{
                            display: "flex", alignItems: "center", gap: 6,
                            fontSize: 12.5, fontWeight: 600, color: "#16a34a",
                            textDecoration: "none",
                            padding: "8px 14px", borderRadius: 9,
                            border: "1px solid #bbf7d0",
                            background: "#f0fdf4",
                            transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#dcfce7")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#f0fdf4")}
                    >
                        <LockIcon />
                        Change Password
                    </Link>
                </div>
            </div>
        </div>
    );
}
