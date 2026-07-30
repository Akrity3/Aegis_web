"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AdminSidebar from "./_components/AdminSidebar";
import { ToastProvider } from "../dashboard/_components/ToastContext";

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const router = useRouter();
    const { user, loading } = useAuth();

    /** Mobile: sidebar slides in as a drawer */
    const [sidebarOpen, setSidebarOpen] = useState(false);
    /** Desktop: sidebar collapses to icon-only rail */
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    /**
     * Single handler for the hamburger icon.
     * On desktop (≥1024px) it toggles the collapse state.
     * On mobile/tablet it toggles the drawer.
     */
    const handleMenuToggle = useCallback(() => {
        if (typeof window !== "undefined" && window.innerWidth >= 1024) {
            setSidebarCollapsed((v) => !v);
        } else {
            setSidebarOpen((v) => !v);
        }
    }, []);

    // Route protection: only admins can access admin routes
    // Use useEffect to avoid router.push during render
    useEffect(() => {
        // Only redirect if we're done loading AND we have a user AND user is not admin
        if (!loading && user && user.role !== "admin") {
            router.push("/dashboard");
        }
        // If we're done loading and user is null, redirect to login
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    // Show loading state while checking auth
    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" className="animate-spin">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
            </div>
        );
    }

    // Don't render if user is not admin (redirect will happen in useEffect)
    if (!user || user.role !== "admin") {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" className="animate-spin">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
            </div>
        );
    }

    return (
        <ToastProvider>
            <div
                style={{
                    display: "flex",
                    height: "100vh",
                    overflow: "hidden",
                    background: "#f8fafc",
                }}
            >
                {/* Mobile overlay backdrop */}
                {sidebarOpen && (
                    <div
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden"
                        style={{
                            position: "fixed",
                            inset: 0,
                            zIndex: 25,
                            background: "rgba(15,23,42,0.4)",
                            backdropFilter: "blur(2px)",
                        }}
                    />
                )}

                {/* Admin Sidebar */}
                <AdminSidebar
                    open={sidebarOpen}
                    collapsed={sidebarCollapsed}
                    onClose={() => setSidebarOpen(false)}
                />

                {/* Main column */}
                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        minWidth: 0,
                    }}
                >
                    {/* Admin Navbar - simplified version */}
                    <header
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0 24px",
                            height: 64,
                            background: "#ffffff",
                            borderBottom: "1px solid #e5e7eb",
                            flexShrink: 0,
                        }}
                    >
                        <button
                            onClick={handleMenuToggle}
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 8,
                                border: "1.5px solid #e5e7eb",
                                background: "#ffffff",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#374151",
                                transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "#16a34a";
                                e.currentTarget.style.color = "#16a34a";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "#e5e7eb";
                                e.currentTarget.style.color = "#374151";
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        </button>

                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            <div style={{ textAlign: "right" }}>
                                <p style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>
                                    Admin Dashboard
                                </p>
                                <p style={{ fontSize: 11.5, color: "#6b7280" }}>
                                    {user?.firstName} {user?.lastName}
                                </p>
                            </div>
                        </div>
                    </header>

                    <main
                        style={{
                            flex: 1,
                            overflowY: "auto",
                            padding: "28px",
                        }}
                    >
                        {children}
                    </main>
                </div>
            </div>
        </ToastProvider>
    );
}
