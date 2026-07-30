"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useToast } from "@/app/dashboard/_components/ToastContext";
import ConfirmModal from "@/app/dashboard/_components/ConfirmModal";
import { getAdminAlerts, resolveAdminAlert, AdminAlert } from "@/lib/api/admin";

// SVG Icons
function SearchIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    );
}
function CheckIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}
function XIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}
function SpinnerIcon({ size = 16 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="animate-spin">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    );
}
function AlertEmptyIcon() {
    return (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    );
}
function MapPinIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
        </svg>
    );
}

// Helpers
function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function truncateId(id: string): string {
    return id.length > 8 ? `${id.slice(0, 8)}…` : id;
}

// Status badge
function StatusBadge({ status }: { status: "active" | "resolved" }) {
    const isActive = status === "active";
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "3px 10px",
                borderRadius: 999,
                fontSize: 11.5,
                fontWeight: 600,
                background: isActive ? "#fef3c7" : "#dcfce7",
                color: isActive ? "#b45309" : "#16a34a",
                border: `1px solid ${isActive ? "#fde68a" : "#bbf7d0"}`,
            }}
        >
            <span
                style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: isActive ? "#b45309" : "#16a34a",
                    flexShrink: 0,
                    animation: isActive ? "pulse 2s infinite" : "none",
                }}
            />
            {isActive ? "Active" : "Resolved"}
        </span>
    );
}

// Skeleton row
function SkeletonTableRow() {
    return (
        <tr>
            {[140, 120, 100, 80, 80, 100, 80].map((w, i) => (
                <td key={i} style={{ padding: "14px 16px" }}>
                    <div className="animate-shimmer" style={{ height: 14, width: w, borderRadius: 6 }} />
                </td>
            ))}
        </tr>
    );
}

// Alert Detail Modal
interface AlertDetailModalProps {
    open: boolean;
    alert: AdminAlert | null;
    onClose: () => void;
    onResolve: () => void;
    loading: boolean;
}

