import { Alert } from "@/lib/api/alert";

interface AlertListProps {
    alerts: Alert[];
    onResolve: (alert: Alert) => void;
}

// ─────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────
function MapPinIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    );
}
function ClockIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    );
}
function CheckCircleIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    );
}
function AlertTriangleIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    );
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

// ─────────────────────────────────────────────
// Alert Card
// ─────────────────────────────────────────────
function AlertCard({ alert, onResolve }: { alert: Alert; onResolve: (alert: Alert) => void }) {
    const isActive = alert.status === "active";

    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 16,
                border: `1.5px solid ${isActive ? "#fecaca" : "#E5E7EB"}`,
                padding: "18px 20px",
                boxShadow: isActive ? "0 2px 8px rgba(220,38,38,0.08)" : "var(--shadow-sm)",
                transition: "all 0.15s",
            }}
        >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: isActive ? "#fef2f2" : "#f0fdf4",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: isActive ? "#dc2626" : "#16a34a",
                    }}>
                        {isActive ? <AlertTriangleIcon /> : <CheckCircleIcon />}
                    </div>
                    <div>
                        <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
                            {isActive ? "Active SOS Alert" : "Resolved Alert"}
                        </p>
                        <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>
                            {formatDate(alert.triggeredAt)}
                        </p>
                    </div>
                </div>
                <span style={{
                    padding: "4px 10px", borderRadius: 999,
                    fontSize: 11, fontWeight: 700,
                    background: isActive ? "#dc2626" : "#16a34a",
                    color: "#fff",
                }}>
                    {isActive ? "ACTIVE" : "RESOLVED"}
                </span>
            </div>

            {/* Location info */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "#9ca3af" }}><MapPinIcon /></span>
                    <span style={{ fontSize: 13, color: "#374151" }}>
                        {alert.address || `${alert.latitude.toFixed(6)}, ${alert.longitude.toFixed(6)}`}
                    </span>
                </div>
                {alert.resolvedAt && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ color: "#9ca3af" }}><ClockIcon /></span>
                        <span style={{ fontSize: 13, color: "#374151" }}>
                            Resolved: {formatDate(alert.resolvedAt)}
                        </span>
                    </div>
                )}
            </div>

            {/* Actions */}
            {isActive && (
                <div style={{ paddingTop: 12, borderTop: "1px solid #f9fafb", display: "flex", justifyContent: "flex-end" }}>
                    <button
                        onClick={() => onResolve(alert)}
                        style={{
                            padding: "8px 16px",
                            borderRadius: 10,
                            border: "1.5px solid #bbf7d0",
                            background: "#f0fdf4",
                            color: "#16a34a",
                            fontSize: 12.5,
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background = "#dcfce7";
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "#86efac";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background = "#f0fdf4";
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "#bbf7d0";
                        }}
                    >
                        Resolve Alert
                    </button>
                </div>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────
// Alert List Component
// ─────────────────────────────────────────────
export default function AlertList({ alerts, onResolve }: AlertListProps) {
    if (alerts.length === 0) {
        return (
            <div
                className="animate-fade-in"
                style={{
                    background: "#fff",
                    borderRadius: 22,
                    border: "1px solid #E5E7EB",
                    padding: "48px 24px",
                    textAlign: "center",
                    boxShadow: "var(--shadow-sm)",
                }}
            >
                <div style={{
                    width: 64, height: 64, borderRadius: "50%",
                    background: "#f0fdf4",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 16px",
                    color: "#16a34a",
                }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2l7 4v5c0 5.25-3.5 9.74-7 11-3.5-1.26-7-5.75-7-11V6l7-4z" />
                        <path d="M12 8v4" />
                        <path d="M12 16h.01" />
                    </svg>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
                    No Alerts Yet
                </h3>
                <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 0 }}>
                    You haven't triggered any emergency alerts. Stay safe!
                </p>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {alerts.map((alert) => (
                <AlertCard key={alert._id} alert={alert} onResolve={onResolve} />
            ))}
        </div>
    );
}
