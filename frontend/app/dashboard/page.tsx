import Image from "next/image";
import Link from "next/link";
import { getUserData } from "@/lib/cookies";

export default async function DashboardPage() {
  const user = await getUserData();
  const name = user?.fullName || user?.email || "User";

  return (
    <div style={{ minHeight: "100vh", background: "#f0fdf4", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 32px", background: "#fff", borderBottom: "1px solid #e2e8f0",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Image src="/logo.png" alt="Aegis+ Logo" width={40} height={40} style={{ borderRadius: 8 }} />
          <span style={{ fontWeight: 800, fontSize: 22 }}>
            Aegis<span style={{ color: "#dc2626" }}>+</span>
          </span>
        </div>
        <Link href="/login" style={{ color: "#16a34a", fontWeight: 600, textDecoration: "none", fontSize: 14 }}>
          Sign out
        </Link>
      </header>

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "48px 32px" }}>
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", color: "#64748b", textTransform: "uppercase", marginBottom: 8 }}>
          Dashboard
        </p>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>
          Welcome, {name}
        </h1>
        <p style={{ color: "#64748b", fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
          You are signed in to Aegis+. Your safety alerts and incident reports will appear here in upcoming sprints.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {[
            { title: "Active Alerts", value: "0", color: "#dc2626" },
            { title: "Reports Sent", value: "0", color: "#16a34a" },
            { title: "Safe Zones", value: "—", color: "#2563eb" },
          ].map((card) => (
            <div key={card.title} style={{
              background: "#fff", borderRadius: 12, padding: "20px 22px",
              border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}>
              <p style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>{card.title}</p>
              <p style={{ fontSize: 28, fontWeight: 800, color: card.color }}>{card.value}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
