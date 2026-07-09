"use client";

export default function AdminAnalyticsPage() {
    return (
        <div className="animate-fade-in-up" style={{ maxWidth: 800, margin: "0 auto" }}>
            <div
                style={{
                    padding: "64px 32px",
                    borderRadius: 16,
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    boxShadow: "var(--shadow-sm)",
                    textAlign: "center",
                }}
            >
                <div
                    style={{
                        width: 64,
                        height: 64,
                        borderRadius: 16,
                        background: "#f1f5f9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 24px",
                        color: "#9ca3af",
                    }}
                >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="20" x2="18" y2="10" />
                        <line x1="12" y1="20" x2="12" y2="4" />
                        <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                </div>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>
                    Analytics
                </h1>
                <p style={{ fontSize: 15, color: "#6b7280", lineHeight: 1.6 }}>
                    Advanced analytics and data visualization will be available in a future sprint.
                </p>
            </div>
        </div>
    );
}
