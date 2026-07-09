"use client";

import { useState, useCallback } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { ToastProvider } from "./ToastContext";

interface DashboardShellProps {
    children: React.ReactNode;
}

export default function DashboardShell({ children }: DashboardShellProps) {
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

                {/* Sidebar */}
                <Sidebar
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
                    <Navbar onMenuToggle={handleMenuToggle} />

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
