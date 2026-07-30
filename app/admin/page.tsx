"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import StatCard from "../dashboard/_components/StatCard";
import Link from "next/link";
import { getAdminDashboard, getAdminAnalytics } from "@/lib/api/admin";
import { API } from "@/lib/api/endpoints";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// ─────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────
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
function AdminIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l7 4v5c0 5.25-3.5 9.74-7 11-3.5-1.26-7-5.75-7-11V6l7-4z" />
            <path d="M9 12l2 2 4-4" />
        </svg>
    );
}
function ActiveIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    );
}
function InactiveIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
    );
}
function AnalyticsIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
    );
}
function ReportsIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    );
}
function AlertsIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
    );
}
function MapIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
            <line x1="8" y1="2" x2="8" y2="18" />
            <line x1="16" y1="6" x2="16" y2="22" />
        </svg>
    );
}
function SettingsIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
    );
}
function ClockIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    );
}
function ServerIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
            <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
            <line x1="6" y1="6" x2="6.01" y2="6" />
            <line x1="6" y1="18" x2="6.01" y2="18" />
        </svg>
    );
}
function DatabaseIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
    );
}
function ShieldIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    );
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function getGreeting(): string {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
export default function AdminDashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalAdmins: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        totalIncidents: 0,
        pendingIncidents: 0,
        activeSOSAlerts: 0,
        activitiesToday: 0,
    });
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dashboardRes, analyticsRes] = await Promise.all([
                    getAdminDashboard(),
                    getAdminAnalytics()
                ]);
                
                if (dashboardRes?.success) {
                    setStats({
                        totalUsers: dashboardRes.data.totalUsers,
                        totalAdmins: dashboardRes.data.totalUsers - dashboardRes.data.activeUsers,
                        activeUsers: dashboardRes.data.activeUsers,
                        inactiveUsers: dashboardRes.data.blockedUsers,
                        totalIncidents: dashboardRes.data.totalIncidents,
                        pendingIncidents: dashboardRes.data.pendingIncidents,
                        activeSOSAlerts: dashboardRes.data.activeSOSAlerts,
                        activitiesToday: dashboardRes.data.activitiesToday,
                    });
                }
                
                if (analyticsRes?.success) {
                    setAnalytics(analyticsRes.data);
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const COLORS = ['#16a34a', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

    return (
        <div className="animate-fade-in-up" style={{ maxWidth: 1200, margin: "0 auto" }}>
            {/* Page Header */}
            <div style={{ marginBottom: 28 }}>
                <h1
                    style={{
                        fontSize: 26,
                        fontWeight: 800,
                        color: "#0f172a",
                        letterSpacing: "-0.5px",
                        lineHeight: 1.2,
                        marginBottom: 6,
                    }}
                >
                    Admin Dashboard
                </h1>
                <p style={{ fontSize: 14, color: "#6b7280" }}>
                    {getGreeting()}, {user?.firstName}. Manage users and monitor the Aegis+ platform.
                </p>
            </div>

            {/* Stats Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 28 }}>
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    description="Registered accounts"
                    icon={<UsersIcon />}
                    iconColor="#16a34a"
                    animClass="anim-delay-100"
                />
                <StatCard
                    title="Total Admins"
                    value={stats.totalAdmins}
                    description="Administrators"
                    icon={<AdminIcon />}
                    iconColor="#0ea5e9"
                    animClass="anim-delay-200"
                />
                <StatCard
                    title="Active Users"
                    value={stats.activeUsers}
                    description="Currently active"
                    icon={<ActiveIcon />}
                    iconColor="#16a34a"
                    badge="Active"
                    badgeVariant="success"
                    animClass="anim-delay-300"
                />
                <StatCard
                    title="Inactive Users"
                    value={stats.inactiveUsers}
                    description="Deactivated accounts"
                    icon={<InactiveIcon />}
                    iconColor="#6b7280"
                    badge="Inactive"
                    badgeVariant="neutral"
                    animClass="anim-delay-400"
                />
            </div>

            {/* Quick Actions */}
            <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>
                    Quick Actions
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                    <Link
                        href="/admin/users"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                            padding: "18px 20px",
                            borderRadius: 14,
                            background: "#ffffff",
                            border: "1px solid #e5e7eb",
                            boxShadow: "var(--shadow-sm)",
                            textDecoration: "none",
                            transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#16a34a";
                            e.currentTarget.style.boxShadow = "var(--shadow-md)";
                            e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#e5e7eb";
                            e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                    >
                        <div
                            style={{
                                width: 44,
                                height: 44,
                                borderRadius: 11,
                                background: "#f0fdf4",
                                border: "1px solid #bbf7d0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#16a34a",
                                flexShrink: 0,
                            }}
                        >
                            <UsersIcon />
                        </div>
                        <div>
                            <p style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 2 }}>
                                Manage Users
                            </p>
                            <p style={{ fontSize: 12, color: "#6b7280" }}>
                                View, create, edit, and delete users
                            </p>
                        </div>
                    </Link>

                    <Link
                        href="/admin/incidents"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                            padding: "18px 20px",
                            borderRadius: 14,
                            background: "#ffffff",
                            border: "1px solid #e5e7eb",
                            boxShadow: "var(--shadow-sm)",
                            textDecoration: "none",
                            transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#16a34a";
                            e.currentTarget.style.boxShadow = "var(--shadow-md)";
                            e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#e5e7eb";
                            e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                    >
                        <div
                            style={{
                                width: 44,
                                height: 44,
                                borderRadius: 11,
                                background: "#fef3c7",
                                border: "1px solid #fde68a",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#b45309",
                                flexShrink: 0,
                            }}
                        >
                            <IncidentsIcon />
                        </div>
                        <div>
                            <p style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 2 }}>
                                Manage Incidents
                            </p>
                            <p style={{ fontSize: 12, color: "#6b7280" }}>
                                Review and verify incident reports
                            </p>
                        </div>
                    </Link>

                    <Link
                        href="/admin/alerts"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                            padding: "18px 20px",
                            borderRadius: 14,
                            background: "#ffffff",
                            border: "1px solid #e5e7eb",
                            boxShadow: "var(--shadow-sm)",
                            textDecoration: "none",
                            transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#16a34a";
                            e.currentTarget.style.boxShadow = "var(--shadow-md)";
                            e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#e5e7eb";
                            e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                    >
                        <div
                            style={{
                                width: 44,
                                height: 44,
                                borderRadius: 11,
                                background: "#fee2e2",
                                border: "1px solid #fecaca",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#dc2626",
                                flexShrink: 0,
                            }}
                        >
                            <AlertsIcon />
                        </div>
                        <div>
                            <p style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 2 }}>
                                SOS Alerts
                            </p>
                            <p style={{ fontSize: 12, color: "#6b7280" }}>
                                Monitor and resolve emergency alerts
                            </p>
                        </div>
                    </Link>

                    <Link
                        href="/admin/safety-map"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                            padding: "18px 20px",
                            borderRadius: 14,
                            background: "#ffffff",
                            border: "1px solid #e5e7eb",
                            boxShadow: "var(--shadow-sm)",
                            textDecoration: "none",
                            transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#16a34a";
                            e.currentTarget.style.boxShadow = "var(--shadow-md)";
                            e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#e5e7eb";
                            e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                    >
                        <div
                            style={{
                                width: 44,
                                height: 44,
                                borderRadius: 11,
                                background: "#dbeafe",
                                border: "1px solid #bfdbfe",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#1d4ed8",
                                flexShrink: 0,
                            }}
                        >
                            <MapIcon />
                        </div>
                        <div>
                            <p style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 2 }}>
                                Safety Map
                            </p>
                            <p style={{ fontSize: 12, color: "#6b7280" }}>
                                View incidents and risk zones
                            </p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Charts Section */}
            {analytics && (
                <div style={{ marginBottom: 28 }}>
                    <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>
                        Analytics Overview
                    </h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))", gap: 20 }}>
                        {/* Incident Trends Chart */}
                        <div
                            style={{
                                padding: "24px",
                                borderRadius: 16,
                                background: "#ffffff",
                                border: "1px solid #e5e7eb",
                                boxShadow: "var(--shadow-sm)",
                            }}
                        >
                            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 16 }}>
                                Incident Trends (7 Days)
                            </h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={analytics.incidentTrends}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 11 }} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="count" stroke="#16a34a" strokeWidth={2} name="Incidents" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Incident Categories Chart */}
                        <div
                            style={{
                                padding: "24px",
                                borderRadius: 16,
                                background: "#ffffff",
                                border: "1px solid #e5e7eb",
                                boxShadow: "var(--shadow-sm)",
                            }}
                        >
                            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 16 }}>
                                Incident Categories
                            </h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={analytics.incidentCategories}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="count"
                                    >
                                        {analytics.incidentCategories.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* User Growth Chart */}
                        <div
                            style={{
                                padding: "24px",
                                borderRadius: 16,
                                background: "#ffffff",
                                border: "1px solid #e5e7eb",
                                boxShadow: "var(--shadow-sm)",
                            }}
                        >
                            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 16 }}>
                                User Growth (30 Days)
                            </h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={analytics.userGrowth}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 11 }} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#3b82f6" name="New Users" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* SOS Trends Chart */}
                        <div
                            style={{
                                padding: "24px",
                                borderRadius: 16,
                                background: "#ffffff",
                                border: "1px solid #e5e7eb",
                                boxShadow: "var(--shadow-sm)",
                            }}
                        >
                            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 16 }}>
                                SOS Alert Trends (7 Days)
                            </h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={analytics.sosTrends}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 11 }} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="count" stroke="#ef4444" strokeWidth={2} name="SOS Alerts" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Activity */}
            <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>
                    Recent Activity
                </h2>
                <div
                    style={{
                        padding: "32px 24px",
                        borderRadius: 16,
                        background: "#ffffff",
                        border: "1px solid #e5e7eb",
                        boxShadow: "var(--shadow-sm)",
                        textAlign: "center",
                    }}
                >
                    <div
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            background: "#f1f5f9",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 16px",
                            color: "#9ca3af",
                        }}
                    >
                        <ClockIcon />
                    </div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: "#0f172a", marginBottom: 6 }}>
                        Activity Monitoring
                    </p>
                    <p style={{ fontSize: 13, color: "#6b7280" }}>
                        Activity monitoring will be available in a future sprint.
                    </p>
                </div>
            </div>

            {/* System Status */}
            <div>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>
                    System Status
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                    <div
                        style={{
                            padding: "16px 18px",
                            borderRadius: 12,
                            background: "#ffffff",
                            border: "1px solid #e5e7eb",
                            boxShadow: "var(--shadow-sm)",
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                        }}
                    >
                        <div
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 9,
                                background: "#f0fdf4",
                                border: "1px solid #bbf7d0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#16a34a",
                                flexShrink: 0,
                            }}
                        >
                            <ServerIcon />
                        </div>
                        <div>
                            <p style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>Backend</p>
                            <p style={{ fontSize: 11, color: "#16a34a", fontWeight: 500 }}>Online</p>
                        </div>
                    </div>

                    <div
                        style={{
                            padding: "16px 18px",
                            borderRadius: 12,
                            background: "#ffffff",
                            border: "1px solid #e5e7eb",
                            boxShadow: "var(--shadow-sm)",
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                        }}
                    >
                        <div
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 9,
                                background: "#f0fdf4",
                                border: "1px solid #bbf7d0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#16a34a",
                                flexShrink: 0,
                            }}
                        >
                            <DatabaseIcon />
                        </div>
                        <div>
                            <p style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>Database</p>
                            <p style={{ fontSize: 11, color: "#16a34a", fontWeight: 500 }}>Connected</p>
                        </div>
                    </div>

                    <div
                        style={{
                            padding: "16px 18px",
                            borderRadius: 12,
                            background: "#ffffff",
                            border: "1px solid #e5e7eb",
                            boxShadow: "var(--shadow-sm)",
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                        }}
                    >
                        <div
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 9,
                                background: "#f0fdf4",
                                border: "1px solid #bbf7d0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#16a34a",
                                flexShrink: 0,
                            }}
                        >
                            <ShieldIcon />
                        </div>
                        <div>
                            <p style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>Authentication</p>
                            <p style={{ fontSize: 11, color: "#16a34a", fontWeight: 500 }}>Healthy</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
