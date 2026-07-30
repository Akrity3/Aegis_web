"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminReportsPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to Incidents page as Reports is essentially incident management
        router.replace("/admin/incidents");
    }, [router]);

    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" className="animate-spin">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
        </div>
    );
}
