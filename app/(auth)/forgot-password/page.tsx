"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordValues) => {
    setError("");
    startTransition(async () => {
      try {
        const response = await fetch("/api/v1/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (result.success) {
          setSuccess(true);
        } else {
          setError(result.message || "Failed to send reset email");
        }
      } catch (err: unknown) {
        const e = err as { message?: string };
        setError(e?.message || "Failed to send reset email");
      }
    });
  };

  const inputBase = {
    width: "100%",
    boxSizing: "border-box" as const,
    padding: "14px 16px 14px 44px",
    border: "1.5px solid #E5E7EB",
    borderRadius: "12px",
    fontSize: "15px",
    color: "#111827",
    background: "#F9FAFB",
    outline: "none",
    transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
  };

  const inputError = {
    ...inputBase,
    borderColor: "#EF4444",
    background: "#FEF2F2",
  };

  return (
    <div style={{
      display: "flex", 
      minHeight: "100vh", 
      background:
        "radial-gradient(1200px 600px at 10% 10%, rgba(22, 163, 74, 0.32), rgba(193, 220, 202, 0))," +
        "radial-gradient(900px 520px at 90% 15%, rgba(15, 23, 42, 0.10), rgba(193, 220, 202, 0))," +
        "radial-gradient(900px 520px at 85% 92%, rgba(21, 128, 61, 0.16), rgba(193, 220, 202, 0))," +
        "linear-gradient(180deg, #bfd9c7 0%, #d7e9dd 100%)",
      fontFamily: "'Inter', 'Roboto', 'Outfit', sans-serif",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px"
    }}>
      <div style={{
        width: "100%", 
        maxWidth: "480px", 
        background: "linear-gradient(180deg, rgba(255,255,255,0.99), rgba(233,247,238,0.96))",
        padding: "52px 48px",
        borderRadius: "18px",
        border: "1px solid rgba(187, 247, 208, 0.9)",
        boxShadow: "0 28px 80px -24px rgba(15,23,42,0.34), 0 10px 28px rgba(22,163,74,0.12)",
        transform: "translateY(-6px)",
      }}>
        {/* Logo Section */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "40px" }}>
          <Image src="/logo.png" alt="Aegis+ Logo" width={64} height={64} style={{ borderRadius: "14px", objectFit: "contain", marginBottom: "16px" }} />
          <h1 style={{ color: "#111827", fontWeight: 800, fontSize: "24px", letterSpacing: "-0.5px", margin: "0 0 6px 0" }}>
            Aegis<span style={{ color: "#EF4444" }}>+</span>
          </h1>
          <p style={{ color: "#6B7280", fontSize: "14.5px", margin: 0, fontWeight: 500 }}>
            Protecting Nepal, One Alert at a Time
          </p>
        </div>

        {/* Header Section */}
        <div style={{ marginBottom: "36px", textAlign: "center" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#111827", margin: "0 0 10px 0", letterSpacing: "-0.5px" }}>
            Forgot Password?
          </h2>
          <p style={{ color: "#6B7280", fontSize: "15px", lineHeight: 1.6, margin: 0 }}>
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Success Message */}
        {success ? (
          <div style={{
            padding: "24px",
            borderRadius: "12px",
            background: "#ECFDF5",
            border: "1px solid #6EE7B7",
            textAlign: "center",
            marginBottom: "24px"
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "16px" }}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <h3 style={{ color: "#111827", fontSize: "18px", fontWeight: 700, margin: "0 0 8px 0" }}>
              Check your email
            </h3>
            <p style={{ color: "#6B7280", fontSize: "14px", margin: 0 }}>
              If an account exists with this email, a password reset link has been sent.
            </p>
            <Link href="/login" style={{
              display: "inline-block",
              marginTop: "20px",
              padding: "12px 24px",
              background: "#16A34A",
              color: "#FFFFFF",
              fontWeight: 600,
              fontSize: "14px",
              textDecoration: "none",
              borderRadius: "8px",
              transition: "background 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#15803D"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#16A34A"}>
              Back to Login
            </Link>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {error && (
              <div style={{
                marginBottom: "24px", padding: "14px 16px", borderRadius: "12px",
                border: "1px solid #FCA5A5", background: "#FEF2F2", color: "#EF4444", fontSize: "14.5px",
                fontWeight: 500, display: "flex", alignItems: "center", gap: "10px"
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <div style={{ marginBottom: errors.email ? "8px" : "32px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#111827", marginBottom: "8px" }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: errors.email ? "#EF4444" : "#9CA3AF", display: "flex" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </span>
                <input
                  type="email"
                  placeholder="you@gmail.com"
                  {...register("email")}
                  style={errors.email ? { ...inputError } : { ...inputBase }}
                  onFocus={e => { if (!errors.email) { e.target.style.borderColor = "#22C55E"; e.target.style.background = "#FFFFFF"; e.target.style.boxShadow = "0 0 0 3px rgba(34, 197, 94, 0.1)"; } }}
                  onBlur={e => { if (!errors.email) { e.target.style.borderColor = "#E5E7EB"; e.target.style.background = "#F9FAFB"; e.target.style.boxShadow = "none"; } }}
                />
              </div>
              {errors.email && (
                <p style={{ color: "#EF4444", fontSize: "13px", marginTop: "8px", marginBottom: "0", display: "flex", alignItems: "center", gap: "6px", fontWeight: 500 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isPending}
              style={{
                width: "100%", padding: "16px",
                background: "#16A34A",
                color: "#FFFFFF", fontWeight: 700, fontSize: "16px",
                border: "none", borderRadius: "12px", 
                cursor: isSubmitting || isPending ? "not-allowed" : "pointer",
                boxShadow: "0 4px 12px rgba(22, 163, 74, 0.2)",
                marginBottom: "24px", letterSpacing: "0.2px",
                opacity: isSubmitting || isPending ? 0.7 : 1,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={e => { if (!isSubmitting && !isPending) { e.currentTarget.style.background = "#15803D"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(22, 163, 74, 0.3)"; } }}
              onMouseLeave={e => { if (!isSubmitting && !isPending) { e.currentTarget.style.background = "#16A34A"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(22, 163, 74, 0.2)"; } }}
            >
              {isPending ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <p style={{ textAlign: "center", fontSize: "15px", color: "#6B7280", margin: 0 }}>
          Remember your password?{" "}
          <Link href="/login" style={{ color: "#16A34A", fontWeight: 600, textDecoration: "none", padding: "4px" }}
                onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
