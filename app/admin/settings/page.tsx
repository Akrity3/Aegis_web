"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/app/dashboard/_components/ToastContext";
import { getAdminSettings, updateAdminSettings, AdminSettings } from "@/lib/api/admin";

export default function AdminSettingsPage() {
    const toast = useToast();
    const [settings, setSettings] = useState<AdminSettings>({
        maintenanceMode: false,
        registrationEnabled: true,
        emailVerificationRequired: true,
        maxUsersPerSafetyCircle: 10,
        sosAlertCooldown: 300,
        incidentAutoVerify: false,
        defaultSearchRadius: 5000,
        notificationSettings: {
            emailEnabled: true,
            pushEnabled: true,
            smsEnabled: false,
        },
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Fetch settings on mount
    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            try {
                const response = await getAdminSettings();
                if (response.success) {
                    setSettings(response.data);
                } else {
                    toast.showToast(response.message || "Failed to fetch settings", "error");
                }
            } catch (err: any) {
                toast.showToast(err?.message || "Failed to fetch settings", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, [toast]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await updateAdminSettings(settings);
            if (response.success) {
                toast.showToast("Settings saved successfully", "success");
            } else {
                toast.showToast(response.message || "Failed to save settings", "error");
            }
        } catch (err: any) {
            toast.showToast(err?.message || "Failed to save settings", "error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="animate-fade-in-up" style={{ maxWidth: 800, margin: "0 auto" }}>
            {/* Page Header */}
            <div style={{ marginBottom: 28 }}>
                <h1
                    style={{
                        fontSize: 26,
                        fontWeight: 800,
                        color: "#0f172a",
                        letterSpacing: "-0.5px",
                        lineHeight: 1.2,
                        marginBottom: 6,
                    }}
                >
                    System Settings
                </h1>
                <p style={{ fontSize: 14, color: "#6b7280" }}>
                    Configure system-wide settings and preferences.
                </p>
            </div>

            {loading ? (
                <div style={{ padding: "64px 32px", textAlign: "center" }}>
                    <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#16a34a"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        className="animate-spin"
                    >
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                </div>
            ) : (
                <>
                    {/* Settings Form */}
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 16,
                            border: "1px solid #e5e7eb",
                            boxShadow: "var(--shadow-sm)",
                            padding: "32px",
                        }}
                    >
                {/* General Settings */}
                <div style={{ marginBottom: 32 }}>
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid #e5e7eb" }}>
                        General Settings
                    </h2>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                                <p style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                                    Maintenance Mode
                                </p>
                                <p style={{ fontSize: 13, color: "#6b7280" }}>
                                    Disable user access for system maintenance
                                </p>
                            </div>
                            <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                                <input
                                    type="checkbox"
                                    checked={settings.maintenanceMode}
                                    onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                                    style={{ width: 18, height: 18, marginRight: 8 }}
                                />
                                <span style={{ fontSize: 13, color: "#374151" }}>Enabled</span>
                            </label>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                                <p style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                                    User Registration
                                </p>
                                <p style={{ fontSize: 13, color: "#6b7280" }}>
                                    Allow new users to register
                                </p>
                            </div>
                            <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                                <input
                                    type="checkbox"
                                    checked={settings.registrationEnabled}
                                    onChange={(e) => setSettings({ ...settings, registrationEnabled: e.target.checked })}
                                    style={{ width: 18, height: 18, marginRight: 8 }}
                                />
                                <span style={{ fontSize: 13, color: "#374151" }}>Enabled</span>
                            </label>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                                <p style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                                    Email Verification
                                </p>
                                <p style={{ fontSize: 13, color: "#6b7280" }}>
                                    Require email verification for new accounts
                                </p>
                            </div>
                            <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                                <input
                                    type="checkbox"
                                    checked={settings.emailVerificationRequired}
                                    onChange={(e) => setSettings({ ...settings, emailVerificationRequired: e.target.checked })}
                                    style={{ width: 18, height: 18, marginRight: 8 }}
                                />
                                <span style={{ fontSize: 13, color: "#374151" }}>Required</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Safety Settings */}
                <div style={{ marginBottom: 32 }}>
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid #e5e7eb" }}>
                        Safety Features
                    </h2>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <div>
                            <p style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                                Max Users per Safety Circle
                            </p>
                            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
                                Maximum number of members in a safety circle
                            </p>
                            <input
                                type="number"
                                value={settings.maxUsersPerSafetyCircle}
                                onChange={(e) => setSettings({ ...settings, maxUsersPerSafetyCircle: parseInt(e.target.value) || 10 })}
                                style={{
                                    width: 200,
                                    padding: "10px 14px",
                                    borderRadius: 8,
                                    border: "1.5px solid #e5e7eb",
                                    fontSize: 14,
                                    color: "#0f172a",
                                    outline: "none",
                                }}
                            />
                        </div>

                        <div>
                            <p style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                                SOS Alert Cooldown (seconds)
                            </p>
                            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
                                Minimum time between SOS alerts
                            </p>
                            <input
                                type="number"
                                value={settings.sosAlertCooldown}
                                onChange={(e) => setSettings({ ...settings, sosAlertCooldown: parseInt(e.target.value) || 300 })}
                                style={{
                                    width: 200,
                                    padding: "10px 14px",
                                    borderRadius: 8,
                                    border: "1.5px solid #e5e7eb",
                                    fontSize: 14,
                                    color: "#0f172a",
                                    outline: "none",
                                }}
                            />
                        </div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                                <p style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                                    Auto-verify Incidents
                                </p>
                                <p style={{ fontSize: 13, color: "#6b7280" }}>
                                    Automatically verify incidents from trusted users
                                </p>
                            </div>
                            <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                                <input
                                    type="checkbox"
                                    checked={settings.incidentAutoVerify}
                                    onChange={(e) => setSettings({ ...settings, incidentAutoVerify: e.target.checked })}
                                    style={{ width: 18, height: 18, marginRight: 8 }}
                                />
                                <span style={{ fontSize: 13, color: "#374151" }}>Enabled</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 20, borderTop: "1px solid #e5e7eb" }}>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        style={{
                            padding: "12px 24px",
                            borderRadius: 10,
                            border: "none",
                            background: "#16a34a",
                            color: "#fff",
                            fontSize: 14,
                            fontWeight: 700,
                            cursor: saving ? "not-allowed" : "pointer",
                            opacity: saving ? 0.7 : 1,
                            transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => { if (!saving) e.currentTarget.style.background = "#15803d"; }}
                        onMouseLeave={(e) => { if (!saving) e.currentTarget.style.background = "#16a34a"; }}
                    >
                        {saving ? "Saving..." : "Save Settings"}
                    </button>
                </div>
                    </div>
                </>
            )}
        </div>
    );
}
