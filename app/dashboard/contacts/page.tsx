"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "../_components/ToastContext";
import ConfirmModal from "../_components/ConfirmModal";
import { Contact, getContacts, addContact, updateContact, deleteContact } from "@/lib/api/contact";
import ContactList from "./_components/ContactList";
import ContactModal from "./_components/ContactModal";

// ─────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────
function PlusIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    );
}
function SearchIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    );
}
function ShieldIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l7 4v5c0 5.25-3.5 9.74-7 11-3.5-1.26-7-5.75-7-11V6l7-4z" />
        </svg>
    );
}
function UsersIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function EmergencyContactsPage() {
    const { loading: authLoading } = useAuth();
    const { showToast } = useToast();

    const [contacts, setContacts] = useState<Contact[]>([]);
    const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal states
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [modalError, setModalError] = useState<string | undefined>();

    // Delete confirmation states
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Fetch contacts
    const fetchContacts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getContacts();
            if (response.success) {
                setContacts(response.data);
                setFilteredContacts(response.data);
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            showToast(err?.response?.data?.message || err?.message || "Failed to fetch contacts", "error");
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    // Search filter
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredContacts(contacts);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = contacts.filter(
                (contact) =>
                    contact.name.toLowerCase().includes(query) ||
                    contact.phoneNumber.includes(query) ||
                    contact.relation.toLowerCase().includes(query)
            );
            setFilteredContacts(filtered);
        }
    }, [searchQuery, contacts]);

    // Open add modal
    const handleAdd = () => {
        setModalMode("add");
        setSelectedContact(null);
        setModalError(undefined);
        setModalOpen(true);
    };

    // Open edit modal
    const handleEdit = (contact: Contact) => {
        setModalMode("edit");
        setSelectedContact(contact);
        setModalError(undefined);
        setModalOpen(true);
    };

    // Handle modal save
    const handleModalSave = async (data: any) => {
        setModalLoading(true);
        setModalError(undefined);

        try {
            if (modalMode === "add") {
                const response = await addContact(data);
                if (response.success) {
                    showToast("Contact added successfully!", "success");
                    setModalOpen(false);
                    await fetchContacts();
                } else {
                    setModalError("Failed to add contact");
                }
            } else {
                const response = await updateContact(selectedContact!._id, data);
                if (response.success) {
                    showToast("Contact updated successfully!", "success");
                    setModalOpen(false);
                    await fetchContacts();
                } else {
                    setModalError("Failed to update contact");
                }
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            setModalError(err?.response?.data?.message || err?.message || "An error occurred");
        } finally {
            setModalLoading(false);
        }
    };

    // Handle delete click
    const handleDeleteClick = (contact: Contact) => {
        setContactToDelete(contact);
        setDeleteOpen(true);
    };

    // Confirm delete
    const handleDeleteConfirm = async () => {
        if (!contactToDelete) return;

        setDeleteLoading(true);
        try {
            const response = await deleteContact(contactToDelete._id);
            if (response.success) {
                showToast("Contact deleted successfully!", "success");
                setDeleteOpen(false);
                setContactToDelete(null);
                await fetchContacts();
            } else {
                showToast(response.message || "Failed to delete contact", "error");
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            showToast(err?.response?.data?.message || err?.message || "Failed to delete contact", "error");
        } finally {
            setDeleteLoading(false);
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
                        background: "linear-gradient(135deg, #052e16 0%, #14532d 55%, #166534 100%)",
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
                            background: "rgba(22,163,74,0.18)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#4ade80",
                        }}
                    >
                        <UsersIcon />
                    </div>
                    <div>
                        <h2 style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>Emergency Contacts</h2>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
                            Manage trusted contacts for emergency notifications
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
                        <span style={{ color: "#16a34a", display: "flex", alignItems: "center" }}>
                            <ShieldIcon />
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>
                            {contacts.length} Contact{contacts.length !== 1 ? "s" : ""}
                        </span>
                    </div>
                    {contacts.some((c) => c.isPrimary) && (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="#d97706" stroke="none">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                            <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>
                                Primary contact set
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Actions Bar ─────────────────────── */}
            <div
                className="animate-fade-in-up anim-delay-100"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 18,
                    flexWrap: "wrap",
                    gap: 12,
                }}
            >
                {/* Search */}
                <div style={{ position: "relative", flex: 1, minWidth: 200, maxWidth: 320 }}>
                    <input
                        type="text"
                        placeholder="Search contacts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px 14px 10px 38px",
                            borderRadius: 12,
                            border: "1.5px solid #E5E7EB",
                            fontSize: 13.5,
                            color: "#0f172a",
                            background: "#fff",
                            outline: "none",
                            transition: "all 0.15s",
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = "#16a34a";
                            e.target.style.background = "#fff";
                            e.target.style.boxShadow = "0 0 0 3px rgba(22,163,74,0.1)";
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = "#E5E7EB";
                            e.target.style.background = "#fff";
                            e.target.style.boxShadow = "none";
                        }}
                    />
                    <span
                        style={{
                            position: "absolute",
                            left: 12,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#9ca3af",
                            pointerEvents: "none",
                        }}
                    >
                        <SearchIcon />
                    </span>
                </div>

                {/* Add Button */}
                <button
                    onClick={handleAdd}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "10px 18px",
                        borderRadius: 12,
                        border: "none",
                        background: "#16a34a",
                        color: "#fff",
                        fontSize: 13.5,
                        fontWeight: 700,
                        cursor: "pointer",
                        boxShadow: "var(--shadow-green)",
                        transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#15803d")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#16a34a")}
                >
                    <PlusIcon /> Add Contact
                </button>
            </div>

            {/* ── Contact List ─────────────────────── */}
            <div className="animate-fade-in-up anim-delay-200">
                <ContactList
                    contacts={filteredContacts}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                />
            </div>

            {/* ── Contact Modal ────────────────────── */}
            <ContactModal
                open={modalOpen}
                mode={modalMode}
                initialData={selectedContact}
                onClose={() => setModalOpen(false)}
                onSave={handleModalSave}
                loading={modalLoading}
                serverError={modalError}
            />

            {/* ── Delete Confirmation ───────────────── */}
            <ConfirmModal
                open={deleteOpen}
                title="Delete Contact"
                message={`Are you sure you want to permanently delete ${contactToDelete?.name}? This action cannot be undone.`}
                confirmLabel="Delete"
                confirmingLabel="Deleting…"
                loading={deleteLoading}
                onConfirm={handleDeleteConfirm}
                onCancel={() => {
                    if (!deleteLoading) {
                        setDeleteOpen(false);
                        setContactToDelete(null);
                    }
                }}
            />
        </div>
    );
}
