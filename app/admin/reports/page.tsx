"use client";

export default function AdminReportsPage() {
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
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                    </svg>
                </div>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>
                    Reports
                </h1>
                <p style={{ fontSize: 15, color: "#6b7280", lineHeight: 1.6 }}>
                    Comprehensive reporting and analytics will be available in a future sprint.
                </p>
            </div>
        </div>
    );
}
