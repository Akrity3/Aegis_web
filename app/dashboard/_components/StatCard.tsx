import React from "react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface StatCardProps {
    /** Display title above the value */
    title: string;
    /** Primary value (large text) */
    value: string | number;
    /** Optional short description below value */
    description?: string;
    /** Icon rendered in the icon box */
    icon: React.ReactNode;
    /** Hex / CSS colour for the icon box background tint */
    iconColor?: string;
    /** Optional badge text (e.g. "Active", "Protected") */
    badge?: string;
    /** Badge variant */
    badgeVariant?: "success" | "warning" | "danger" | "neutral";
    /** Animation stagger class */
    animClass?: string;
    /** Optional click handler */
    onClick?: () => void;
}

// ─────────────────────────────────────────────
// Badge colours
// ─────────────────────────────────────────────
const BADGE_STYLES: Record<string, React.CSSProperties> = {
    success: { background: "#dcfce7", color: "#166534", border: "1px solid #bbf7d0" },
    warning: { background: "#fffbeb", color: "#92400e", border: "1px solid #fde68a" },
    danger:  { background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" },
    neutral: { background: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0" },
};

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export default function StatCard({
    title,
    value,
    description,
    icon,
    iconColor = "#16a34a",
    badge,
    badgeVariant = "neutral",
    animClass = "",
    onClick,
}: StatCardProps) {
    const isClickable = !!onClick;

    return (
        <div
            onClick={onClick}
            className={`animate-fade-in-up ${animClass}`}
            style={{
                background: "#ffffff",
                borderRadius: 18,
                border: "1px solid #e2e8f0",
                padding: "22px 24px",
                boxShadow: "var(--shadow-sm)",
                transition: "box-shadow 0.2s ease, transform 0.2s ease",
                cursor: isClickable ? "pointer" : "default",
            }}
            onMouseEnter={(e) => {
                if (isClickable) {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-md)";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                } else {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-md)";
                }
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-sm)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
            }}
        >
            {/* Header row: icon + badge */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                {/* Icon */}
                <div
                    style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: `${iconColor}18`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: iconColor,
                    }}
                >
                    {icon}
                </div>

                {/* Badge */}
                {badge && (
                    <span
                        style={{
                            fontSize: 11,
                            fontWeight: 600,
                            letterSpacing: "0.3px",
                            padding: "4px 10px",
                            borderRadius: 999,
                            ...BADGE_STYLES[badgeVariant],
                        }}
                    >
                        {badge}
                    </span>
                )}
            </div>

            {/* Title */}
            <p style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>
                {title}
            </p>

            {/* Value */}
            <p style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", lineHeight: 1.2, marginBottom: description ? 6 : 0 }}>
                {value}
            </p>

            {/* Description */}
            {description && (
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>
                    {description}
                </p>
            )}
        </div>
    );
}
