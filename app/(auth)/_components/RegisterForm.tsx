"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormValues } from "./schema";
import { handleRegisterUser } from "@/lib/actions/auth-action";

const alerts = [
  { icon: "⚠", label: "SOS Activated", sub: "New Road, KTM · Now", bg: "rgba(220,38,38,0.12)" },
  { icon: "✓", label: "Area Secured", sub: "Thamel · 3 min ago", bg: "rgba(22,163,74,0.12)" },
  { icon: "🔔", label: "2 Active Alerts", sub: "Your zone · Ongoing", bg: "rgba(202,138,4,0.12)" },
  { icon: "📍", label: "Location Shared", sub: "Patan, Lalitpur · 7m", bg: "rgba(37,99,235,0.12)" },
];

export default function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { agreed: false },
  });

  const onSubmit = (data: RegisterFormValues) => {
    setError("");
    startTransition(async () => {
      try {
        const result = await handleRegisterUser(data);
        if (result.success) {
          router.push("/login");
        } else {
          setError(result.message || "Registration failed");
        }
      } catch (err: unknown) {
        const e = err as { message?: string };
        setError(e?.message || "Registration failed");
      }
    });
  };

  const inputBase = {
    width: "100%",
    boxSizing: "border-box" as const,
    padding: "13px 14px 13px 42px",
    border: "1.5px solid #e2e8f0",
    borderRadius: 9,
    fontSize: 16,
    color: "#1e293b",
    background: "#f8fafc",
    outline: "none",
    transition: "border-color 0.2s, background 0.2s",
  };

  const inputError = {
    ...inputBase,
    borderColor: "#ef4444",
    background: "#fff5f5",
  };

  const labelStyle = {
    display: "block" as const,
    fontSize: 15,
    fontWeight: 600 as const,
    color: "#334155",
    marginBottom: 8,
  };

  const errorMsg = (msg: string) => (
    <p style={{ color: "#ef4444", fontSize: 13.5, marginBottom: 16, display: "flex", alignItems: "center", gap: 5 }}>
      <span>⊙</span> {msg}
    </p>
  );

  const EyeIcon = ({ crossed }: { crossed: boolean }) => crossed ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <div style={{
        flex: 1,
        background: "linear-gradient(150deg, #2d6a4f 0%, #1b4332 55%, #081c15 100%)",
        padding: "40px 52px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(ellipse at 15% 60%, rgba(74,222,128,0.07) 0%, transparent 55%), radial-gradient(ellipse at 85% 15%, rgba(74,222,128,0.04) 0%, transparent 50%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative" }}>
          <h1 style={{
            color: "#fff", fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
            fontWeight: 800, lineHeight: 1.18, marginBottom: 20, letterSpacing: "-0.5px",
          }}>
            Join 50,000+<br />Nepalis Staying Safe
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 17, lineHeight: 1.75, marginBottom: 36 }}>
            Create your account and start receiving<br />
            real-time safety alerts, incident reports, and<br />
            AI-powered risk detection for your area.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {alerts.map((a, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 10, padding: "13px 16px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8, background: a.bg,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                  }}>{a.icon}</div>
                  <div>
                    <div style={{ color: "#f1f5f9", fontWeight: 600, fontSize: 15 }}>{a.label}</div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{a.sub}</div>
                  </div>
                </div>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 5px #4ade80" }} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 13.5, position: "relative" }}>© 2026 Aegis+ · Protecting Nepal</div>
      </div>

      <div style={{ flex: 1, background: "#f0fdf4", display: "flex", alignItems: "stretch" }}>
        <div style={{
          width: "100%", background: "#ffffff",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.06)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "48px 52px", overflowY: "auto",
        }}>
          <div style={{ width: "100%", maxWidth: 460 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
              <Image src="/logo.png" alt="Aegis+ Logo" width={56} height={56} style={{ borderRadius: 10, objectFit: "contain" }} />
              <span style={{ color: "#000000", fontWeight: 800, fontSize: 28, letterSpacing: "1.5px" }}>
                AEGIS<span style={{ color: "#dc2626" }}>+</span>
              </span>
            </div>

            <h2 style={{ fontSize: 30, fontWeight: 800, color: "#0f172a", marginBottom: 8, letterSpacing: "-0.4px" }}>Create your account</h2>
            <p style={{ color: "#64748b", fontSize: 16.5, marginBottom: 36, lineHeight: 1.6 }}>Start protecting yourself and your community today.</p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {error && (
                <div style={{
                  marginBottom: 20, padding: "12px 14px", borderRadius: 9,
                  border: "1px solid #ef4444", background: "#fff5f5", color: "#dc2626", fontSize: 14,
                }}>
                  {error}
                </div>
              )}

              <label style={labelStyle}>First Name</label>
              <div style={{ position: "relative", marginBottom: 4 }}>
                <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: errors.firstName ? "#ef4444" : "#94a3b8", display: "flex" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="First name"
                  {...register("firstName")}
                  style={errors.firstName ? { ...inputError } : { ...inputBase }}
                  onFocus={e => { if (!errors.firstName) { e.target.style.borderColor = "#22c55e"; e.target.style.background = "#fff"; } }}
                  onBlur={e => { if (!errors.firstName) { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; } }}
                />
              </div>
              {errors.firstName ? errorMsg(errors.firstName.message!) : <div style={{ marginBottom: 20 }} />}

              <label style={labelStyle}>Last Name</label>
              <div style={{ position: "relative", marginBottom: 4 }}>
                <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: errors.lastName ? "#ef4444" : "#94a3b8", display: "flex" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Last name"
                  {...register("lastName")}
                  style={errors.lastName ? { ...inputError } : { ...inputBase }}
                  onFocus={e => { if (!errors.lastName) { e.target.style.borderColor = "#22c55e"; e.target.style.background = "#fff"; } }}
                  onBlur={e => { if (!errors.lastName) { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; } }}
                />
              </div>
              {errors.lastName ? errorMsg(errors.lastName.message!) : <div style={{ marginBottom: 20 }} />}

              <label style={labelStyle}>Username</label>
              <div style={{ position: "relative", marginBottom: 4 }}>
                <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: errors.username ? "#ef4444" : "#94a3b8", display: "flex" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Choose a username"
                  {...register("username")}
                  style={errors.username ? { ...inputError } : { ...inputBase }}
                  onFocus={e => { if (!errors.username) { e.target.style.borderColor = "#22c55e"; e.target.style.background = "#fff"; } }}
                  onBlur={e => { if (!errors.username) { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; } }}
                />
              </div>
              {errors.username ? errorMsg(errors.username.message!) : <div style={{ marginBottom: 20 }} />}

              <label style={labelStyle}>Email address</label>
              <div style={{ position: "relative", marginBottom: 4 }}>
                <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: errors.email ? "#ef4444" : "#94a3b8", display: "flex" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  style={errors.email ? { ...inputError } : { ...inputBase }}
                  onFocus={e => { if (!errors.email) { e.target.style.borderColor = "#22c55e"; e.target.style.background = "#fff"; } }}
                  onBlur={e => { if (!errors.email) { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; } }}
                />
              </div>
              {errors.email ? errorMsg(errors.email.message!) : <div style={{ marginBottom: 20 }} />}

              <label style={labelStyle}>Phone Number</label>
              <div style={{ position: "relative", marginBottom: 4 }}>
                <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: errors.phoneNumber ? "#ef4444" : "#94a3b8", display: "flex" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z"/>
                  </svg>
                </span>
                <input
                  type="tel"
                  placeholder="+977 98XXXXXXXX (optional)"
                  {...register("phoneNumber")}
                  style={errors.phoneNumber ? { ...inputError } : { ...inputBase }}
                  onFocus={e => { if (!errors.phoneNumber) { e.target.style.borderColor = "#22c55e"; e.target.style.background = "#fff"; } }}
                  onBlur={e => { if (!errors.phoneNumber) { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; } }}
                />
              </div>
              {errors.phoneNumber ? errorMsg(errors.phoneNumber.message!) : <div style={{ marginBottom: 20 }} />}

              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative", marginBottom: 4 }}>
                <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: errors.password ? "#ef4444" : "#94a3b8", display: "flex" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  {...register("password")}
                  style={errors.password ? { ...inputError, paddingRight: 44 } : { ...inputBase, paddingRight: 44 }}
                  onFocus={e => { if (!errors.password) { e.target.style.borderColor = "#22c55e"; e.target.style.background = "#fff"; } }}
                  onBlur={e => { if (!errors.password) { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; } }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0, display: "flex" }}
                >
                  <EyeIcon crossed={showPassword} />
                </button>
              </div>
              {errors.password ? errorMsg(errors.password.message!) : <div style={{ marginBottom: 20 }} />}

              <label style={labelStyle}>Confirm Password</label>
              <div style={{ position: "relative", marginBottom: 4 }}>
                <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: errors.confirmPassword ? "#ef4444" : "#94a3b8", display: "flex" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm your password"
                  {...register("confirmPassword")}
                  style={errors.confirmPassword ? { ...inputError, paddingRight: 44 } : { ...inputBase, paddingRight: 44 }}
                  onFocus={e => { if (!errors.confirmPassword) { e.target.style.borderColor = "#22c55e"; e.target.style.background = "#fff"; } }}
                  onBlur={e => { if (!errors.confirmPassword) { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; } }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0, display: "flex" }}
                >
                  <EyeIcon crossed={showConfirm} />
                </button>
              </div>
              {errors.confirmPassword ? errorMsg(errors.confirmPassword.message!) : <div style={{ marginBottom: 24 }} />}

              <label style={{ display: "flex", alignItems: "flex-start", gap: 9, marginBottom: 4, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  {...register("agreed")}
                  style={{ width: 16, height: 16, accentColor: "#22c55e", marginTop: 2, flexShrink: 0 }}
                />
                <span style={{ fontSize: 15, color: "#475569", lineHeight: 1.5 }}>
                  I agree to the{" "}
                  <a href="#" style={{ color: "#16a34a", fontWeight: 600, textDecoration: "none" }}>Terms of Service</a>
                  {" "}and{" "}
                  <a href="#" style={{ color: "#16a34a", fontWeight: 600, textDecoration: "none" }}>Privacy Policy</a>
                </span>
              </label>
              {errors.agreed ? errorMsg(errors.agreed.message!) : <div style={{ marginBottom: 28 }} />}

              <button
                type="submit"
                disabled={isSubmitting || isPending}
                style={{
                  width: "100%", padding: "14px",
                  background: "linear-gradient(135deg, #22c55e, #16a34a)",
                  color: "#fff", fontWeight: 700, fontSize: 17,
                  border: "none", borderRadius: 9, cursor: isSubmitting || isPending ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 16px rgba(34,197,94,0.3)",
                  marginBottom: 28, letterSpacing: "0.1px",
                  opacity: isSubmitting || isPending ? 0.7 : 1,
                }}
              >
                {isPending ? "Creating account…" : "Create Account"}
              </button>
            </form>

            <p style={{ textAlign: "center", fontSize: 15, color: "#64748b" }}>
              Already have an account?{" "}
              <Link href="/login" style={{ color: "#16a34a", fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
