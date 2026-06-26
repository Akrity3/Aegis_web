"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/lib/api/axios-instance";

const profileSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  gender: z.string().optional(),
  phoneNumber: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileUpdatePage() {
  const { user, loading, refreshUser } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  // Prefill user details when user state loads
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender || "",
        phoneNumber: user.phoneNumber || "",
      });
      if (user.profilePicture) {
        setPreviewUrl(`/uploads/${user.profilePicture}`);
      }
    }
  }, [user, reset]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("image/")) {
        setStatus({ type: "error", message: "Please select an image file (JPEG/PNG)" });
        return;
      }
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setStatus(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      if (data.gender) formData.append("gender", data.gender);
      if (data.phoneNumber) formData.append("phoneNumber", data.phoneNumber);
      if (file) {
        formData.append("profilePicture", file);
      }

      const response = await axiosInstance.post("/api/v1/auth/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.success) {
        setStatus({ type: "success", message: "Profile updated successfully!" });
        await refreshUser();
      } else {
        setStatus({ type: "error", message: response.data?.message || "Failed to update profile" });
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || "Failed to update profile";
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
            href="/dashboard/password"
            className="text-slate-600 hover:text-emerald-700 text-sm font-semibold transition"
          >
            Change Password
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
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Update Profile</h1>
          <p className="text-slate-500 mt-1">Update your personal account details and profile image.</p>
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
            {/* Profile Avatar Upload */}
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="relative group cursor-pointer" onClick={triggerFileSelect}>
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-slate-200 relative bg-slate-100 flex items-center justify-center shadow-inner">
                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt="Avatar Preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="text-4xl text-slate-400 font-bold">
                      {user?.firstName?.[0] || "U"}
                    </span>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/45 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-250">
                  <span className="text-white text-xs font-semibold">Change Photo</span>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={triggerFileSelect}
                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition"
              >
                Upload new image
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700">First Name</label>
                <input
                  type="text"
                  {...register("firstName")}
                  className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition ${
                    errors.firstName ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : ""
                  }`}
                />
                {errors.firstName && (
                  <span className="text-red-500 text-xs font-medium">{errors.firstName.message}</span>
                )}
              </div>

              {/* Last Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700">Last Name</label>
                <input
                  type="text"
                  {...register("lastName")}
                  className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition ${
                    errors.lastName ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : ""
                  }`}
                />
                {errors.lastName && (
                  <span className="text-red-500 text-xs font-medium">{errors.lastName.message}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gender */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700">Gender</label>
                <select
                  {...register("gender")}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700">Phone Number</label>
                <input
                  type="text"
                  {...register("phoneNumber")}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                />
              </div>
            </div>

            {/* Read-only Username & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Username</span>
                <span className="text-slate-600 font-medium">{user?.username}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</span>
                <span className="text-slate-600 font-medium">{user?.email}</span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
