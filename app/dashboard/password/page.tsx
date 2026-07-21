"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/lib/api/axios-instance";
import { useToast } from "../_components/ToastContext";
import { SkeletonForm } from "../_components/SkeletonLoader";

// ─────────────────────────────────────────────
// Schema
// ─────────────────────────────────────────────
const passwordSchema = z
    .object({
        currentPassword:    z.string().min(1, "Current password is required"),
        newPassword:        z.string()
            .min(8,   "Password must be at least 8 characters")
            .regex(/[A-Z]/,         "Must contain at least one uppercase letter")
            .regex(/[^a-zA-Z0-9]/, "Must contain at least one special character"),
        confirmNewPassword: z.string().min(1, "Please confirm your new password"),
    })
    .refine((d) => d.newPassword === d.confirmNewPassword, {
        message: "Passwords do not match",
        path: ["confirmNewPassword"],
    });

type PasswordFormValues = z.infer<typeof passwordSchema>;

// ─────────────────────────────────────────────
// Password Strength
// ─────────────────────────────────────────────
interface Strength { score: number; label: string; color: string; bg: string; }

function getStrength(pwd: string): Strength {
    let score = 0;
    if (pwd.length >= 8)           score++;
    if (pwd.length >= 12)          score++;
    if (/[A-Z]/.test(pwd))        score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;
    const levels: Strength[] = [
        { score: 0, label: "Too weak",    color: "#ef4444", bg: "#fef2f2" },
        { score: 1, label: "Weak",        color: "#f59e0b", bg: "#fffbeb" },
        { score: 2, label: "Fair",        color: "#eab308", bg: "#fefce8" },
        { score: 3, label: "Strong",      color: "#22c55e", bg: "#f0fdf4" },
        { score: 4, label: "Very strong", color: "#16a34a", bg: "#dcfce7" },
    ];
    return levels[score];
}

