"use client";

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useId,
} from "react";

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastItem {
    id: string;
    message: string;
    type: ToastType;
    leaving: boolean;
}

interface ToastContextValue {
    showToast: (message: string, type?: ToastType) => void;
}

// ────────────────────────────────────────────────────────────
// Context
// ────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

// ────────────────────────────────────────────────────────────
// Configuration per toast type
// ────────────────────────────────────────────────────────────

const TOAST_CONFIG: Record<
    ToastType,
    { bg: string; border: string; text: string; iconBg: string; icon: React.ReactNode }
> = {
    success: {
        bg: "#f0fdf4",
        border: "#bbf7d0",
        text: "#166534",
        iconBg: "#16a34a",
        icon: (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
            </svg>
        ),
    },
    error: {
        bg: "#fef2f2",
        border: "#fecaca",
        text: "#991b1b",
        iconBg: "#dc2626",
        icon: (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
        ),
    },
    warning: {
        bg: "#fffbeb",
        border: "#fde68a",
        text: "#92400e",
        iconBg: "#f59e0b",
        icon: (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
        ),
    },
    info: {
        bg: "#eff6ff",
        border: "#bfdbfe",
        text: "#1e40af",
        iconBg: "#3b82f6",
        icon: (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
        ),
    },
};

// ────────────────────────────────────────────────────────────
// Individual Toast component
// ────────────────────────────────────────────────────────────

function ToastCard({
    toast,
    onDismiss,
}: {
    toast: ToastItem;
    onDismiss: () => void;
}) {
    const cfg = TOAST_CONFIG[toast.type];

    return (
        <div
            role="alert"
            aria-live="assertive"
            className={toast.leaving ? "animate-toast-out" : "animate-toast-in"}
            style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                padding: "14px 16px",
                borderRadius: "14px",
                border: `1px solid ${cfg.border}`,
                background: cfg.bg,
                color: cfg.text,
                boxShadow: "0 8px 24px rgba(0,0,0,0.1), 0 2px 6px rgba(0,0,0,0.06)",
                maxWidth: "360px",
                pointerEvents: "all",
            }}
        >
            {/* Icon */}
            <div
                style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: cfg.iconBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: "1px",
                }}
            >
                {cfg.icon}
            </div>

            {/* Message */}
            <p style={{ fontSize: 14, fontWeight: 500, flex: 1, lineHeight: "1.5" }}>
                {toast.message}
            </p>

            {/* Dismiss */}
            <button
                onClick={onDismiss}
                aria-label="Dismiss notification"
                style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: cfg.text,
                    opacity: 0.45,
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                    flexShrink: 0,
                    marginTop: "2px",
                    transition: "opacity 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.45")}
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>
        </div>
    );
}

// ────────────────────────────────────────────────────────────
// Provider
// ────────────────────────────────────────────────────────────

const AUTO_DISMISS_MS = 4500;

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const removeToast = useCallback((id: string) => {
        // Mark as leaving so the exit animation plays
        setToasts((prev) =>
            prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
        );
        // Remove from DOM after animation finishes
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 350);
    }, []);

    const showToast = useCallback(
        (message: string, type: ToastType = "info") => {
            const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
            setToasts((prev) => [...prev, { id, message, type, leaving: false }]);
            const timer = setTimeout(() => removeToast(id), AUTO_DISMISS_MS);
            // Cleanup if component unmounts
            return () => clearTimeout(timer);
        },
        [removeToast]
    );

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast container — fixed top-right */}
            <div
                aria-live="polite"
                style={{
                    position: "fixed",
                    top: 20,
                    right: 20,
                    zIndex: 9999,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    pointerEvents: "none",
                }}
            >
                {toasts.map((toast) => (
                    <ToastCard
                        key={toast.id}
                        toast={toast}
                        onDismiss={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

// ────────────────────────────────────────────────────────────
// Hook
// ────────────────────────────────────────────────────────────

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
    return ctx;
}
