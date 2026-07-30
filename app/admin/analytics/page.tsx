"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/app/dashboard/_components/ToastContext";
import { getAdminAnalytics, AdminAnalytics } from "@/lib/api/admin";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ['#16a34a', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function AdminAnalyticsPage() {
    const toast = useToast();
    const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getAdminAnalytics();
                if (response.success) {
                    setAnalytics(response.data);
                } else {
                    setError(response.message || "Failed to fetch analytics");
                }
            } catch (err: any) {
                setError(err?.message || "Failed to fetch analytics");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [toast]);

    if (loading) {
        return (
            <div className="animate-fade-in-up" style={{ maxWidth: 1400, margin: "0 auto" }}>
                <div style={{ padding: "64px 32px", textAlign: "center" }}>
                    <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#16a34a"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        className="animate-spin"
                    >
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="animate-fade-in-up" style={{ maxWidth: 1400, margin: "0 auto" }}>
                <div style={{ padding: "64px 32px", textAlign: "center" }}>
                    <p style={{ fontSize: 15, color: "#dc2626", marginBottom: 16 }}>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in-up" style={{ maxWidth: 1400, margin: "0 auto" }}>
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
                    Analytics Dashboard
                </h1>
                <p style={{ fontSize: 14, color: "#6b7280" }}>
                    View platform analytics, trends, and insights.
                </p>
            </div>

            {/* Stats Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 28 }}>
                <div
                    style={{
                        background: "#fff",
                        borderRadius: 16,
                        border: "1px solid #e5e7eb",
                        boxShadow: "var(--shadow-sm)",
                        padding: "24px",
                    }}
                >
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 8 }}>
                        Active Users
                    </p>
                    <p style={{ fontSize: 32, fontWeight: 800, color: "#0f172a" }}>
                        {analytics?.activeUsers || 0}
                    </p>
                </div>
                <div
                    style={{
                        background: "#fff",
                        borderRadius: 16,
                        border: "1px solid #e5e7eb",
                        boxShadow: "var(--shadow-sm)",
                        padding: "24px",
                    }}
                >
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 8 }}>
                        Incident Trends
                    </p>
                    <p style={{ fontSize: 32, fontWeight: 800, color: "#0f172a" }}>
                        {analytics?.incidentTrends?.length || 0}
                    </p>
                </div>
                <div
                    style={{
                        background: "#fff",
                        borderRadius: 16,
                        border: "1px solid #e5e7eb",
                        boxShadow: "var(--shadow-sm)",
                        padding: "24px",
                    }}
                >
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 8 }}>
                        SOS Trends
                    </p>
                    <p style={{ fontSize: 32, fontWeight: 800, color: "#0f172a" }}>
                        {analytics?.sosTrends?.length || 0}
                    </p>
                </div>
                <div
                    style={{
                        background: "#fff",
                        borderRadius: 16,
                        border: "1px solid #e5e7eb",
                        boxShadow: "var(--shadow-sm)",
                        padding: "24px",
                    }}
                >
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 8 }}>
                        User Growth
                    </p>
                    <p style={{ fontSize: 32, fontWeight: 800, color: "#0f172a" }}>
                        {analytics?.userGrowth?.length || 0}
                    </p>
                </div>
            </div>

            {/* Charts Section */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))", gap: 20, marginBottom: 28 }}>
                {/* Incident Trends Chart */}
                <div
                    style={{
                        background: "#fff",
                        borderRadius: 16,
                        border: "1px solid #e5e7eb",
                        boxShadow: "var(--shadow-sm)",
                        padding: "24px",
                    }}
                >
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 16 }}>
                        Incident Trends (7 Days)
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analytics?.incidentTrends || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="count" stroke="#16a34a" strokeWidth={2} name="Incidents" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* SOS Trends Chart */}
                <div
                    style={{
                        background: "#fff",
                        borderRadius: 16,
                        border: "1px solid #e5e7eb",
                        boxShadow: "var(--shadow-sm)",
                        padding: "24px",
                    }}
                >
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 16 }}>
                        SOS Alert Trends (7 Days)
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analytics?.sosTrends || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="count" stroke="#ef4444" strokeWidth={2} name="SOS Alerts" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* User Growth Chart */}
                <div
                    style={{
                        background: "#fff",
                        borderRadius: 16,
                        border: "1px solid #e5e7eb",
                        boxShadow: "var(--shadow-sm)",
                        padding: "24px",
                    }}
                >
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 16 }}>
                        User Growth (30 Days)
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics?.userGrowth || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#3b82f6" name="New Users" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Incident Categories Chart */}
                <div
                    style={{
                        background: "#fff",
                        borderRadius: 16,
                        border: "1px solid #e5e7eb",
                        boxShadow: "var(--shadow-sm)",
                        padding: "24px",
                    }}
                >
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 16 }}>
                        Incident Categories
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={analytics?.incidentCategories || []}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="count"
                            >
                                {(analytics?.incidentCategories || []).map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Reports Per Day Chart */}
                <div
                    style={{
                        background: "#fff",
                        borderRadius: 16,
                        border: "1px solid #e5e7eb",
                        boxShadow: "var(--shadow-sm)",
                        padding: "24px",
                    }}
                >
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 16 }}>
                        Reports Per Day (30 Days)
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics?.reportsPerDay || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#f59e0b" name="Reports" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Safety Circle Growth Chart */}
                <div
                    style={{
                        background: "#fff",
                        borderRadius: 16,
                        border: "1px solid #e5e7eb",
                        boxShadow: "var(--shadow-sm)",
                        padding: "24px",
                    }}
                >
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 16 }}>
                        Safety Circle Growth (30 Days)
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analytics?.safetyCircleGrowth || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} name="Safety Circles" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Monthly Reports Chart */}
            <div
                style={{
                    background: "#fff",
                    borderRadius: 16,
                    border: "1px solid #e5e7eb",
                    boxShadow: "var(--shadow-sm)",
                    padding: "24px",
                    marginBottom: 28,
                }}
            >
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 16 }}>
                    Monthly Reports (12 Months)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics?.reportsPerMonth || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#06b6d4" name="Monthly Reports" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
