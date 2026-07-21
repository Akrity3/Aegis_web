"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormValues } from "./schema";
import { handleRegisterUser } from "@/lib/actions/auth-action";

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

const labelStyle = {
  display: "block" as const,
  fontSize: "14px",
  fontWeight: 600 as const,
  color: "#111827",
  marginBottom: "8px",
};

const ErrorMsg = ({ msg }: { msg: string }) => (
  <p style={{ color: "#EF4444", fontSize: "13px", marginTop: "8px", marginBottom: "0", display: "flex", alignItems: "center", gap: "6px", fontWeight: 500 }}>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
    {msg}
  </p>
);

const EyeIcon = ({ crossed }: { crossed: boolean }) => crossed ? (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
) : (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

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

  return (
    <div style={{
      display: "flex", 
      minHeight: "100vh", 
      background: "#F8FAFC",
      fontFamily: "'Inter', 'Roboto', 'Outfit', sans-serif",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px"
    }}>
      <div style={{
        width: "100%", 
        maxWidth: "480px", 
        background: "#FFFFFF",
        padding: "52px 48px",
        borderRadius: "18px",
        border: "1px solid #E5E7EB",
        boxShadow: "0 10px 40px -10px rgba(0,0,0,0.06)",
      }}>
        {/* Logo Section */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "40px" }}>
          <Image src="/logo.png" alt="Aegis+ Logo" width={64} height={64} style={{ borderRadius: "14px", objectFit: "contain", marginBottom: "16px" }} />
          <h1 style={{ color: "#111827", fontWeight: 800, fontSize: "24px", letterSpacing: "-0.5px", margin: "0 0 6px 0" }}>
            Aegis<span style={{ color: "#16A34A" }}>+</span>
          </h1>
          <p style={{ color: "#6B7280", fontSize: "14.5px", margin: 0, fontWeight: 500 }}>
            Protecting Nepal, One Alert at a Time
          </p>
        </div>

        {/* Welcome Section */}
        <div style={{ marginBottom: "36px", textAlign: "center" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#111827", margin: "0 0 10px 0", letterSpacing: "-0.5px" }}>
            Create your account
          </h2>
          <p style={{ color: "#6B7280", fontSize: "15px", lineHeight: 1.6, margin: 0 }}>
            Start protecting yourself and your community today.
          </p>
        </div>

        {/* Form */}
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

          <div style={{ display: "flex", gap: "16px", marginBottom: errors.firstName || errors.lastName ? "8px" : "24px" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>First Name</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: errors.firstName ? "#EF4444" : "#9CA3AF", display: "flex" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="First name"
                  {...register("firstName")}
                  style={errors.firstName ? { ...inputError } : { ...inputBase }}
                  onFocus={e => { if (!errors.firstName) { e.target.style.borderColor = "#22C55E"; e.target.style.background = "#FFFFFF"; e.target.style.boxShadow = "0 0 0 3px rgba(34, 197, 94, 0.1)"; } }}
                  onBlur={e => { if (!errors.firstName) { e.target.style.borderColor = "#E5E7EB"; e.target.style.background = "#F9FAFB"; e.target.style.boxShadow = "none"; } }}
                />
              </div>
              {errors.firstName && <ErrorMsg msg={errors.firstName.message!} />}
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Last Name</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: errors.lastName ? "#EF4444" : "#9CA3AF", display: "flex" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Last name"
                  {...register("lastName")}
                  style={errors.lastName ? { ...inputError } : { ...inputBase }}
                  onFocus={e => { if (!errors.lastName) { e.target.style.borderColor = "#22C55E"; e.target.style.background = "#FFFFFF"; e.target.style.boxShadow = "0 0 0 3px rgba(34, 197, 94, 0.1)"; } }}
                  onBlur={e => { if (!errors.lastName) { e.target.style.borderColor = "#E5E7EB"; e.target.style.background = "#F9FAFB"; e.target.style.boxShadow = "none"; } }}
                />
              </div>
              {errors.lastName && <ErrorMsg msg={errors.lastName.message!} />}
            </div>
          </div>

          <div style={{ marginBottom: errors.username ? "8px" : "24px" }}>
            <label style={labelStyle}>Username</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: errors.username ? "#EF4444" : "#9CA3AF", display: "flex" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input
                type="text"
                placeholder="Choose a username"
                {...register("username")}
                style={errors.username ? { ...inputError } : { ...inputBase }}
                onFocus={e => { if (!errors.username) { e.target.style.borderColor = "#22C55E"; e.target.style.background = "#FFFFFF"; e.target.style.boxShadow = "0 0 0 3px rgba(34, 197, 94, 0.1)"; } }}
                onBlur={e => { if (!errors.username) { e.target.style.borderColor = "#E5E7EB"; e.target.style.background = "#F9FAFB"; e.target.style.boxShadow = "none"; } }}
              />
            </div>
            {errors.username && <ErrorMsg msg={errors.username.message!} />}
          </div>

          <div style={{ marginBottom: errors.email ? "8px" : "24px" }}>
            <label style={labelStyle}>Email Address</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: errors.email ? "#EF4444" : "#9CA3AF", display: "flex" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                style={errors.email ? { ...inputError } : { ...inputBase }}
                onFocus={e => { if (!errors.email) { e.target.style.borderColor = "#22C55E"; e.target.style.background = "#FFFFFF"; e.target.style.boxShadow = "0 0 0 3px rgba(34, 197, 94, 0.1)"; } }}
                onBlur={e => { if (!errors.email) { e.target.style.borderColor = "#E5E7EB"; e.target.style.background = "#F9FAFB"; e.target.style.boxShadow = "none"; } }}
              />
            </div>
            {errors.email && <ErrorMsg msg={errors.email.message!} />}
          </div>

          <div style={{ marginBottom: errors.phoneNumber ? "8px" : "24px" }}>
            <label style={labelStyle}>Phone Number</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: errors.phoneNumber ? "#EF4444" : "#9CA3AF", display: "flex" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z"/>
                </svg>
              </span>
              <input
                type="tel"
                placeholder="+977 98XXXXXXXX"
                {...register("phoneNumber")}
                style={errors.phoneNumber ? { ...inputError } : { ...inputBase }}
                onFocus={e => { if (!errors.phoneNumber) { e.target.style.borderColor = "#22C55E"; e.target.style.background = "#FFFFFF"; e.target.style.boxShadow = "0 0 0 3px rgba(34, 197, 94, 0.1)"; } }}
                onBlur={e => { if (!errors.phoneNumber) { e.target.style.borderColor = "#E5E7EB"; e.target.style.background = "#F9FAFB"; e.target.style.boxShadow = "none"; } }}
              />
            </div>
            {errors.phoneNumber && <ErrorMsg msg={errors.phoneNumber.message!} />}
          </div>

          <div style={{ marginBottom: errors.password ? "8px" : "24px" }}>
            <label style={labelStyle}>Password</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: errors.password ? "#EF4444" : "#9CA3AF", display: "flex" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                {...register("password")}
                style={errors.password ? { ...inputError, paddingRight: "48px" } : { ...inputBase, paddingRight: "48px" }}
                onFocus={e => { if (!errors.password) { e.target.style.borderColor = "#22C55E"; e.target.style.background = "#FFFFFF"; e.target.style.boxShadow = "0 0 0 3px rgba(34, 197, 94, 0.1)"; } }}
                onBlur={e => { if (!errors.password) { e.target.style.borderColor = "#E5E7EB"; e.target.style.background = "#F9FAFB"; e.target.style.boxShadow = "none"; } }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: 0, display: "flex", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#4B5563"}
                onMouseLeave={e => e.currentTarget.style.color = "#9CA3AF"}
              >
                <EyeIcon crossed={showPassword} />
              </button>
            </div>
            {errors.password && <ErrorMsg msg={errors.password.message!} />}
          </div>

          <div style={{ marginBottom: errors.confirmPassword ? "8px" : "24px" }}>
            <label style={labelStyle}>Confirm Password</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: errors.confirmPassword ? "#EF4444" : "#9CA3AF", display: "flex" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm your password"
                {...register("confirmPassword")}
                style={errors.confirmPassword ? { ...inputError, paddingRight: "48px" } : { ...inputBase, paddingRight: "48px" }}
                onFocus={e => { if (!errors.confirmPassword) { e.target.style.borderColor = "#22C55E"; e.target.style.background = "#FFFFFF"; e.target.style.boxShadow = "0 0 0 3px rgba(34, 197, 94, 0.1)"; } }}
                onBlur={e => { if (!errors.confirmPassword) { e.target.style.borderColor = "#E5E7EB"; e.target.style.background = "#F9FAFB"; e.target.style.boxShadow = "none"; } }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: 0, display: "flex", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#4B5563"}
                onMouseLeave={e => e.currentTarget.style.color = "#9CA3AF"}
              >
                <EyeIcon crossed={showConfirm} />
              </button>
            </div>
            {errors.confirmPassword && <ErrorMsg msg={errors.confirmPassword.message!} />}
          </div>

          <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "32px", cursor: "pointer" }}>
            <input
              type="checkbox"
              {...register("agreed")}
              style={{ width: "18px", height: "18px", accentColor: "#16A34A", marginTop: "2px", flexShrink: 0, cursor: "pointer" }}
            />
            <span style={{ fontSize: "14.5px", color: "#4B5563", lineHeight: 1.5 }}>
              I agree to the{" "}
              <a href="#" style={{ color: "#16A34A", fontWeight: 600, textDecoration: "none" }} onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"} onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>Terms of Service</a>
              {" "}and{" "}
              <a href="#" style={{ color: "#16A34A", fontWeight: 600, textDecoration: "none" }} onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"} onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>Privacy Policy</a>
            </span>
          </label>
          {errors.agreed && <div style={{ marginTop: "-24px", marginBottom: "32px" }}><ErrorMsg msg={errors.agreed.message!} /></div>}

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
            {isPending ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
          <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
          <span style={{ color: "#9CA3AF", fontSize: "13px", fontWeight: 600, letterSpacing: "1px" }}>OR</span>
          <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
        </div>

        <button type="button" style={{
          width: "100%", padding: "15px",
          background: "#FFFFFF", border: "1.5px solid #E5E7EB",
          borderRadius: "12px", cursor: "pointer", fontSize: "15.5px",
          fontWeight: 600, color: "#374151",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
          marginBottom: "36px",
          transition: "background 0.2s, border-color 0.2s"
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "#F9FAFB"; e.currentTarget.style.borderColor = "#D1D5DB"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "#FFFFFF"; e.currentTarget.style.borderColor = "#E5E7EB"; }}>
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.29-8.16 2.29-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          </svg>
          Continue with Google
        </button>

        <p style={{ textAlign: "center", fontSize: "15px", color: "#6B7280", margin: 0 }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#16A34A", fontWeight: 600, textDecoration: "none", padding: "4px" }}
                onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
