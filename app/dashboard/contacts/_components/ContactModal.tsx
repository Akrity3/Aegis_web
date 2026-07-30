"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Contact } from "@/lib/api/contact";

// ─────────────────────────────────────────────
// Schema
// ─────────────────────────────────────────────
const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
    phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must contain 10 digits"),
    relation: z.string().optional(),
    isPrimary: z.boolean().optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

// ─────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────
function XIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}
function SpinnerIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="animate-spin">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    );
}

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────
interface ContactModalProps {
    open: boolean;
    mode: "add" | "edit";
    initialData?: Contact | null;
    onClose: () => void;
    onSave: (data: ContactFormValues) => void;
    loading: boolean;
    serverError?: string;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export default function ContactModal({
    open,
    mode,
    initialData,
    onClose,
    onSave,
    loading,
    serverError,
}: ContactModalProps) {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: "",
            phoneNumber: "",
            relation: "Family",
            isPrimary: false,
        },
    });

    // Populate form when editing
    useEffect(() => {
        if (open) {
            if (mode === "edit" && initialData) {
                reset({
                    name: initialData.name,
                    phoneNumber: initialData.phoneNumber,
                    relation: initialData.relation || "Family",
                    isPrimary: initialData.isPrimary,
                });
            } else {
                reset({
                    name: "",
                    phoneNumber: "",
                    relation: "Family",
                    isPrimary: false,
                });
            }
        }
    }, [open, mode, initialData, reset]);

    // Lock scroll and handle Escape
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

    if (!open) return null;

    const onSubmit = (data: ContactFormValues) => {
        onSave(data);
    };

    const isAdd = mode === "add";

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
                    width: "100%", maxWidth: 520,
                    maxHeight: "90vh", overflowY: "auto",
                }}
            >
                {/* Modal header */}
                <div
                    style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "22px 24px", borderBottom: "1px solid #f3f4f6",
                    }}
                >
                    <div>
                        <h2 style={{ fontSize: 17, fontWeight: 800, color: "#0f172a" }}>
                            {isAdd ? "Add Emergency Contact" : "Edit Contact"}
                        </h2>
                        <p style={{ fontSize: 13, color: "#6b7280", marginTop: 3 }}>
                            {isAdd
                                ? "Add a trusted contact who will be notified in emergencies."
                                : "Update the contact information below."}
                        </p>
                    </div>
                    {!loading && (
                        <button
                            type="button"
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

                {/* Server error */}
                {serverError && (
                    <div
                        style={{
                            margin: "16px 24px 0",
                            padding: "12px 14px",
                            borderRadius: 10,
                            background: "#fef2f2",
                            border: "1px solid #fecaca",
                            fontSize: 13,
                            color: "#991b1b",
                        }}
                    >
                        {serverError}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div
                        style={{
                            padding: "20px 24px",
                            display: "flex",
                            flexDirection: "column",
                            gap: 16,
                        }}
                    >
                        {/* Name */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                                Contact Name <span style={{ color: "#dc2626" }}>*</span>
                            </label>
                            <input
                                type="text"
                                {...register("name")}
                                placeholder="e.g., Kriti Shah"
                                disabled={loading}
                                style={{
                                    width: "100%",
                                    padding: "10px 14px",
                                    borderRadius: 10,
                                    border: `1.5px solid ${errors.name ? "#fca5a5" : "#e5e7eb"}`,
                                    fontSize: 13.5,
                                    color: "#0f172a",
                                    background: "#fff",
                                    outline: "none",
                                    transition: "border-color 0.15s",
                                }}
                                onFocus={(e) => { if (!errors.name) (e.target as HTMLInputElement).style.borderColor = "#16a34a"; }}
                                onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = errors.name ? "#fca5a5" : "#e5e7eb"; }}
                            />
                            {errors.name && (
                                <p style={{ fontSize: 12, color: "#dc2626", marginTop: 2 }}>{errors.name.message}</p>
                            )}
                        </div>

                        {/* Phone Number */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                                Phone Number <span style={{ color: "#dc2626" }}>*</span>
                            </label>
                            <input
                                type="tel"
                                {...register("phoneNumber")}
                                placeholder="+977 98XXXXXXXX"
                                disabled={loading}
                                style={{
                                    width: "100%",
                                    padding: "10px 14px",
                                    borderRadius: 10,
                                    border: `1.5px solid ${errors.phoneNumber ? "#fca5a5" : "#e5e7eb"}`,
                                    fontSize: 13.5,
                                    color: "#0f172a",
                                    background: "#fff",
                                    outline: "none",
                                    transition: "border-color 0.15s",
                                }}
                                onFocus={(e) => { if (!errors.phoneNumber) (e.target as HTMLInputElement).style.borderColor = "#16a34a"; }}
                                onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = errors.phoneNumber ? "#fca5a5" : "#e5e7eb"; }}
                            />
                            {errors.phoneNumber && (
                                <p style={{ fontSize: 12, color: "#dc2626", marginTop: 2 }}>{errors.phoneNumber.message}</p>
                            )}
                        </div>

                        {/* Relation */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                                Relationship
                            </label>
                            <div style={{ position: "relative" }}>
                                <select
                                    {...register("relation")}
                                    disabled={loading}
                                    style={{
                                        width: "100%",
                                        padding: "10px 14px",
                                        borderRadius: 10,
                                        border: "1.5px solid #e5e7eb",
                                        fontSize: 13.5,
                                        color: "#0f172a",
                                        background: "#fff",
                                        outline: "none",
                                        appearance: "none",
                                        cursor: "pointer",
                                        transition: "border-color 0.15s",
                                    }}
                                    onFocus={(e) => { (e.target as HTMLSelectElement).style.borderColor = "#16a34a"; }}
                                    onBlur={(e) => { (e.target as HTMLSelectElement).style.borderColor = "#e5e7eb"; }}
                                >
                                    <option value="Family">Family</option>
                                    <option value="Friend">Friend</option>
                                    <option value="Spouse">Spouse</option>
                                    <option value="Parent">Parent</option>
                                    <option value="Sibling">Sibling</option>
                                    <option value="Colleague">Colleague</option>
                                    <option value="Other">Other</option>
                                </select>
                                <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#9ca3af" }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                                </div>
                            </div>
                        </div>

                        {/* Primary Contact Checkbox */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 10, background: "#f9fafb", border: "1px solid #e5e7eb" }}>
                            <input
                                type="checkbox"
                                id="isPrimary"
                                {...register("isPrimary")}
                                disabled={loading}
                                style={{
                                    width: 18, height: 18,
                                    accentColor: "#16a34a",
                                    cursor: loading ? "not-allowed" : "pointer",
                                }}
                            />
                            <label htmlFor="isPrimary" style={{ fontSize: 13, fontWeight: 500, color: "#374151", cursor: loading ? "not-allowed" : "pointer" }}>
                                Mark as primary emergency contact
                            </label>
                        </div>
                    </div>

                    {/* Footer */}
                    <div
                        style={{
                            display: "flex", justifyContent: "flex-end", gap: 10,
                            padding: "16px 24px", borderTop: "1px solid #f3f4f6",
                        }}
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            style={{
                                padding: "10px 18px", borderRadius: 11,
                                border: "1.5px solid #e5e7eb", background: "#fff",
                                fontSize: 13.5, fontWeight: 600, color: "#374151",
                                cursor: loading ? "not-allowed" : "pointer",
                                opacity: loading ? 0.5 : 1,
                                transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) => { if (!loading) (e.currentTarget.style.borderColor = "#d1d5db"); }}
                            onMouseLeave={(e) => { if (!loading) (e.currentTarget.style.borderColor = "#e5e7eb"); }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: "10px 22px", borderRadius: 11, border: "none",
                                background: "#16a34a", color: "#fff",
                                fontSize: 13.5, fontWeight: 700,
                                cursor: loading ? "not-allowed" : "pointer",
                                display: "flex", alignItems: "center", gap: 8,
                                boxShadow: "var(--shadow-green)",
                                opacity: loading ? 0.85 : 1,
                                transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) => { if (!loading) (e.currentTarget.style.background = "#15803d"); }}
                            onMouseLeave={(e) => { if (!loading) (e.currentTarget.style.background = "#16a34a"); }}
                        >
                            {loading ? (
                                <><SpinnerIcon /> {isAdd ? "Adding…" : "Saving…"}</>
                            ) : (
                                isAdd ? "Add Contact" : "Save Changes"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
