"use client";

import { useAuth, buildAvatarUrl } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import StatCard from "./_components/StatCard";
import { SkeletonWelcome, SkeletonStatGrid } from "./_components/SkeletonLoader";
import type { User } from "@/context/AuthContext";

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

    const completion = user ? getProfileCompletion(user) : 0;
    const avatarUrl  = buildAvatarUrl(user?.profilePicture, picVersion);
    const initials   = user
        ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "U"
        : "U";

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
                Account Overview
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
                        title="Account Status"
                        value="Active"
                        description="Your account is in good standing"
                        icon={<UserCheckIcon />}
                        iconColor="#16a34a"
                        badge="Verified"
                        badgeVariant="success"
                        animClass="anim-delay-100"
                    />

                    {/* Profile completion card (custom) */}
                    <div
                        className="animate-fade-in-up anim-delay-200"
                        style={{
                            background: "#fff",
                            borderRadius: 18,
                            border: "1px solid #E5E7EB",
                            padding: "22px 24px",
                            boxShadow: "var(--shadow-sm)",
                            transition: "box-shadow 0.2s",
                        }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-md)")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-sm)")}
                    >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                            <div style={{
                                width: 44, height: 44, borderRadius: 12,
                                background: `${completion < 75 ? "#f59e0b" : "#16a34a"}12`,
                                border: `1px solid ${completion < 75 ? "#f59e0b" : "#16a34a"}20`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: completion < 75 ? "#f59e0b" : "#16a34a",
                            }}>
                                <BarChartIcon />
                            </div>
                            <span style={{
                                fontSize: 11, fontWeight: 600,
                                padding: "3px 9px", borderRadius: 999,
                                background: completion === 100 ? "#f0fdf4" : "#fffbeb",
                                color: completion === 100 ? "#166534" : "#92400e",
                                border: `1px solid ${completion === 100 ? "#bbf7d0" : "#fde68a"}`,
                            }}>
                                {completion === 100 ? "Complete" : "Incomplete"}
                            </span>
                        </div>
                        <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>
                            Profile Completion
                        </p>
                        <p style={{ fontSize: 26, fontWeight: 800, color: "#0f172a" }}>{completion}%</p>
                        <ProfileCompletionBar pct={completion} />
                    </div>

                    <StatCard
                        title="Security Status"
                        value="Protected"
                        description="Password and account secured"
                        icon={<ShieldCheckIcon />}
                        iconColor="#16a34a"
                        badge="Secured"
                        badgeVariant="success"
                        animClass="anim-delay-300"
                    />

                    <StatCard
                        title="Member Since"
                        value={user?.createdAt ? new Date(user.createdAt).getFullYear().toString() : "—"}
                        description={formatMemberSince(user?.createdAt)}
                        icon={<CalendarIcon />}
                        iconColor="#0ea5e9"
                        animClass="anim-delay-400"
                    />
                </div>
            )}

            {/* ── QUICK ACTIONS ──────────────────────── */}
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "1.1px", textTransform: "uppercase", marginBottom: 14 }}>
                Quick Actions
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
                    accentColor="#16a34a"
                    animClass="anim-delay-400"
                />
                <QuickActionCard
                    title="Update Profile"
                    description="Edit your name, phone number, gender, and profile photo."
                    href="/dashboard/profile"
                    icon={<PencilIcon />}
                    accentColor="#15803d"
                    animClass="anim-delay-500"
                />
                <QuickActionCard
                    title="Change Password"
                    description="Update your password and review account security settings."
                    href="/dashboard/password"
                    icon={<LockIcon />}
                    accentColor="#475569"
                    animClass="anim-delay-600"
                />
                <QuickActionCard
                    title="Emergency Contacts"
                    description="Manage trusted contacts who will be notified in emergencies."
                    href="/dashboard/contacts"
                    icon={<ContactsIcon />}
                    accentColor="#16a34a"
                    animClass="anim-delay-700"
                />
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