// ─────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────
function EyeIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
        </svg>
    );
}
function EyeOffIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    );
}
function CheckIcon() {
    return (
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}
function CheckCircleIcon() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    );
}
function XCircleIcon() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
        </svg>
    );
}
function ShieldIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l7 4v5c0 5.25-3.5 9.74-7 11-3.5-1.26-7-5.75-7-11V6l7-4z" />
        </svg>
    );
}
function KeyIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="15" r="5" /><path d="M19 6l-8.2 8.2" /><path d="M19 6l2 2-4 4-2-2" />
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
// Checklist Item
// ─────────────────────────────────────────────
function CheckItem({ pass, text }: { pass: boolean; text: string }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
                width: 18, height: 18, borderRadius: "50%",
                background: pass ? "#f0fdf4" : "#f9fafb",
                border: `1.5px solid ${pass ? "#16a34a" : "#E5E7EB"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "all 0.2s",
                color: pass ? "#16a34a" : "transparent",
            }}>
                <CheckIcon />
            </div>
            <span style={{ fontSize: 12, color: pass ? "#166534" : "#9ca3af", transition: "color 0.2s" }}>{text}</span>
        </div>
    );
}

// ─────────────────────────────────────────────
// Password Field
// ─────────────────────────────────────────────
interface PwdFieldProps {
    label: string;
    error?: string;
    placeholder?: string;
    registration: object;
    id: string;
}
function PasswordField({ label, error, placeholder, registration, id }: PwdFieldProps) {
    const [show, setShow] = useState(false);

    const baseStyle: React.CSSProperties = {
        width: "100%", padding: "11px 42px 11px 14px",
        border: `1.5px solid ${error ? "#ef4444" : "#E5E7EB"}`,
        borderRadius: 12, fontSize: 14, color: "#0f172a",
        background: error ? "#fef2f2" : "#f9fafb",
        outline: "none", fontFamily: "Inter, sans-serif",
        transition: "all 0.15s",
    };

    return (
        <div>
            <label htmlFor={id} style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                {label}
            </label>
            <div style={{ position: "relative" }}>
                <input
                    id={id}
                    type={show ? "text" : "password"}
                    placeholder={placeholder || "••••••••"}
                    {...registration}
                    style={baseStyle}
                    onFocus={(e) => {
                        e.target.style.borderColor = error ? "#ef4444" : "#16a34a";
                        e.target.style.background   = "#fff";
                        e.target.style.boxShadow    = `0 0 0 3px ${error ? "rgba(239,68,68,0.1)" : "rgba(22,163,74,0.1)"}`;
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = error ? "#ef4444" : "#E5E7EB";
                        e.target.style.background   = error ? "#fef2f2" : "#f9fafb";
                        e.target.style.boxShadow    = "none";
                    }}
                />
                <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    aria-label={show ? "Hide password" : "Show password"}
                    style={{
                        position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                        background: "none", border: "none", cursor: "pointer", color: "#9ca3af",
                        padding: 0, display: "flex", alignItems: "center",
                        transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#374151")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#9ca3af")}
                >
                    {show ? <EyeOffIcon /> : <EyeIcon />}
                </button>
            </div>
            {error && (
                <p style={{ fontSize: 12, color: "#ef4444", marginTop: 5, display: "flex", alignItems: "center", gap: 4 }}>
                    <XCircleIcon />
                    {error}
                </p>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function SecurityCenterPage() {
    const { loading } = useAuth();
    const { showToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successShown, setSuccessShown] = useState(false);

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
    });

    const newPassword = watch("newPassword") || "";
    const confirmPwd  = watch("confirmNewPassword") || "";

    const strength = getStrength(newPassword);
    const checks = [
        { text: "At least 8 characters",            pass: newPassword.length >= 8 },
        { text: "At least 12 characters (ideal)",   pass: newPassword.length >= 12 },
        { text: "One uppercase letter (A–Z)",        pass: /[A-Z]/.test(newPassword) },
        { text: "One special character (!@#...)",    pass: /[^a-zA-Z0-9]/.test(newPassword) },
    ];
    const matchOk = newPassword.length > 0 && confirmPwd === newPassword;

    const onSubmit = async (data: PasswordFormValues) => {
        setIsSubmitting(true);
        try {
            const response = await axiosInstance.post("/api/v1/auth/update", {
                currentPassword: data.currentPassword,
                password: data.newPassword,
            });

            if (response.data?.success) {
                setSuccessShown(true);
                setTimeout(() => setSuccessShown(false), 4000);
                reset();
                showToast("Password changed successfully!", "success");
            } else {
                showToast(response.data?.message || "Failed to change password", "error");
            }
        } catch (err: unknown) {
            const e = err as { response?: { data?: { message?: string } }; message?: string };
            showToast(e?.response?.data?.message || e?.message || "Failed to change password", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div style={{ maxWidth: 680, margin: "0 auto" }}>
                <div style={{ background: "#fff", borderRadius: 22, border: "1px solid #E5E7EB", padding: 32 }}>
                    <SkeletonForm />
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 680, margin: "0 auto" }}>

            {/* ── SUCCESS BANNER ──────────────────── */}
            {successShown && (
                <div
                    className="animate-scale-in"
                    style={{
                        display: "flex", alignItems: "center", gap: 14,
                        padding: "16px 22px", borderRadius: 16, marginBottom: 20,
                        background: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                        boxShadow: "var(--shadow-sm)",
                    }}
                >
                    <div style={{
                        width: 40, height: 40, borderRadius: "50%",
                        background: "#dcfce7",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#16a34a", flexShrink: 0,
                    }}>
                        <CheckCircleIcon />
                    </div>
                    <div>
                        <p style={{ fontSize: 14, fontWeight: 700, color: "#166534" }}>Password Updated</p>
                        <p style={{ fontSize: 12, color: "#16a34a", marginTop: 2 }}>
                            Your account is now secured with the new password.
                        </p>
                    </div>
                </div>
            )}

            {/* ── SECURITY HEADER CARD ────────────── */}
            <div
                className="animate-fade-in-up"
                style={{
                    background: "#fff", borderRadius: 22, border: "1px solid #E5E7EB",
                    overflow: "hidden", marginBottom: 20, boxShadow: "var(--shadow-sm)",
                }}
            >
                <div style={{
                    padding: "22px 26px",
                    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                    display: "flex", alignItems: "center", gap: 16,
                }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: 14,
                        background: "rgba(22,163,74,0.18)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#4ade80",
                    }}>
                        <ShieldIcon />
                    </div>
                    <div>
                        <h2 style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>Security Center</h2>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
                            Change your password and keep your account safe
                        </p>
                    </div>
                </div>

                {/* Tips row */}
                <div style={{
                    padding: "14px 26px", background: "#f9fafb",
                    borderBottom: "1px solid #E5E7EB",
                    display: "flex", flexWrap: "wrap", gap: 10,
                }}>
                    {[
                        "Use a unique password not used elsewhere",
                        "Include numbers and symbols",
                        "Never share your password",
                    ].map((tip, i) => (
                        <span key={i} style={{
                            fontSize: 11, fontWeight: 600, color: "#16a34a",
                            background: "#f0fdf4", border: "1px solid #bbf7d0",
                            borderRadius: 999, padding: "3px 10px",
                            display: "flex", alignItems: "center", gap: 5,
                        }}>
                            <CheckIcon /> {tip}
                        </span>
                    ))}
                </div>
            </div>

            {/* ── FORM ────────────────────────────── */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div
                    className="animate-fade-in-up anim-delay-100"
                    style={{
                        background: "#fff", borderRadius: 22, border: "1px solid #E5E7EB",
                        padding: "26px", boxShadow: "var(--shadow-sm)", marginBottom: 20,
                    }}
                >
                    {/* Current Password */}
                    <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #f9fafb" }}>
                        <p style={{ fontSize: 12.5, fontWeight: 700, color: "#0f172a", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ color: "#9ca3af" }}><KeyIcon /></span>
                            Verify Identity
                        </p>
                        <PasswordField
                            id="currentPassword"
                            label="Current Password"
                            placeholder="Enter your current password"
                            registration={register("currentPassword")}
                            error={errors.currentPassword?.message}
                        />
                    </div>

                    {/* New Password section */}
                    <div>
                        <p style={{ fontSize: 12.5, fontWeight: 700, color: "#0f172a", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ color: "#9ca3af" }}><ShieldIcon /></span>
                            New Password
                        </p>

                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <PasswordField
                                id="newPassword"
                                label="New Password"
                                registration={register("newPassword")}
                                error={errors.newPassword?.message}
                            />

                            {/* Strength meter */}
                            {newPassword.length > 0 && (
                                <div
                                    className="animate-fade-in"
                                    style={{
                                        padding: "14px 16px", borderRadius: 12,
                                        background: strength.bg,
                                        border: `1px solid ${strength.color}28`,
                                    }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                        <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Password Strength</span>
                                        <span style={{ fontSize: 12, fontWeight: 700, color: strength.color }}>{strength.label}</span>
                                    </div>
                                    {/* Bar */}
                                    <div style={{ height: 5, background: "#e5e7eb", borderRadius: 999, overflow: "hidden", marginBottom: 12 }}>
                                        <div style={{
                                            height: "100%",
                                            width: `${(strength.score / 4) * 100}%`,
                                            background: strength.color,
                                            borderRadius: 999,
                                            transition: "width 0.5s cubic-bezier(0.16,1,0.3,1)",
                                        }} />
                                    </div>
                                    {/* Checklist */}
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px" }}>
                                        {checks.map((c, i) => <CheckItem key={i} {...c} />)}
                                    </div>
                                </div>
                            )}

                            <PasswordField
                                id="confirmNewPassword"
                                label="Confirm New Password"
                                registration={register("confirmNewPassword")}
                                error={errors.confirmNewPassword?.message}
                            />

                            {/* Match indicator */}
                            {confirmPwd.length > 0 && (
                                <div
                                    className="animate-fade-in"
                                    style={{
                                        display: "flex", alignItems: "center", gap: 9,
                                        padding: "10px 14px", borderRadius: 10,
                                        background: matchOk ? "#f0fdf4" : "#fef2f2",
                                        border: `1px solid ${matchOk ? "#bbf7d0" : "#fecaca"}`,
                                        color: matchOk ? "#166534" : "#991b1b",
                                    }}
                                >
                                    {matchOk ? <CheckCircleIcon /> : <XCircleIcon />}
                                    <span style={{ fontSize: 13, fontWeight: 600 }}>
                                        {matchOk ? "Passwords match" : "Passwords do not match"}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── ACTIONS ────────────────────────── */}
                <div className="animate-fade-in-up anim-delay-200" style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                    <button
                        type="button"
                        onClick={() => reset()}
                        disabled={isSubmitting}
                        style={{
                            padding: "11px 20px", borderRadius: 12,
                            border: "1.5px solid #E5E7EB", background: "#fff",
                            fontSize: 13.5, fontWeight: 600, color: "#374151",
                            cursor: "pointer", transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
                    >
                        Clear
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                            padding: "11px 24px", borderRadius: 12, border: "none",
                            background: "#0f172a",
                            color: "#fff", fontSize: 13.5, fontWeight: 700,
                            cursor: isSubmitting ? "not-allowed" : "pointer",
                            display: "flex", alignItems: "center", gap: 8,
                            boxShadow: "0 4px 12px rgba(15,23,42,0.25)",
                            opacity: isSubmitting ? 0.8 : 1,
                            transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => { if (!isSubmitting) (e.currentTarget.style.background = "#1e293b"); }}
                        onMouseLeave={(e) => { if (!isSubmitting) (e.currentTarget.style.background = "#0f172a"); }}
                    >
                        {isSubmitting ? (
                            <><SpinnerIcon /> Updating…</>
                        ) : (
                            <><ShieldIcon /> Update Password</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
