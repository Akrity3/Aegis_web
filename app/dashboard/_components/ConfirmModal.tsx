"use client";

import { useEffect } from "react";

// ─────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────
function SaveIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
        </svg>
    );
}
function XIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}
function SpinnerIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="animate-spin">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    );
}
function InfoIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    );
}

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────
export interface ChangeItem {
    label: string;
    from?: string;
    to: string;
}

interface ConfirmModalProps {
    open: boolean;
    title?: string;
    message?: string;
    changes?: ChangeItem[];
    confirmLabel?: string;
    confirmingLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export default function ConfirmModal({
    open,
    title = "Save Changes?",
    message = "Review your changes below before confirming.",
    changes = [],
    confirmLabel = "Save Changes",
    confirmingLabel = "Saving…",
    onConfirm,
    onCancel,
    loading = false,
}: ConfirmModalProps) {

    // Lock body scroll while modal is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    // Close on Escape key
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape" && open && !loading) onCancel();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [open, loading, onCancel]);

    if (!open) return null;

    return (
        /* Overlay */
        <div
            onClick={() => { if (!loading) onCancel(); }}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 9000,
                background: "rgba(15,23,42,0.45)",
                backdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
            }}
        >
            {/* Modal card */}
            <div
                className="animate-scale-in"
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: "#fff",
                    borderRadius: 22,
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 24px 60px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.08)",
                    width: "100%",
                    maxWidth: 460,
                    overflow: "hidden",
                }}
            >
                {/* Header */}
                <div style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 14,
                    padding: "22px 24px 0",
                }}>
                    {/* Icon */}
                    <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#16a34a",
                        flexShrink: 0,
                    }}>
                        <InfoIcon />
                    </div>

                    <div style={{ flex: 1 }}>
                        <h2 style={{
                            fontSize: 17,
                            fontWeight: 800,
                            color: "#0f172a",
                            marginBottom: 4,
                        }}>
                            {title}
                        </h2>
                        <p style={{ fontSize: 13.5, color: "#6b7280", lineHeight: 1.55 }}>
                            {message}
                        </p>
                    </div>

                    {/* Close X */}
                    {!loading && (
                        <button
                            onClick={onCancel}
                            aria-label="Close"
                            style={{
                                width: 30,
                                height: 30,
                                borderRadius: 8,
                                border: "none",
                                background: "transparent",
                                cursor: "pointer",
                                color: "#9ca3af",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                transition: "background 0.15s, color 0.15s",
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

                {/* Changes list */}
                {changes.length > 0 && (
                    <div style={{ padding: "18px 24px 0" }}>
                        <p style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#9ca3af",
                            textTransform: "uppercase",
                            letterSpacing: "0.9px",
                            marginBottom: 10,
                        }}>
                            Changes to be saved
                        </p>
                        <div style={{
                            background: "#f9fafb",
                            border: "1px solid #E5E7EB",
                            borderRadius: 12,
                            overflow: "hidden",
                        }}>
                            {changes.map((item, i) => (
                                <div
                                    key={i}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: 12,
                                        padding: "11px 14px",
                                        borderBottom: i < changes.length - 1 ? "1px solid #f3f4f6" : "none",
                                    }}
                                >
                                    <span style={{ fontSize: 12.5, fontWeight: 600, color: "#374151" }}>
                                        {item.label}
                                    </span>

                                    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                                        {item.from && (
                                            <>
                                                <span style={{
                                                    fontSize: 12,
                                                    color: "#9ca3af",
                                                    textDecoration: "line-through",
                                                    maxWidth: 90,
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                }}>
                                                    {item.from}
                                                </span>
                                                {/* Arrow */}
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <line x1="5" y1="12" x2="19" y2="12" />
                                                    <polyline points="12 5 19 12 12 19" />
                                                </svg>
                                            </>
                                        )}
                                        <span style={{
                                            fontSize: 12.5,
                                            fontWeight: 600,
                                            color: "#16a34a",
                                            maxWidth: 120,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}>
                                            {item.to}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer actions */}
                <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 10,
                    padding: "20px 24px",
                }}>
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        style={{
                            padding: "10px 18px",
                            borderRadius: 11,
                            border: "1.5px solid #E5E7EB",
                            background: "#fff",
                            fontSize: 13.5,
                            fontWeight: 600,
                            color: "#374151",
                            cursor: loading ? "not-allowed" : "pointer",
                            opacity: loading ? 0.5 : 1,
                            transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => { if (!loading) (e.currentTarget.style.borderColor = "#d1d5db"); }}
                        onMouseLeave={(e) => { if (!loading) (e.currentTarget.style.borderColor = "#E5E7EB"); }}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        style={{
                            padding: "10px 20px",
                            borderRadius: 11,
                            border: "none",
                            background: "#16a34a",
                            color: "#fff",
                            fontSize: 13.5,
                            fontWeight: 700,
                            cursor: loading ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            boxShadow: "var(--shadow-green)",
                            opacity: loading ? 0.85 : 1,
                            transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => { if (!loading) (e.currentTarget.style.background = "#15803d"); }}
                        onMouseLeave={(e) => { if (!loading) (e.currentTarget.style.background = "#16a34a"); }}
                    >
                        {loading ? <><SpinnerIcon /> {confirmingLabel}</> : <><SaveIcon /> {confirmLabel}</>}
                    </button>
                </div>
            </div>
        </div>
    );
}
