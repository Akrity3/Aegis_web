import type { Metadata } from "next";
import DashboardShell from "./_components/DashboardShell";

export const metadata: Metadata = {
    title: {
        template: "%s | Aegis+ Dashboard",
        default: "Dashboard | Aegis+",
    },
    description: "Aegis+ personal safety dashboard",
};

/**
 * Persistent dashboard layout.
 * Renders the DashboardShell (client component) which contains
 * the Sidebar, Navbar, ToastProvider and the scrollable content area.
 */
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <DashboardShell>{children}</DashboardShell>;
}
