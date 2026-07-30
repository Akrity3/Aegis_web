"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "../_components/ToastContext";
import ConfirmModal from "../_components/ConfirmModal";
import { Alert, getMyAlerts, triggerAlert, resolveAlert } from "@/lib/api/alert";
import AlertList from "./_components/AlertList";
import AlertModal from "./_components/AlertModal";

// ─────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────
function ShieldAlertIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l7 4v5c0 5.25-3.5 9.74-7 11-3.5-1.26-7-5.75-7-11V6l7-4z" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
        </svg>
    );
}
function PlusIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function EmergencyAlertsPage() {
    const { loading: authLoading } = useAuth();
    const { showToast } = useToast();

    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeAlert, setActiveAlert] = useState<Alert | null>(null);

    // Modal states
    const [modalOpen, setModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [modalError, setModalError] = useState<string | undefined>();

    // SOS trigger confirmation state
    const [triggerConfirmOpen, setTriggerConfirmOpen] = useState(false);

    // Delete confirmation states
    const [resolveOpen, setResolveOpen] = useState(false);
    const [alertToResolve, setAlertToResolve] = useState<Alert | null>(null);
    const [resolveLoading, setResolveLoading] = useState(false);

    // Fetch alerts
    const fetchAlerts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getMyAlerts();
            if (response.success) {
                setAlerts(response.data);
                // Track active alert
                const active = response.data.find((a) => a.status === "active");
                setActiveAlert(active || null);
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            showToast(err?.response?.data?.message || err?.message || "Failed to fetch alerts", "error");
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchAlerts();
    }, [fetchAlerts]);

    // Open trigger confirmation
    const handleTrigger = () => {
        setTriggerConfirmOpen(true);
    };

    // Confirm trigger and open modal
    const handleTriggerConfirm = () => {
        setTriggerConfirmOpen(false);
        setModalError(undefined);
        setModalOpen(true);
    };

    // Handle modal save (trigger alert)
    const handleModalSave = async (data: { latitude: number; longitude: number; address?: string }) => {
        setModalLoading(true);
        setModalError(undefined);

        try {
            const response = await triggerAlert(data);
            if (response.success) {
                showToast("SOS alert triggered successfully!", "success");
                setModalOpen(false);
                await fetchAlerts();
            } else {
                setModalError("Failed to trigger alert");
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            setModalError(err?.response?.data?.message || err?.message || "An error occurred");
        } finally {
            setModalLoading(false);
        }
    };

    // Handle resolve click
    const handleResolveClick = (alert: Alert) => {
        setAlertToResolve(alert);
        setResolveOpen(true);
    };

    // Confirm resolve
    const handleResolveConfirm = async () => {
        if (!alertToResolve) return;

        setResolveLoading(true);
        try {
            const response = await resolveAlert(alertToResolve._id);
            if (response.success) {
                showToast("Alert resolved successfully!", "success");
                setResolveOpen(false);
                setAlertToResolve(null);
                await fetchAlerts();
            } else {
                showToast(response.message || "Failed to resolve alert", "error");
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            showToast(err?.response?.data?.message || err?.message || "Failed to resolve alert", "error");
        } finally {
            setResolveLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div style={{ maxWidth: 800, margin: "0 auto" }}>
                <div style={{ background: "#fff", borderRadius: 22, border: "1px solid #E5E7EB", padding: 32, boxShadow: "var(--shadow-sm)" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="animate-shimmer"
                                style={{
                                    height: 80,
                                    borderRadius: 16,
                                    background: "#f9fafb",
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 800, margin: "0 auto" }}>

            {/* ── Header Card ──────────────────────── */}
            <div
                className="animate-fade-in-up"
                style={{
                    background: "#fff",
                    borderRadius: 22,
                    border: "1px solid #E5E7EB",
                    overflow: "hidden",
                    marginBottom: 20,
                    boxShadow: "var(--shadow-sm)",
                }}
            >
                <div
                    style={{
                        padding: "22px 26px",
                        background: activeAlert
                            ? "linear-gradient(135deg, #dc2626 0%, #b91c1c 55%, #991b1b 100%)"
                            : "linear-gradient(135deg, #052e16 0%, #14532d 55%, #166534 100%)",
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                    }}
                >
                    <div
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 14,
                            background: activeAlert ? "rgba(255,255,255,0.18)" : "rgba(22,163,74,0.18)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: activeAlert ? "#fff" : "#4ade80",
                        }}
                    >
                        <ShieldAlertIcon />
                    </div>
                    <div>
                        <h2 style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>
                            Emergency Alerts
                        </h2>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
                            {activeAlert ? "Active SOS Alert - Take Action" : "Manage your emergency alerts"}
                        </p>
                    </div>
                </div>

                {/* Stats row */}
                <div
                    style={{
                        padding: "14px 26px",
                        background: "#f9fafb",
                        borderBottom: "1px solid #E5E7EB",
                        display: "flex",
                        gap: 20,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ color: activeAlert ? "#dc2626" : "#16a34a" }}>
                            <ShieldAlertIcon />
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>
                            {activeAlert ? "1 Active Alert" : "No Active Alerts"}
                        </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>
                            {alerts.length} Total Alert{alerts.length !== 1 ? "s" : ""}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Actions Bar ─────────────────────── */}
            <div
                className="animate-fade-in-up anim-delay-100"
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: 18,
                }}
            >
                <button
                    onClick={handleTrigger}
                    disabled={!!activeAlert}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "10px 18px",
                        borderRadius: 12,
                        border: "none",
                        background: activeAlert ? "#9ca3af" : "#dc2626",
                        color: "#fff",
                        fontSize: 13.5,
                        fontWeight: 700,
                        cursor: activeAlert ? "not-allowed" : "pointer",
                        boxShadow: activeAlert ? "none" : "0 4px 12px rgba(220,38,38,0.25)",
                        transition: "all 0.15s",
                        opacity: activeAlert ? 0.7 : 1,
                    }}
                    onMouseEnter={(e) => {
                        if (!activeAlert) (e.currentTarget.style.background = "#b91c1c");
                    }}
                    onMouseLeave={(e) => {
                        if (!activeAlert) (e.currentTarget.style.background = "#dc2626");
                    }}
                >
                    <ShieldAlertIcon /> {activeAlert ? "SOS Active" : "Trigger SOS"}
                </button>
            </div>

            {/* ── Alert List ─────────────────────── */}
            <div className="animate-fade-in-up anim-delay-200">
                <AlertList
                    alerts={alerts}
                    onResolve={handleResolveClick}
                />
            </div>

            {/* ── Alert Modal ─────────────────────── */}
            <AlertModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleModalSave}
                loading={modalLoading}
                serverError={modalError}
            />

            {/* ── Resolve Confirmation ────────────── */}
            <ConfirmModal
                open={resolveOpen}
                title="Resolve Alert"
                message="Are you sure you want to resolve this SOS alert? This will mark the emergency as resolved."
                confirmLabel="Resolve"
                confirmingLabel="Resolving…"
                loading={resolveLoading}
                onConfirm={handleResolveConfirm}
                onCancel={() => {
                    if (!resolveLoading) {
                        setResolveOpen(false);
                        setAlertToResolve(null);
                    }
                }}
            />

            {/* ── SOS Trigger Confirmation ─────────── */}
            <ConfirmModal
                open={triggerConfirmOpen}
                title="Trigger SOS Alert?"
                message="Are you sure you want to trigger an emergency SOS alert? This will immediately notify your safety circle and may contact emergency services. Only use in genuine emergencies."
                confirmLabel="Continue to SOS"
                confirmingLabel="Proceeding…"
                onConfirm={handleTriggerConfirm}
                onCancel={() => setTriggerConfirmOpen(false)}
                loading={false}
            />
        </div>
    );
}