function AlertDetailModal({ open, alert, onClose, onResolve, loading }: AlertDetailModalProps) {
    useEffect(() => {
        if (!open) return;
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !loading) onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", onKey);
        };
    }, [open, loading, onClose]);

    if (!open || !alert) return null;

    return (
        <div
            onClick={() => { if (!loading) onClose(); }}
            style={{
                position: "fixed", inset: 0, zIndex: 8000,
                background: "rgba(15,23,42,0.45)", backdropFilter: "blur(4px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "20px",
            }}
        >
            <div
                className="animate-scale-in"
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: "#fff", borderRadius: 22,
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 24px 60px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.08)",
                    width: "100%", maxWidth: 500,
                    maxHeight: "90vh", overflowY: "auto",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "22px 24px", borderBottom: "1px solid #f3f4f6",
                    }}
                >
                    <div>
                        <h2 style={{ fontSize: 17, fontWeight: 800, color: "#0f172a" }}>
                            Alert Details
                        </h2>
                        <p style={{ fontSize: 13, color: "#6b7280", marginTop: 3 }}>
                            ID: {truncateId(alert._id)}
                        </p>
                    </div>
                    {!loading && (
                        <button
                            onClick={onClose}
                            aria-label="Close"
                            style={{
                                width: 32, height: 32, borderRadius: 8, border: "none",
                                background: "transparent", cursor: "pointer",
                                color: "#9ca3af", display: "flex", alignItems: "center",
                                justifyContent: "center", transition: "background 0.15s, color 0.15s",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.background = "#f3f4f6";
                                (e.currentTarget as HTMLButtonElement).style.color = "#374151";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                                (e.currentTarget as HTMLButtonElement).style.color = "#9ca3af";
                            }}
                        >
                            <XIcon />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div style={{ padding: "24px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        {/* Status */}
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                            <StatusBadge status={alert.status} />
                        </div>

                        {/* Location */}
                        <div>
                            <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 6 }}>
                                Location
                            </p>
                            <p style={{ fontSize: 14, color: "#374151" }}>
                                {alert.address || `${alert.latitude.toFixed(6)}, ${alert.longitude.toFixed(6)}`}
                            </p>
                        </div>

                        {/* Coordinates */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <div>
                                <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 6 }}>
                                    Latitude
                                </p>
                                <p style={{ fontSize: 13, color: "#374151", fontFamily: "monospace" }}>
                                    {alert.latitude.toFixed(6)}
                                </p>
                            </div>
                            <div>
                                <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 6 }}>
                                    Longitude
                                </p>
                                <p style={{ fontSize: 13, color: "#374151", fontFamily: "monospace" }}>
                                    {alert.longitude.toFixed(6)}
                                </p>
                            </div>
                        </div>

                        {/* Metadata */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <div>
                                <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 6 }}>
                                    Triggered At
                                </p>
                                <p style={{ fontSize: 13, color: "#374151" }}>
                                    {formatDate(alert.triggeredAt)}
                                </p>
                            </div>
                            {alert.resolvedAt && (
                                <div>
                                    <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 6 }}>
                                        Resolved At
                                    </p>
                                    <p style={{ fontSize: 13, color: "#374151" }}>
                                        {formatDate(alert.resolvedAt)}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* User ID */}
                        <div>
                            <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 6 }}>
                                User ID
                            </p>
                            <p style={{ fontSize: 13, color: "#374151", fontFamily: "monospace" }}>
                                {truncateId(alert.userId)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer - Resolve Action */}
                {alert.status === "active" && (
                    <div
                        style={{
                            display: "flex", justifyContent: "flex-end", gap: 10,
                            padding: "16px 24px", borderTop: "1px solid #f3f4f6",
                        }}
                    >
                        <button
                            type="button"
                            onClick={onResolve}
                            disabled={loading}
                            style={{
                                padding: "10px 18px", borderRadius: 11, border: "none",
                                background: "#16a34a", color: "#fff",
                                fontSize: 13.5, fontWeight: 700,
                                cursor: loading ? "not-allowed" : "pointer",
                                display: "flex", alignItems: "center", gap: 8,
                                boxShadow: "var(--shadow-green)",
                                opacity: loading ? 0.85 : 1, transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) => { if (!loading) (e.currentTarget.style.background = "#15803d"); }}
                            onMouseLeave={(e) => { if (!loading) (e.currentTarget.style.background = "#16a34a"); }}
                        >
                            {loading ? <><SpinnerIcon /> Resolving…</> : <><CheckIcon /> Resolve Alert</>}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// Main Page
export default function AdminAlertsPage() {
    const toast = useToast();
    const [alerts, setAlerts] = useState<AdminAlert[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<"all" | "active" | "resolved">("all");
    const [selectedAlert, setSelectedAlert] = useState<AdminAlert | null>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [resolveLoading, setResolveLoading] = useState(false);
    const lastRequestKeyRef = useRef<string | null>(null);

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            setSearchQuery(searchInput.trim());
        }, 450);

        return () => window.clearTimeout(timeout);
    }, [searchInput]);

    // Fetch alerts
    const fetchAlerts = useCallback(async (force = false) => {
        const requestKey = JSON.stringify({
            status: selectedStatus,
            search: searchQuery,
        });

        if (!force && lastRequestKeyRef.current === requestKey) {
            return;
        }

        lastRequestKeyRef.current = requestKey;
        setLoading(true);
        setError(null);
        try {
            const filters: any = {};
            if (selectedStatus !== "all") filters.status = selectedStatus;
            if (searchQuery) filters.search = searchQuery;
            
            const response = await getAdminAlerts(1, 100, filters);
            if (response.success) {
                setAlerts(response.data);
            } else {
                setError(response.message || "Failed to fetch alerts");
            }
        } catch (err: any) {
            const message =
                err?.response?.status === 429
                    ? "Too many requests were sent to the server. Please wait a moment and try again."
                    : err?.message || "Failed to fetch alerts";
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [selectedStatus, searchQuery]);

    useEffect(() => {
        fetchAlerts();
    }, [fetchAlerts]);

    // Handle resolve
    const handleResolve = async () => {
        if (!selectedAlert) return;
        
        setResolveLoading(true);
        try {
            const response = await resolveAdminAlert(selectedAlert._id);
            if (response.success) {
                toast.showToast("Alert resolved successfully", "success");
                setDetailModalOpen(false);
                fetchAlerts(true);
            } else {
                toast.showToast(response.message || "Failed to resolve alert", "error");
            }
        } catch (err: any) {
            console.error("Resolve error:", err);
            toast.showToast("Failed to resolve alert", "error");
        } finally {
            setResolveLoading(false);
        }
    };

    // Open detail modal
    const openDetailModal = (alert: AdminAlert) => {
        setSelectedAlert(alert);
        setDetailModalOpen(true);
    };

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
                    SOS Alert Management
                </h1>
                <p style={{ fontSize: 14, color: "#6b7280" }}>
                    View and manage all SOS emergency alerts across the platform.
                </p>
            </div>

            {/* Filters */}
            <div
                style={{
                    marginBottom: 24,
                    padding: "24px",
                    borderRadius: 16,
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    boxShadow: "var(--shadow-sm)",
                }}
            >
                <div style={{ marginBottom: 16 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>
                        Filter Alerts
                    </h3>
                    <p style={{ fontSize: 12, color: "#6b7280" }}>
                        Search by address or filter by status
                    </p>
                </div>
                
                <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-end" }}>
                    {/* Search */}
                    <div style={{ flex: "1 1 320px", minWidth: 260 }}>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                            Search by Address
                        </label>
                        <div style={{ position: "relative" }}>
                            <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", display: "flex", alignItems: "center", pointerEvents: "none" }}>
                                <SearchIcon />
                            </span>
                            <input
                                type="text"
                                placeholder="Type to search alert addresses..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                style={{
                                    width: "100%",
                                    height: 42,
                                    padding: "11px 40px 11px 14px",
                                    borderRadius: 10,
                                    border: "1.5px solid #e5e7eb",
                                    fontSize: 13.5,
                                    color: "#0f172a",
                                    background: "#f9fafb",
                                    outline: "none",
                                    transition: "border-color 0.2s, background 0.2s",
                                }}
                                onFocus={(e) => { e.target.style.borderColor = "#16a34a"; e.target.style.background = "#fff"; }}
                                onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#f9fafb"; }}
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div style={{ flex: "0 1 180px", minWidth: 160 }}>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                            Status
                        </label>
                        <div style={{ position: "relative" }}>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value as "all" | "active" | "resolved")}
                                style={{
                                    width: "100%",
                                    padding: "11px 36px 11px 14px",
                                    borderRadius: 10,
                                    border: "1.5px solid #e5e7eb",
                                    fontSize: 13.5,
                                    color: "#0f172a",
                                    background: "#f9fafb",
                                    outline: "none",
                                    appearance: "none",
                                    cursor: "pointer",
                                    transition: "border-color 0.2s, background 0.2s",
                                }}
                                onFocus={(e) => { e.target.style.borderColor = "#16a34a"; e.target.style.background = "#fff"; }}
                                onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#f9fafb"; }}
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="resolved">Resolved</option>
                            </select>
                            <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#9ca3af" }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setSearchInput("");
                            setSelectedStatus("all");
                            lastRequestKeyRef.current = null;
                        }}
                        style={{
                            height: 42,
                            padding: "0 16px",
                            borderRadius: 10,
                            border: "1px solid #d1d5db",
                            background: "#fff",
                            color: "#374151",
                            fontSize: 13.5,
                            fontWeight: 600,
                            cursor: "pointer",
                        }}
                    >
                        Clear filters
                    </button>
                </div>
            </div>

            {/* Alerts Table */}
            <div
                style={{
                    background: "#fff",
                    borderRadius: 16,
                    border: "1px solid #e5e7eb",
                    boxShadow: "var(--shadow-sm)",
                    overflow: "hidden",
                }}
            >
                {loading ? (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                                {["ID", "Location", "Status", "Triggered", "Resolved", "Actions"].map((h) => (
                                    <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.7px" }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(5)].map((_, i) => <SkeletonTableRow key={i} />)}
                        </tbody>
                    </table>
                ) : error ? (
                    <div style={{ padding: "64px 32px", textAlign: "center" }}>
                        <p style={{ fontSize: 15, color: "#dc2626", marginBottom: 16 }}>{error}</p>
                        <button
                            onClick={() => fetchAlerts(true)}
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
                            Retry
                        </button>
                    </div>
                ) : alerts.length === 0 ? (
                    <div style={{ padding: "64px 32px", textAlign: "center" }}>
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                            <AlertEmptyIcon />
                        </div>
                        <p style={{ fontSize: 15, fontWeight: 600, color: "#0f172a", marginBottom: 6 }}>
                            No alerts found
                        </p>
                        <p style={{ fontSize: 13, color: "#6b7280" }}>
                            {searchQuery || selectedStatus !== "all"
                                ? "Try adjusting your filters"
                                : "No SOS alerts have been triggered yet"}
                        </p>
                    </div>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                                {["ID", "Location", "Status", "Triggered", "Resolved", "Actions"].map((h) => (
                                    <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.7px" }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {alerts.map((alert: AdminAlert) => (
                                <tr key={alert._id} style={{ borderBottom: "1px solid #f3f4f6", transition: "background 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#6b7280", fontFamily: "monospace" }}>
                                        {truncateId(alert._id)}
                                    </td>
                                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}>
                                        <span style={{ flexShrink: 0, color: "#9ca3af", display: "flex" }}><MapPinIcon /></span>
                                        {alert.address || `${alert.latitude.toFixed(4)}, ${alert.longitude.toFixed(4)}`}
                                    </td>
                                    <td style={{ padding: "14px 16px" }}>
                                        <StatusBadge status={alert.status} />
                                    </td>
                                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#6b7280" }}>
                                        {formatDate(alert.triggeredAt)}
                                    </td>
                                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#6b7280" }}>
                                        {alert.resolvedAt ? formatDate(alert.resolvedAt) : "—"}
                                    </td>
                                    <td style={{ padding: "14px 16px" }}>
                                        <button
                                            onClick={() => openDetailModal(alert)}
                                            style={{
                                                padding: "6px 12px",
                                                borderRadius: 8,
                                                border: "1px solid #e5e7eb",
                                                background: "#fff",
                                                color: "#374151",
                                                fontSize: 12,
                                                fontWeight: 600,
                                                cursor: "pointer",
                                                transition: "all 0.15s",
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#16a34a"; e.currentTarget.style.color = "#16a34a"; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#374151"; }}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Detail Modal */}
            <AlertDetailModal
                open={detailModalOpen}
                alert={selectedAlert}
                onClose={() => setDetailModalOpen(false)}
                onResolve={handleResolve}
                loading={resolveLoading}
            />
        </div>
    );
}
