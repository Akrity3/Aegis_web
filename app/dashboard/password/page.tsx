"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/lib/api/axios-instance";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match",
    path: ["confirmNewPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function PasswordUpdatePage() {
  const { loading } = useAuth();
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const onSubmit = async (data: PasswordFormValues) => {
    setStatus(null);
    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post("/api/v1/auth/update", {
        currentPassword: data.currentPassword,
        password: data.newPassword,
      });

      if (response.data?.success) {
        setStatus({ type: "success", message: "Password changed successfully!" });
        reset();
      } else {
        setStatus({ type: "error", message: response.data?.message || "Failed to change password" });
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || "Failed to change password";
      setStatus({ type: "error", message: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="font-extrabold text-2xl tracking-tight">
              Aegis<span className="text-red-600">+</span>
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-slate-600 hover:text-emerald-700 text-sm font-semibold transition"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/profile"
            className="text-slate-600 hover:text-emerald-700 text-sm font-semibold transition"
          >
            Update Profile
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-slate-500 hover:text-emerald-600 text-sm flex items-center gap-1 mb-2 font-medium transition"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Change Password</h1>
          <p className="text-slate-500 mt-1">Change your account password. For security, do not reuse old passwords.</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {status && (
            <div
              className={`mb-6 p-4 rounded-xl text-sm font-medium ${
                status.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Current Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700">Current Password</label>
              <input
                type="password"
                {...register("currentPassword")}
                placeholder="••••••••"
                className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition ${
                  errors.currentPassword ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : ""
                }`}
              />
              {errors.currentPassword && (
                <span className="text-red-500 text-xs font-medium">{errors.currentPassword.message}</span>
              )}
            </div>

            <hr className="border-slate-100 my-6" />

            {/* New Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700">New Password</label>
              <input
                type="password"
                {...register("newPassword")}
                placeholder="••••••••"
                className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition ${
                  errors.newPassword ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : ""
                }`}
              />
              {errors.newPassword && (
                <span className="text-red-500 text-xs font-medium">{errors.newPassword.message}</span>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700">Confirm New Password</label>
              <input
                type="password"
                {...register("confirmNewPassword")}
                placeholder="••••••••"
                className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition ${
                  errors.confirmNewPassword ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : ""
                }`}
              />
              {errors.confirmNewPassword && (
                <span className="text-red-500 text-xs font-medium">{errors.confirmNewPassword.message}</span>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? "Changing..." : "Change Password"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
