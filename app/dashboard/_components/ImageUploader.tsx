"use client";

import { useState, useRef, useCallback, useEffect } from "react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface ImageUploaderProps {
    /** URL of the currently saved image (used as initial preview) */
    currentImageUrl?: string | null;
    /** Initials shown when there is no image */
    initials?: string;
    /** Called whenever the selected file changes (null = removed) */
    onFileChange: (file: File | null) => void;
}

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export default function ImageUploader({
    currentImageUrl,
    initials = "U",
    onFileChange,
}: ImageUploaderProps) {
    const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
    const [dragging, setDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dragCounter = useRef(0);

    // Keep preview in sync when parent passes a new currentImageUrl
    useEffect(() => {
        setPreview(currentImageUrl || null);
    }, [currentImageUrl]);

    const validateFile = (file: File): string | null => {
        if (!ACCEPTED_TYPES.includes(file.type)) {
            return "Please upload a valid image (JPEG, PNG, WebP or GIF)";
        }
        if (file.size > MAX_SIZE_BYTES) {
            return "Image must be smaller than 5 MB";
        }
        return null;
    };

    const handleFile = useCallback(
        (file: File | null | undefined) => {
            if (!file) return;
            const err = validateFile(file);
            if (err) {
                setError(err);
                return;
            }
            setError(null);
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            onFileChange(file);
        },
        [onFileChange]
    );

    const handleRemove = () => {
        setPreview(null);
        setError(null);
        onFileChange(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        dragCounter.current++;
        setDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        dragCounter.current--;
        if (dragCounter.current === 0) setDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        dragCounter.current = 0;
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        handleFile(file);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFile(e.target.files?.[0]);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            {/* Drop zone */}
            <div
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={handleDragEnter}
                onDragOver={(e) => e.preventDefault()}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 14,
                    width: 260,
                    minHeight: 220,
                    borderRadius: 20,
                    border: `2px dashed ${dragging ? "#16a34a" : error ? "#dc2626" : "#d1d5db"}`,
                    background: dragging ? "#f0fdf4" : "#fafafa",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    transform: dragging ? "scale(1.02)" : "scale(1)",
                }}
            >
                {preview ? (
                    <>
                        {/* Preview image */}
                        <div
                            style={{
                                position: "relative",
                                width: 112,
                                height: 112,
                                borderRadius: 18,
                                overflow: "hidden",
                                border: "3px solid white",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                            }}
                        >
                            <img
                                src={preview}
                                alt="Preview"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <p style={{ fontSize: 13, fontWeight: 600, color: "#16a34a" }}>
                                ✓ Image ready to upload
                            </p>
                            <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                                Click to change image
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Initials avatar placeholder */}
                        <div
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: 18,
                                background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 28,
                                fontWeight: 800,
                                color: "#16a34a",
                            }}
                        >
                            {initials}
                        </div>

                        {/* Upload icon + text */}
                        <div style={{ textAlign: "center", paddingInline: 16 }}>
                            <div style={{ marginBottom: 8, color: "#94a3b8" }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto" }}>
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="17 8 12 3 7 8" />
                                    <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                            </div>
                            <p style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                                Drag & drop or{" "}
                                <span style={{ color: "#16a34a" }}>browse</span>
                            </p>
                            <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>
                                JPEG, PNG, WebP · Max 5 MB
                            </p>
                        </div>
                    </>
                )}

                {/* Drag overlay */}
                {dragging && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: 18,
                            background: "rgba(22,163,74,0.06)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "2px solid #16a34a",
                        }}
                    >
                        <p style={{ fontSize: 14, fontWeight: 700, color: "#16a34a" }}>
                            Drop your image here
                        </p>
                    </div>
                )}
            </div>

            {/* Remove button */}
            {preview && (
                <button
                    type="button"
                    onClick={handleRemove}
                    style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#dc2626",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "4px 8px",
                        borderRadius: 6,
                        transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#fef2f2")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                >
                    × Remove image
                </button>
            )}

            {/* Validation error */}
            {error && (
                <div
                    style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: "#dc2626",
                        background: "#fef2f2",
                        border: "1px solid #fecaca",
                        borderRadius: 8,
                        padding: "8px 14px",
                        maxWidth: 260,
                        textAlign: "center",
                    }}
                >
                    {error}
                </div>
            )}

            {/* Hidden input */}
            <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_TYPES.join(",")}
                onChange={handleInputChange}
                style={{ display: "none" }}
            />
        </div>
    );
}
