/** Reusable skeleton loader components for loading states */

// ─────────────────────────────────────────────
// Base skeleton block
// ─────────────────────────────────────────────
interface SkeletonBlockProps {
    width?: string;
    height?: string;
    className?: string;
    rounded?: string;
}

export function SkeletonBlock({
    width = "100%",
    height = "16px",
    className = "",
    rounded = "8px",
}: SkeletonBlockProps) {
    return (
        <div
            className={`animate-shimmer ${className}`}
            style={{ width, height, borderRadius: rounded, flexShrink: 0 }}
        />
    );
}

// ─────────────────────────────────────────────
// Skeleton for profile avatar
// ─────────────────────────────────────────────
export function SkeletonAvatar({ size = 48 }: { size?: number }) {
    return (
        <div
            className="animate-shimmer flex-shrink-0"
            style={{ width: size, height: size, borderRadius: "50%" }}
        />
    );
}

// ─────────────────────────────────────────────
// Skeleton card (generic)
// ─────────────────────────────────────────────
export function SkeletonCard({ className = "" }: { className?: string }) {
    return (
        <div
            className={`rounded-2xl border border-slate-100 p-6 bg-white ${className}`}
            style={{ boxShadow: "var(--shadow-sm)" }}
        >
            <div className="flex items-center gap-3 mb-4">
                <SkeletonBlock width="40px" height="40px" rounded="10px" />
                <div className="flex-1 space-y-2">
                    <SkeletonBlock width="55%" height="14px" />
                    <SkeletonBlock width="30%" height="11px" />
                </div>
            </div>
            <SkeletonBlock height="32px" className="mb-2" />
            <SkeletonBlock width="70%" height="11px" />
        </div>
    );
}

// ─────────────────────────────────────────────
// Skeleton for the dashboard welcome section
// ─────────────────────────────────────────────
export function SkeletonWelcome() {
    return (
        <div className="mb-8">
            <SkeletonBlock width="180px" height="13px" className="mb-3" />
            <SkeletonBlock width="380px" height="36px" className="mb-2" />
            <SkeletonBlock width="260px" height="16px" />
        </div>
    );
}

// ─────────────────────────────────────────────
// Skeleton stat card grid
// ─────────────────────────────────────────────
export function SkeletonStatGrid({ count = 4 }: { count?: number }) {
    return (
        <div
            className="grid gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}
        >
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
}

// ─────────────────────────────────────────────
// Skeleton for profile page (me)
// ─────────────────────────────────────────────
export function SkeletonProfile() {
    return (
        <div className="space-y-6">
            {/* Header card */}
            <div
                className="rounded-2xl bg-white border border-slate-100 p-8 flex flex-col items-center gap-4"
                style={{ boxShadow: "var(--shadow-sm)" }}
            >
                <SkeletonAvatar size={100} />
                <div className="space-y-2 w-full flex flex-col items-center">
                    <SkeletonBlock width="200px" height="22px" />
                    <SkeletonBlock width="120px" height="14px" />
                    <SkeletonBlock width="80px" height="26px" rounded="999px" />
                </div>
            </div>
            {/* Info cards */}
            <div className="grid gap-4 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="rounded-2xl bg-white border border-slate-100 p-5" style={{ boxShadow: "var(--shadow-sm)" }}>
                        <SkeletonBlock width="40%" height="12px" className="mb-3" />
                        <SkeletonBlock height="18px" />
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// Skeleton for form pages
// ─────────────────────────────────────────────
export function SkeletonForm() {
    return (
        <div className="space-y-5">
            {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                    <SkeletonBlock width="120px" height="12px" className="mb-2" />
                    <SkeletonBlock height="44px" rounded="12px" />
                </div>
            ))}
            <div className="flex justify-end pt-2">
                <SkeletonBlock width="140px" height="44px" rounded="12px" />
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// Sidebar skeleton (user card area)
// ─────────────────────────────────────────────
export function SkeletonSidebarUser() {
    return (
        <div className="flex items-center gap-3 px-3 py-2">
            <SkeletonAvatar size={36} />
            <div className="flex-1 space-y-1.5">
                <SkeletonBlock width="75%" height="12px" />
                <SkeletonBlock width="55%" height="10px" />
            </div>
        </div>
    );
}
