"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { loginSchema, LoginFormValues } from "../_components/schema";

const alerts = [
  { icon: "⚠", label: "SOS Activated", sub: "New Road, KTM · Now", color: "#dc2626", bg: "rgba(220,38,38,0.12)" },
  { icon: "✓", label: "Area Secured", sub: "Thamel · 3 min ago", color: "#16a34a", bg: "rgba(22,163,74,0.12)" },
  { icon: "🔔", label: "2 Active Alerts", sub: "Your zone · Ongoing", color: "#ca8a04", bg: "rgba(202,138,4,0.12)" },
  { icon: "📍", label: "Location Shared", sub: "Patan, Lalitpur · 7m", color: "#2563eb", bg: "rgba(37,99,235,0.12)" },
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<>({
    resolver: (),
  });

  const onSubmit = async () => {
    console.log("Login data:", );
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

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      {/* Left Panel */}
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

        {/* <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative" }}> */}
          {/* <Image src="/logo.png" alt="Aegis+ Logo" width={42} height={42} style={{ borderRadius: 8, objectFit: "contain" }} /> */}
          {/* <span style={{ color: "#fff", fontWeight: 700, fontSize: 26, letterSpacing: "1px" }}>
            AEGIS<span style={{ color: "#dc2626" }}>+</span>
          </span> */}
        {/* </div> */}

        <div style={{ position: "relative" }}>
          <h1 style={{
            color: "#fff", fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
            fontWeight: 800, lineHeight: 1.18, marginBottom: 20, letterSpacing: "-0.5px",
          }}>
            Protecting Nepal,<br />One Alert at a Time
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 17, lineHeight: 1.75, marginBottom: 36 }}>
            Sign in to access real-time safety alerts,<br />
            report incidents, and stay connected with your community.
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

      {/* Right Panel */}
      <div style={{ flex: 1, background: "#f0fdf4", display: "flex", alignItems: "stretch", justifyContent: "center" }}>
        <div style={{
          width: "100%", background: "#ffffff",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.06)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "56px 52px",
        }}>
          <div style={{ width: "100%", maxWidth: 460 }}>
            {/* Logo  */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
              <Image src="/logo.png" alt="Aegis+ Logo" width={56} height={56} style={{ borderRadius: 10, objectFit: "contain" }} />
              <span style={{ color: "#000000", fontWeight: 800, fontSize: 28, letterSpacing: "-0.4px" }}>
                Aegis<span style={{ color: "#dc2626" }}>+</span>
              </span>
            </div>

            <h2 style={{ fontSize: 30, fontWeight: 800, color: "#0f172a", marginBottom: 8, letterSpacing: "-0.4px" }}>Welcome back</h2>
            <p style={{ color: "#64748b", fontSize: 16.5, marginBottom: 36, lineHeight: 1.6 }}>Sign in to your Aegis+ account to stay protected.</p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* Email */}
              <label style={{ display: "block", fontSize: 15, fontWeight: 600, color: "#334155", marginBottom: 8 }}>
                Email address
              </label>
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
              {errors.email && (
                <p style={{ color: "#ef4444", fontSize: 13.5, marginBottom: 16, display: "flex", alignItems: "center", gap: 5 }}>
                  <span>⊙</span> {errors.email.message}
                </p>
              )}
              {!errors.email && <div style={{ marginBottom: 20 }} />}

              {/* Password */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label style={{ fontSize: 15, fontWeight: 600, color: "#334155" }}>Password</label>
                <a href="#" style={{ fontSize: 14, color: "#16a34a", textDecoration: "none", fontWeight: 500 }}>Forgot password?</a>
              </div>
              <div style={{ position: "relative", marginBottom: 4 }}>
                <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: errors.password ? "#ef4444" : "#94a3b8", display: "flex" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p style={{ color: "#ef4444", fontSize: 13.5, marginBottom: 16, display: "flex", alignItems: "center", gap: 5 }}>
                  <span>⊙</span> {errors.password.message}
                </p>
              )}
              {!errors.password && <div style={{ marginBottom: 20 }} />}

              {/* Remember me */}
              <label style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 28, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: "#22c55e" }}
                />
                <span style={{ fontSize: 15, color: "#475569" }}>Remember me for 30 days</span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: "100%", padding: "14px",
                  background: "linear-gradient(135deg, #22c55e, #16a34a)",
                  color: "#fff", fontWeight: 700, fontSize: 17,
                  border: "none", borderRadius: 9, cursor: isSubmitting ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 16px rgba(34,197,94,0.3)",
                  marginBottom: 20, letterSpacing: "0.1px",
                  opacity: isSubmitting ? 0.7 : 1,
                  transition: "opacity 0.2s, transform 0.15s",
                }}
                onMouseEnter={e => { if (!isSubmitting) { e.currentTarget.style.opacity = "0.92"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
                onMouseLeave={e => { e.currentTarget.style.opacity = isSubmitting ? "0.7" : "1"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {isSubmitting ? "Signing in…" : "Sign In"}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
              <span style={{ color: "#94a3b8", fontSize: 14 }}>or continue with</span>
              <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
            </div>

            {/* Google */}
            <button style={{
              width: "100%", padding: "13px",
              background: "#fff", border: "1.5px solid #e2e8f0",
              borderRadius: 9, cursor: "pointer", fontSize: 15.5,
              fontWeight: 600, color: "#1e293b",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              marginBottom: 30, transition: "border-color 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "#22c55e")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "#e2e8f0")}
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.29-8.16 2.29-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              Continue with Google
            </button>

            <p style={{ textAlign: "center", fontSize: 15, color: "#64748b" }}>
              Don&apos;t have an account?{" "}
              <Link href="/register" style={{ color: "#16a34a", fontWeight: 700, textDecoration: "none" }}>Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}