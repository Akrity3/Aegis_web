"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "../_components/ToastContext";
import ConfirmModal from "../_components/ConfirmModal";
import {
    getSafetyCircle,
    addToSafetyCircle,
    updateSafetyCircleStatus,
    removeFromSafetyCircle,
    type SafetyCircleMember,
} from "@/lib/api/safetyCircle";
import { getContacts, type Contact } from "@/lib/api/contact";

// ─────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────
function ShieldIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    );
}
function MapPinIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    );
}
function PlusIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    );
}
function TrashIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
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

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function formatDate(dateString?: string): string {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

function getStatusColor(status: string): { bg: string; border: string; text: string } {
    switch (status) {
        case "active":
            return { bg: "#f0fdf4", border: "#bbf7d0", text: "#166534" };
        case "inactive":
            return { bg: "#fef2f2", border: "#fecaca", text: "#991b1b" };
        default:
            return { bg: "#fffbeb", border: "#fde68a", text: "#92400e" };
    }
}

// ─────────────────────────────────────────────
// Member Card
// ─────────────────────────────────────────────
function MemberCard({
    member,
    onUpdateStatus,
    onRemove,
}: {
    member: SafetyCircleMember;
    onUpdateStatus: (id: string, status: "active" | "inactive" | "pending") => void;
    onRemove: (id: string) => void;
}) {
    const statusColors = getStatusColor(member.status);

    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 16,
                border: "1.5px solid #E5E7EB",
                padding: "18px 20px",
                boxShadow: "var(--shadow-sm)",
                transition: "all 0.15s",
            }}
        >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                        width: 42, height: 42, borderRadius: 12,
                        background: "#f0fdf4",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#16a34a",
                        fontSize: 18, fontWeight: 700,
                    }}>
                        {member.contactId.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0 }}>
                            {member.contactId.name}
                        </p>
                        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
                            {member.contactId.relation}
                        </p>
                    </div>
                </div>
                <span style={{
                    padding: "4px 10px", borderRadius: 999,
                    fontSize: 11, fontWeight: 700,
                    background: statusColors.bg,
                    color: statusColors.text,
                    border: `1px solid ${statusColors.border}`,
                    textTransform: "capitalize",
                }}>
                    {member.status}
                </span>
            </div>

            {/* Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "#9ca3af" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                    </span>
                    <span style={{ fontSize: 13, color: "#374151" }}>
                        {member.contactId.phoneNumber}
                    </span>
                </div>
                {member.lastLocation && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ color: "#9ca3af" }}><MapPinIcon /></span>
                        <span style={{ fontSize: 13, color: "#374151" }}>
                            {member.lastLocation.latitude.toFixed(6)}, {member.lastLocation.longitude.toFixed(6)}
                        </span>
                    </div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "#9ca3af" }}><ClockIcon /></span>
                    <span style={{ fontSize: 12, color: "#6b7280" }}>
                        Last seen: {formatDate(member.lastSeen)}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 8 }}>
                <select
                    value={member.status}
                    onChange={(e) => onUpdateStatus(member._id, e.target.value as "active" | "inactive" | "pending")}
                    style={{
                        flex: 1,
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: "1px solid #E5E7EB",
                        background: "#f9fafb",
                        fontSize: 12,
                        color: "#374151",
                        cursor: "pointer",
                    }}
                >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                </select>
                <button
                    onClick={() => onRemove(member._id)}
                    style={{
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: "1px solid #fecaca",
                        background: "#fef2f2",
                        color: "#dc2626",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = "#fee2e2";
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = "#fef2f2";
                    }}
                >
                    <TrashIcon /> Remove
                </button>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function SafetyCirclePage() {
    const { loading: authLoading } = useAuth();
    const { showToast } = useToast();

    const [members, setMembers] = useState<SafetyCircleMember[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedContactId, setSelectedContactId] = useState("");

    // Remove confirmation states
    const [removeOpen, setRemoveOpen] = useState(false);
    const [memberToRemove, setMemberToRemove] = useState<SafetyCircleMember | null>(null);
    const [removeLoading, setRemoveLoading] = useState(false);

    // Fetch safety circle and contacts
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [circleResponse, contactsResponse] = await Promise.all([
                getSafetyCircle(),
                getContacts(),
            ]);
            if (circleResponse.success) {
                setMembers(circleResponse.data);
            }
            if (contactsResponse.success) {
                setContacts(contactsResponse.data);
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            showToast(err?.response?.data?.message || err?.message || "Failed to fetch data", "error");
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
    }, [fetchData]);

    // Add to safety circle
    const handleAddToCircle = async () => {
        if (!selectedContactId) {
            showToast("Please select a contact", "error");
            return;
        }

        try {
            const response = await addToSafetyCircle(selectedContactId);
            if (response.success) {
                showToast("Contact added to safety circle", "success");
                setShowAddModal(false);
                setSelectedContactId("");
                fetchData();
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            showToast(err?.response?.data?.message || err?.message || "Failed to add contact", "error");
        }
    };

    // Update status
    const handleUpdateStatus = async (circleId: string, status: "active" | "inactive" | "pending") => {
        try {
            const response = await updateSafetyCircleStatus(circleId, status);
            if (response.success) {
                setMembers((prev) =>
                    prev.map((m) => (m._id === circleId ? { ...m, status } : m))
                );
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            showToast(err?.response?.data?.message || err?.message || "Failed to update status", "error");
        }
    };

    // Remove from safety circle
    const handleRemoveClick = (id: string) => {
        const member = members.find((m) => m._id === id);
        if (member) {
            setMemberToRemove(member);
            setRemoveOpen(true);
        }
    };

    // Confirm remove
    const handleRemoveConfirm = async () => {
        if (!memberToRemove) return;

        setRemoveLoading(true);
        try {
            const response = await removeFromSafetyCircle(memberToRemove._id);
            if (response.success) {
                showToast("Contact removed from safety circle", "success");
                setRemoveOpen(false);
                setMemberToRemove(null);
                setMembers((prev) => prev.filter((m) => m._id !== memberToRemove._id));
            } else {
                showToast(response.message || "Failed to remove contact", "error");
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            showToast(err?.response?.data?.message || err?.message || "Failed to remove contact", "error");
        } finally {
            setRemoveLoading(false);
        }
    };

    // Get contacts not in safety circle
    const availableContacts = contacts.filter(
        (contact) => !members.some((member) => member.contactId._id === contact._id)
    );

    if (authLoading || loading) {
        return (
            <div style={{ maxWidth: 700, margin: "0 auto" }}>
                <div style={{ background: "#fff", borderRadius: 22, border: "1px solid #E5E7EB", padding: 32, boxShadow: "var(--shadow-sm)" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="animate-shimmer"
                                style={{
                                    height: 120,
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
        <div style={{ maxWidth: 700, margin: "0 auto" }}>

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
                        background: "linear-gradient(135deg, #052e16 0%, #14532d 55%, #166534 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 16,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div
                            style={{
                                width: 48, height: 48, borderRadius: 14,
                                background: "rgba(22,163,74,0.18)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: "#4ade80",
                            }}
                        >
                            <ShieldIcon />
                        </div>
                        <div>
                            <h2 style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>
                                Safety Circle
                            </h2>
                            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
                                {members.length} member{members.length !== 1 ? "s" : ""}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        disabled={availableContacts.length === 0}
                        style={{
                            padding: "8px 16px",
                            borderRadius: 10,
                            border: "1px solid rgba(255,255,255,0.3)",
                            background: "rgba(255,255,255,0.1)",
                            color: "#fff",
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: availableContacts.length === 0 ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            opacity: availableContacts.length === 0 ? 0.5 : 1,
                            transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => {
                            if (availableContacts.length > 0) {
                                (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.2)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (availableContacts.length > 0) {
                                (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)";
                            }
                        }}
                    >
                        <PlusIcon /> Add Member
                    </button>
                </div>
            </div>

            {/* ── Members List ───────────────────── */}
            <div className="animate-fade-in-up anim-delay-100">
                {members.length === 0 ? (
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
                            <ShieldIcon />
                        </div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
                            No Safety Circle Members
                        </h3>
                        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>
                            Add your emergency contacts to your safety circle to track their safety.
                        </p>
                        {availableContacts.length === 0 && (
                            <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 0 }}>
                                Add emergency contacts first to build your safety circle.
                            </p>
                        )}
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {members.map((member) => (
                            <MemberCard
                                key={member._id}
                                member={member}
                                onUpdateStatus={handleUpdateStatus}
                                onRemove={handleRemoveClick}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ── Add Modal ───────────────────────── */}
            {showAddModal && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                        padding: 20,
                    }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setShowAddModal(false);
                    }}
                >
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 20,
                            padding: "24px",
                            width: "100%",
                            maxWidth: 400,
                            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                        }}
                    >
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>
                            Add to Safety Circle
                        </h3>
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                                Select Contact
                            </label>
                            <select
                                value={selectedContactId}
                                onChange={(e) => setSelectedContactId(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "10px 14px",
                                    borderRadius: 10,
                                    border: "1.5px solid #E5E7EB",
                                    background: "#f9fafb",
                                    fontSize: 14,
                                    color: "#0f172a",
                                    cursor: "pointer",
                                }}
                            >
                                <option value="">Choose a contact</option>
                                {availableContacts.map((contact) => (
                                    <option key={contact._id} value={contact._id}>
                                        {contact.name} ({contact.relation})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setSelectedContactId("");
                                }}
                                style={{
                                    padding: "10px 20px",
                                    borderRadius: 10,
                                    border: "1px solid #E5E7EB",
                                    background: "#fff",
                                    color: "#374151",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddToCircle}
                                disabled={!selectedContactId}
                                style={{
                                    padding: "10px 20px",
                                    borderRadius: 10,
                                    border: "none",
                                    background: "#16a34a",
                                    color: "#fff",
                                    fontSize: 13,
                                    fontWeight: 700,
                                    cursor: !selectedContactId ? "not-allowed" : "pointer",
                                    opacity: !selectedContactId ? 0.5 : 1,
                                }}
                            >
                                Add Member
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Remove Confirmation ───────────────── */}
            <ConfirmModal
                open={removeOpen}
                title="Remove from Safety Circle?"
                message={`Are you sure you want to remove ${memberToRemove?.contactId.name} from your safety circle? They will no longer receive emergency alerts.`}
                confirmLabel="Remove"
                confirmingLabel="Removing…"
                loading={removeLoading}
                onConfirm={handleRemoveConfirm}
                onCancel={() => {
                    if (!removeLoading) {
                        setRemoveOpen(false);
                        setMemberToRemove(null);
                    }
                }}
            />
        </div>
    );
}
