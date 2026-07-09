"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminUser, AdminUser } from "@/lib/api/admin";
import { useAuth } from "@/context/AuthContext";

function ArrowLeftIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
        </svg>
    );
}

function UserIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}

function MailIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
        </svg>
    );
}

function PhoneIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
    );
}

function CalendarIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
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

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { user: currentUser } = useAuth();
    const [user, setUser] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const resolvedParams = await params;
                const id = resolvedParams.id;
                setUserId(id);

                if (!id) {
                    setError("Invalid user ID");
                    setLoading(false);
                    return;
                }

                setLoading(true);
                const response = await getAdminUser(id);
                if (response.success) {
                    setUser(response.data);
                } else {
                    setError(response.message || "Failed to fetch user");
                }
            } catch (err: any) {
                setError(err?.response?.data?.message || err?.message || "Failed to fetch user");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [params]);

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" className="animate-spin">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
                <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: 18, color: "#ef4444", marginBottom: 16 }}>{error || "User not found"}</p>
                    <button
                        onClick={() => router.push("/admin/users")}
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
                        Back to Users
                    </button>
                </div>
            </div>
        );
    }

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getInitials = (firstName?: string, lastName?: string) => {
        return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U";
    };

    return (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "28px" }}>
            {/* Back Button */}
            <button
                onClick={() => router.push("/admin/users")}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 16px",
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: 24,
                    transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "#f9fafb";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#16a34a";
                }}
                onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "#fff";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e7eb";
                }}
            >
                <ArrowLeftIcon />
                Back to Users
            </button>

            {/* Page Header */}
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>
                    User Details
                </h1>
                <p style={{ fontSize: 14, color: "#6b7280" }}>
                    View detailed information about {user.firstName} {user.lastName}
                </p>
            </div>

            {/* User Card */}
            <div
                style={{
                    background: "#fff",
                    borderRadius: 18,
                    border: "1px solid #e5e7eb",
                    padding: "32px",
                    boxShadow: "var(--shadow-sm)",
                }}
            >
                {/* Header with Avatar */}
                <div style={{ display: "flex", gap: 24, alignItems: "flex-start", marginBottom: 32, paddingBottom: 32, borderBottom: "1px solid #f3f4f6" }}>
                    <div style={{ flexShrink: 0 }}>
                        <div style={{
                            width: 80,
                            height: 80,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
                            border: "3px solid #e5e7eb",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 28,
                            fontWeight: 800,
                            color: "#16a34a",
                        }}>
                            {getInitials(user.firstName, user.lastName)}
                        </div>
                    </div>

                    <div style={{ flex: 1 }}>
                        <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>
                            {user.firstName} {user.lastName}
                        </h2>
                        <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 12 }}>
                            @{user.username}
                        </p>

                        <div style={{ display: "flex", gap: 12 }}>
                            <span style={{
                                padding: "4px 12px",
                                borderRadius: 999,
                                fontSize: 12,
                                fontWeight: 600,
                                background: user.role === "admin" ? "#dbeafe" : "#f3f4f6",
                                color: user.role === "admin" ? "#1e40af" : "#374151",
                                border: user.role === "admin" ? "1px solid #bfdbfe" : "1px solid #e5e7eb",
                            }}>
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                            <span style={{
                                padding: "4px 12px",
                                borderRadius: 999,
                                fontSize: 12,
                                fontWeight: 600,
                                background: user.status === "active" ? "#dcfce7" : "#fee2e2",
                                color: user.status === "active" ? "#166534" : "#991b1b",
                                border: user.status === "active" ? "1px solid #bbf7d0" : "1px solid #fecaca",
                            }}>
                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* User Information Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
                    {/* Email */}
                    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: 10,
                            background: "#dbeafe",
                            border: "1px solid #bfdbfe",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#1e40af", flexShrink: 0,
                        }}>
                            <MailIcon />
                        </div>
                        <div>
                            <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 4 }}>
                                Email Address
                            </p>
                            <p style={{ fontSize: 15, fontWeight: 500, color: "#374151" }}>
                                {user.email}
                            </p>
                        </div>
                    </div>

                    {/* Phone */}
                    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: 10,
                            background: "#fce7f3",
                            border: "1px solid #fbcfe8",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#be185d", flexShrink: 0,
                        }}>
                            <PhoneIcon />
                        </div>
                        <div>
                            <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 4 }}>
                                Phone Number
                            </p>
                            <p style={{ fontSize: 15, fontWeight: 500, color: "#374151" }}>
                                {user.phoneNumber || "Not provided"}
                            </p>
                        </div>
                    </div>

                    {/* Gender */}
                    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: 10,
                            background: "#fef3c7",
                            border: "1px solid #fde68a",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#b45309", flexShrink: 0,
                        }}>
                            <UserIcon />
                        </div>
                        <div>
                            <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 4 }}>
                                Gender
                            </p>
                            <p style={{ fontSize: 15, fontWeight: 500, color: "#374151" }}>
                                {user.gender || "Not provided"}
                            </p>
                        </div>
                    </div>

                    {/* Member Since */}
                    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: 10,
                            background: "#e0e7ff",
                            border: "1px solid #c7d2fe",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#4338ca", flexShrink: 0,
                        }}>
                            <CalendarIcon />
                        </div>
                        <div>
                            <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 4 }}>
                                Member Since
                            </p>
                            <p style={{ fontSize: 15, fontWeight: 500, color: "#374151" }}>
                                {formatDate(user.createdAt)}
                            </p>
                        </div>
                    </div>

                    {/* User ID */}
                    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: 10,
                            background: "#f3f4f6",
                            border: "1px solid #e5e7eb",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#374151", flexShrink: 0,
                        }}>
                            <ShieldIcon />
                        </div>
                        <div>
                            <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 4 }}>
                                User ID
                            </p>
                            <p style={{ fontSize: 15, fontWeight: 500, color: "#374151", fontFamily: "monospace" }}>
                                {user._id}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
