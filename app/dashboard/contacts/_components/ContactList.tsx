"use client";

import { Contact } from "@/lib/api/contact";

// ─────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────
function PhoneIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
    );
}
function UserIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}
function EditIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    );
}
function TrashIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
    );
}
function StarIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
}

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────
interface ContactListProps {
    contacts: Contact[];
    onEdit: (contact: Contact) => void;
    onDelete: (contact: Contact) => void;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export default function ContactList({ contacts, onEdit, onDelete }: ContactListProps) {
    if (contacts.length === 0) {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "60px 20px",
                    background: "#fff",
                    borderRadius: 20,
                    border: "1px solid #e5e7eb",
                    boxShadow: "var(--shadow-sm)",
                }}
            >
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#f9fafb", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>No Emergency Contacts</h3>
                <p style={{ fontSize: 13, color: "#6b7280", textAlign: "center", maxWidth: 280 }}>
                    Add trusted contacts who will be notified in case of an emergency.
                </p>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {contacts.map((contact) => (
                <div
                    key={contact._id}
                    className="animate-fade-in-up"
                    style={{
                        background: "#fff",
                        borderRadius: 16,
                        border: "1px solid #e5e7eb",
                        padding: "18px 20px",
                        boxShadow: "var(--shadow-sm)",
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        transition: "all 0.15s",
                    }}
                >
                    {/* Avatar */}
                    <div
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
                            border: "2px solid #fff",
                            boxShadow: "var(--shadow-sm)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 18,
                            fontWeight: 800,
                            color: "#16a34a",
                            flexShrink: 0,
                        }}
                    >
                        {contact.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Contact Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                            <h4 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0 }}>
                                {contact.name}
                            </h4>
                            {contact.isPrimary && (
                                <span
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 4,
                                        padding: "2px 8px",
                                        borderRadius: 999,
                                        fontSize: 10.5,
                                        fontWeight: 700,
                                        background: "#fef3c7",
                                        color: "#d97706",
                                        border: "1px solid #fde68a",
                                    }}
                                >
                                    <StarIcon /> Primary
                                </span>
                            )}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                            <span style={{ color: "#9ca3af", display: "flex", alignItems: "center" }}>
                                <PhoneIcon />
                            </span>
                            <p style={{ fontSize: 13, fontWeight: 500, color: "#374151", margin: 0 }}>
                                {contact.phoneNumber}
                            </p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ color: "#9ca3af", display: "flex", alignItems: "center" }}>
                                <UserIcon />
                            </span>
                            <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
                                {contact.relation || "Not specified"}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 8 }}>
                        <button
                            onClick={() => onEdit(contact)}
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 10,
                                border: "1px solid #e5e7eb",
                                background: "#fff",
                                color: "#6b7280",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.borderColor = "#16a34a";
                                (e.currentTarget as HTMLButtonElement).style.color = "#16a34a";
                                (e.currentTarget as HTMLButtonElement).style.background = "#f0fdf4";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e7eb";
                                (e.currentTarget as HTMLButtonElement).style.color = "#6b7280";
                                (e.currentTarget as HTMLButtonElement).style.background = "#fff";
                            }}
                            aria-label="Edit contact"
                        >
                            <EditIcon />
                        </button>
                        <button
                            onClick={() => onDelete(contact)}
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 10,
                                border: "1px solid #e5e7eb",
                                background: "#fff",
                                color: "#6b7280",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.borderColor = "#dc2626";
                                (e.currentTarget as HTMLButtonElement).style.color = "#dc2626";
                                (e.currentTarget as HTMLButtonElement).style.background = "#fef2f2";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e7eb";
                                (e.currentTarget as HTMLButtonElement).style.color = "#6b7280";
                                (e.currentTarget as HTMLButtonElement).style.background = "#fff";
                            }}
                            aria-label="Delete contact"
                        >
                            <TrashIcon />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
