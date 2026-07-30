"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useToast } from "@/app/dashboard/_components/ToastContext";
import ConfirmModal from "@/app/dashboard/_components/ConfirmModal";
import { getAdminIncidents, updateAdminIncident, AdminIncident, IncidentCategory } from "@/lib/api/admin";

// SVG Icons
function SearchIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    );
}
function FilterIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
    );
}
function EyeIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
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
function IncidentEmptyIcon() {
    return (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
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
function StatusBadge({ status }: { status: "pending" | "verified" | "rejected" }) {
    const colors = {
        pending: { bg: "#fef3c7", border: "#fde68a", text: "#b45309", label: "Pending" },
        verified: { bg: "#dcfce7", border: "#bbf7d0", text: "#16a34a", label: "Verified" },
        rejected: { bg: "#fee2e2", border: "#fecaca", text: "#dc2626", label: "Rejected" },
    };
    const c = colors[status];
    return (
        <span
            style={{
                display: "inline-block",
                padding: "3px 10px",
                borderRadius: 999,
                fontSize: 11.5,
                fontWeight: 600,
                background: c.bg,
                color: c.text,
                border: `1px solid ${c.border}`,
            }}
        >
            {c.label}
        </span>
    );
}

// Category badge
function CategoryBadge({ category }: { category: IncidentCategory }) {
    const colors: Record<IncidentCategory, { bg: string; border: string; text: string }> = {
        "Harassment": { bg: "#fce7f3", border: "#fbcfe8", text: "#be185d" },
        "Road Accident": { bg: "#fee2e2", border: "#fecaca", text: "#dc2626" },
        "Theft / Robbery": { bg: "#fef3c7", border: "#fde68a", text: "#b45309" },
        "Suspicious Activity": { bg: "#e0e7ff", border: "#c7d2fe", text: "#4338ca" },
        "Natural Disaster": { bg: "#dbeafe", border: "#bfdbfe", text: "#1d4ed8" },
        "Fire Emergency": { bg: "#ffedd5", border: "#fed7aa", text: "#ea580c" },
        "Unsafe Infrastructure / Road Hazard": { bg: "#f3e8ff", border: "#e9d5ff", text: "#7c3aed" },
        "Other": { bg: "#f3f4f6", border: "#e5e7eb", text: "#374151" },
    };
    const c = colors[category];
    return (
        <span
            style={{
                display: "inline-block",
                padding: "3px 10px",
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 600,
                background: c.bg,
                color: c.text,
                border: `1px solid ${c.border}`,
                maxWidth: 200,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
            }}
        >
            {category}
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

// Incident Detail Modal
interface IncidentDetailModalProps {
    open: boolean;
    incident: AdminIncident | null;
    onClose: () => void;
    onStatusUpdate: (status: "verified" | "rejected") => void;
    loading: boolean;
}

function IncidentDetailModal({ open, incident, onClose, onStatusUpdate, loading }: IncidentDetailModalProps) {
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

    if (!open || !incident) return null;

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
                    width: "100%", maxWidth: 600,
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
                            Incident Details
                        </h2>
                        <p style={{ fontSize: 13, color: "#6b7280", marginTop: 3 }}>
                            ID: {truncateId(incident._id)}
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
                        {/* Category & Status */}
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                            <CategoryBadge category={incident.category} />
                            <StatusBadge status={incident.status} />
                        </div>

                        {/* Description */}
                        <div>
                            <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 6 }}>
                                Description
                            </p>
                            <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>
                                {incident.description}
                            </p>
                        </div>

                        {/* Location */}
                        <div>
                            <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 6 }}>
                                Location
                            </p>
                            <p style={{ fontSize: 14, color: "#374151" }}>
                                {incident.address || `${incident.latitude.toFixed(6)}, ${incident.longitude.toFixed(6)}`}
                            </p>
                        </div>

                        {/* Photo */}
                        {incident.photoUrl && (
                            <div>
                                <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 6 }}>
                                    Photo
                                </p>
                                <img
                                    src={incident.photoUrl}
                                    alt="Incident photo"
                                    style={{ width: "100%", maxWidth: 400, borderRadius: 12, border: "1px solid #e5e7eb" }}
                                />
                            </div>
                        )}

                        {/* Metadata */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <div>
                                <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 6 }}>
                                    Reported At
                                </p>
                                <p style={{ fontSize: 13, color: "#374151" }}>
                                    {formatDate(incident.reportedAt)}
                                </p>
                            </div>
                            <div>
                                <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 6 }}>
                                    User ID
                                </p>
                                <p style={{ fontSize: 13, color: "#374151", fontFamily: "monospace" }}>
                                    {truncateId(incident.userId)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer - Status Update Actions */}
                {incident.status === "pending" && (
                    <div
                        style={{
                            display: "flex", justifyContent: "flex-end", gap: 10,
                            padding: "16px 24px", borderTop: "1px solid #f3f4f6",
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => onStatusUpdate("rejected")}
                            disabled={loading}
                            style={{
                                padding: "10px 18px", borderRadius: 11,
                                border: "1.5px solid #e5e7eb", background: "#fff",
                                fontSize: 13.5, fontWeight: 600, color: "#dc2626",
                                cursor: loading ? "not-allowed" : "pointer",
                                opacity: loading ? 0.5 : 1, transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) => { if (!loading) (e.currentTarget.style.borderColor = "#fecaca"); }}
                            onMouseLeave={(e) => { if (!loading) (e.currentTarget.style.borderColor = "#e5e7eb"); }}
                        >
                            {loading ? <><SpinnerIcon /> Rejecting…</> : "Reject"}
                        </button>
                        <button
                            type="button"
                            onClick={() => onStatusUpdate("verified")}
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
                            {loading ? <><SpinnerIcon /> Verifying…</> : <><CheckIcon /> Verify</>}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// Main Page
export default function AdminIncidentsPage() {
    const toast = useToast();
    const [incidents, setIncidents] = useState<AdminIncident[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<IncidentCategory | "all">("all");
    const [selectedStatus, setSelectedStatus] = useState<"all" | "pending" | "verified" | "rejected">("all");
    const [selectedIncident, setSelectedIncident] = useState<AdminIncident | null>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
    const lastRequestKeyRef = useRef<string | null>(null);

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            setSearchQuery(searchInput.trim());
        }, 450);

        return () => window.clearTimeout(timeout);
    }, [searchInput]);

    // Fetch incidents
    const fetchIncidents = useCallback(async (force = false) => {
        const requestKey = JSON.stringify({
            status: selectedStatus,
            category: selectedCategory,
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
            if (selectedCategory !== "all") filters.category = selectedCategory;
            if (searchQuery) filters.search = searchQuery;
            
            const response = await getAdminIncidents(1, 100, filters);
            if (response.success) {
                setIncidents(response.data);
            } else {
                setError(response.message || "Failed to fetch incidents");
            }
        } catch (err: any) {
            const message =
                err?.response?.status === 429
                    ? "Too many requests were sent to the server. Please wait a moment and try again."
                    : err?.message || "Failed to fetch incidents";
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [selectedStatus, selectedCategory, searchQuery]);

    useEffect(() => {
        fetchIncidents();
    }, [fetchIncidents]);

    // Handle status update
    const handleStatusUpdate = async (status: "verified" | "rejected") => {
        if (!selectedIncident) return;
        
        setStatusUpdateLoading(true);
        try {
            const response = await updateAdminIncident(selectedIncident._id, { status });
            
            if (response.success) {
                toast.showToast(`Incident ${status} successfully`, "success");
                setDetailModalOpen(false);
                fetchIncidents(true);
            } else {
                toast.showToast(response.message || "Failed to update incident status", "error");
            }
        } catch (err: any) {
            console.error("Status update error:", err);
            toast.showToast("Failed to update incident status", "error");
        } finally {
            setStatusUpdateLoading(false);
        }
    };

    // Open detail modal
    const openDetailModal = (incident: AdminIncident) => {
        setSelectedIncident(incident);
        setDetailModalOpen(true);
    };

    const categories: (IncidentCategory | "all")[] = [
        "all",
        "Harassment",
        "Road Accident",
        "Theft / Robbery",
        "Suspicious Activity",
        "Natural Disaster",
        "Fire Emergency",
        "Unsafe Infrastructure / Road Hazard",
        "Other",
    ];

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
                    Incident Management
                </h1>
                <p style={{ fontSize: 14, color: "#6b7280" }}>
                    View and manage all reported incidents across the platform.
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
                        Filter Incidents
                    </h3>
                    <p style={{ fontSize: 12, color: "#6b7280" }}>
                        Search by description or filter by category and status
                    </p>
                </div>
                
                <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-end" }}>
                    {/* Search */}
                    <div style={{ flex: "1 1 320px", minWidth: 260 }}>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                            Search by Description
                        </label>
                        <div style={{ position: "relative" }}>
                            <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", display: "flex", alignItems: "center", pointerEvents: "none" }}>
                                <SearchIcon />
                            </span>
                            <input
                                type="text"
                                placeholder="Type to search incident descriptions..."
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

                    {/* Category Filter */}
                    <div style={{ flex: "0 1 220px", minWidth: 200 }}>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                            Category
                        </label>
                        <div style={{ position: "relative" }}>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value as IncidentCategory | "all")}
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
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat === "all" ? "All Categories" : cat}
                                    </option>
                                ))}
                            </select>
                            <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#9ca3af" }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                            </div>
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
                                onChange={(e) => setSelectedStatus(e.target.value as "all" | "pending" | "verified" | "rejected")}
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
                                <option value="pending">Pending</option>
                                <option value="verified">Verified</option>
                                <option value="rejected">Rejected</option>
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
                            setSelectedCategory("all");
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

            {/* Incidents Table */}
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
                                {["ID", "Category", "Description", "Location", "Status", "Reported", "Actions"].map((h) => (
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
                            onClick={() => fetchIncidents(true)}
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
                ) : incidents.length === 0 ? (
                    <div style={{ padding: "64px 32px", textAlign: "center" }}>
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                            <IncidentEmptyIcon />
                        </div>
                        <p style={{ fontSize: 15, fontWeight: 600, color: "#0f172a", marginBottom: 6 }}>
                            No incidents found
                        </p>
                        <p style={{ fontSize: 13, color: "#6b7280" }}>
                            {searchQuery || selectedCategory !== "all" || selectedStatus !== "all"
                                ? "Try adjusting your filters"
                                : "No incidents have been reported yet"}
                        </p>
                    </div>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                                {["ID", "Category", "Description", "Location", "Status", "Reported", "Actions"].map((h) => (
                                    <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.7px" }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {incidents.map((incident) => (
                                <tr key={incident._id} style={{ borderBottom: "1px solid #f3f4f6", transition: "background 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#6b7280", fontFamily: "monospace" }}>
                                        {truncateId(incident._id)}
                                    </td>
                                    <td style={{ padding: "14px 16px" }}>
                                        <CategoryBadge category={incident.category} />
                                    </td>
                                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151", maxWidth: 250, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {incident.description}
                                    </td>
                                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#6b7280" }}>
                                        {incident.address || `${incident.latitude.toFixed(4)}, ${incident.longitude.toFixed(4)}`}
                                    </td>
                                    <td style={{ padding: "14px 16px" }}>
                                        <StatusBadge status={incident.status} />
                                    </td>
                                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#6b7280" }}>
                                        {formatDate(incident.reportedAt)}
                                    </td>
                                    <td style={{ padding: "14px 16px" }}>
                                        <button
                                            onClick={() => openDetailModal(incident)}
                                            style={{
                                                padding: "6px 12px",
                                                borderRadius: 8,
                                                border: "1px solid #e5e7eb",
                                                background: "#fff",
                                                color: "#374151",
                                                fontSize: 12,
                                                fontWeight: 600,
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 6,
                                                transition: "all 0.15s",
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#16a34a"; e.currentTarget.style.color = "#16a34a"; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#374151"; }}
                                        >
                                            <EyeIcon /> View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Detail Modal */}
            <IncidentDetailModal
                open={detailModalOpen}
                incident={selectedIncident}
                onClose={() => setDetailModalOpen(false)}
                onStatusUpdate={handleStatusUpdate}
                loading={statusUpdateLoading}
            />
        </div>
    );
}
