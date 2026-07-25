"use client";

import { useState, useTransition, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/schemas";

const MAX_CHARS = 5000;
const MIN_CHARS = 20;
const MAX_MB = MAX_IMAGE_BYTES / (1024 * 1024); // 5

type Mode = "teks" | "gambar";

interface ImagePreview {
    objectUrl: string;
    name: string;
    sizeLabel: string;
    file: File;
}

export default function PeriksaForm() {
    const [mode, setMode] = useState<Mode>("teks");

    // ── Teks state ──────────────────────────────────────────────────────────
    const [text, setText] = useState("");
    const [textError, setTextError] = useState<string | null>(null);

    // ── Gambar state ────────────────────────────────────────────────────────
    const [imagePreview, setImagePreview] = useState<ImagePreview | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ── Shared state ────────────────────────────────────────────────────────
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    // Cleanup object URL on unmount
    useEffect(() => {
        return () => {
            if (imagePreview?.objectUrl) {
                URL.revokeObjectURL(imagePreview.objectUrl);
            }
        };
    }, [imagePreview?.objectUrl]);

    // ── Helpers ─────────────────────────────────────────────────────────────

    function formatBytes(bytes: number): string {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }

    const clearImage = useCallback(() => {
        if (imagePreview?.objectUrl) {
            URL.revokeObjectURL(imagePreview.objectUrl);
        }
        setImagePreview(null);
        setImageError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }, [imagePreview]);

    function handleModeSwitch(next: Mode) {
        if (next === mode) return;
        setMode(next);
        setTextError(null);
        setImageError(null);
    }

    // ── File input handler ──────────────────────────────────────────────────

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        // Revoke previous object URL before creating new one
        if (imagePreview?.objectUrl) {
            URL.revokeObjectURL(imagePreview.objectUrl);
        }
        setImageError(null);

        // Client-side MIME validation
        if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
            setImagePreview(null);
            setImageError("Format gambar tidak didukung. Gunakan JPEG, PNG, atau WebP.");
            return;
        }

        // Client-side size validation
        if (file.size > MAX_IMAGE_BYTES) {
            setImagePreview(null);
            setImageError(`Ukuran gambar melebihi batas ${MAX_MB} MB.`);
            return;
        }

        setImagePreview({
            objectUrl: URL.createObjectURL(file),
            name: file.name,
            sizeLabel: formatBytes(file.size),
            file,
        });
    }

    // ── Submit handlers ─────────────────────────────────────────────────────

    function handleTextSubmit(e: React.FormEvent) {
        e.preventDefault();
        setTextError(null);

        if (text.length < MIN_CHARS) {
            setTextError(`Pesan terlalu pendek. Minimal ${MIN_CHARS} karakter.`);
            return;
        }
        if (text.length > MAX_CHARS) {
            setTextError(`Pesan terlalu panjang. Maksimal ${MAX_CHARS} karakter.`);
            return;
        }

        startTransition(async () => {
            try {
                const res = await fetch("/api/analyze", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text }),
                });
                const data = await res.json();
                if (!res.ok) {
                    setTextError(data.error ?? "Terjadi kesalahan. Silakan coba lagi.");
                    return;
                }
                router.push(`/hasil/${data.id}`);
            } catch {
                setTextError("Gagal terhubung ke server. Periksa koneksi internet Anda.");
            }
        });
    }

    function handleImageSubmit(e: React.FormEvent) {
        e.preventDefault();
        setImageError(null);

        if (!imagePreview) {
            setImageError("Pilih gambar terlebih dahulu.");
            return;
        }

        startTransition(async () => {
            try {
                // Biarkan browser membuat multipart boundary secara otomatis
                const formData = new FormData();
                formData.append("image", imagePreview.file);

                const res = await fetch("/api/analyze", {
                    method: "POST",
                    body: formData,
                    // Content-Type TIDAK diset manual — browser menangani boundary
                });
                const data = await res.json();
                if (!res.ok) {
                    setImageError(data.error ?? "Terjadi kesalahan. Silakan coba lagi.");
                    return;
                }
                router.push(`/hasil/${data.id}`);
            } catch {
                setImageError("Gagal terhubung ke server. Periksa koneksi internet Anda.");
            }
        });
    }

    // ── Derived ─────────────────────────────────────────────────────────────

    const charCount = text.length;
    const isUnderMin = charCount < MIN_CHARS;
    const isOverMax = charCount > MAX_CHARS;
    const canSubmitText = charCount >= MIN_CHARS && charCount <= MAX_CHARS && !isPending;
    const canSubmitImage = !!imagePreview && !isPending;

    function getCharCountColor() {
        if (isOverMax) return "text-red-600";
        if (charCount > MAX_CHARS * 0.9) return "text-amber-600";
        return "text-gray-400";
    }

    // ── Render ───────────────────────────────────────────────────────────────

    return (
        <div className="space-y-5">
            {/* Tab switcher */}
            <div
                className="flex rounded-xl p-1 gap-1"
                style={{ background: "var(--background)", border: "1px solid var(--border)" }}
            >
                {(["teks", "gambar"] as Mode[]).map((m) => (
                    <button
                        key={m}
                        type="button"
                        onClick={() => handleModeSwitch(m)}
                        disabled={isPending}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer disabled:opacity-50"
                        style={
                            mode === m
                                ? { background: "var(--primary)", color: "#fff" }
                                : { color: "var(--muted)" }
                        }
                    >
                        {m === "teks" ? (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                </svg>
                                Tempel Teks
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Unggah Screenshot
                            </>
                        )}
                    </button>
                ))}
            </div>

            {/* Privacy warning */}
            <div className="flex gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
                <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                    <p className="text-sm font-semibold text-amber-800">Jaga Kerahasiaan Data Anda</p>
                    <p className="text-sm text-amber-700 mt-0.5">
                        {mode === "gambar"
                            ? <>Sebelum mengunggah, <strong>samarkan atau crop</strong> bagian yang mengandung OTP, PIN, nomor kartu, CVV, nomor rekening, alamat lengkap, dan data sensitif lainnya.</>
                            : <>Jangan masukkan <strong>password, PIN, OTP, CVV, nomor kartu</strong>, atau data pribadi sensitif lainnya.</>
                        }
                    </p>
                </div>
            </div>

            {/* ── MODE TEKS ── */}
            {mode === "teks" && (
                <form onSubmit={handleTextSubmit} className="card p-6 space-y-4">
                    <div>
                        <label
                            htmlFor="message-input"
                            className="block text-sm font-medium mb-2"
                            style={{ color: "var(--foreground)" }}
                        >
                            Tempel pesan mencurigakan
                        </label>
                        <div className="relative">
                            <textarea
                                id="message-input"
                                value={text}
                                onChange={(e) => {
                                    setText(e.target.value);
                                    if (textError) setTextError(null);
                                }}
                                disabled={isPending}
                                placeholder='Contoh: "Selamat! Anda memenangkan hadiah senilai Rp 50.000.000. Klik link berikut untuk mengklaim..."'
                                rows={8}
                                className="input-field resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                                style={{ paddingBottom: "2rem" }}
                            />
                            <span className={`absolute bottom-2 right-3 text-xs font-mono ${getCharCountColor()}`}>
                                {charCount.toLocaleString("id-ID")}/{MAX_CHARS.toLocaleString("id-ID")}
                            </span>
                        </div>
                        {isUnderMin && charCount > 0 && (
                            <p className="text-xs mt-1 text-amber-600">
                                Tambahkan {MIN_CHARS - charCount} karakter lagi
                            </p>
                        )}
                    </div>

                    {textError && (
                        <div className="alert-error flex items-start gap-2">
                            <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>{textError}</span>
                        </div>
                    )}

                    <SubmitButton pending={isPending} disabled={!canSubmitText} />
                </form>
            )}

            {/* ── MODE GAMBAR ── */}
            {mode === "gambar" && (
                <form onSubmit={handleImageSubmit} className="card p-6 space-y-4">
                    {imagePreview ? (
                        /* Preview */
                        <div className="space-y-3">
                            <div
                                className="relative rounded-xl overflow-hidden border"
                                style={{ borderColor: "var(--border)" }}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={imagePreview.objectUrl}
                                    alt="Preview screenshot"
                                    className="w-full max-h-72 object-contain"
                                    style={{ background: "#f8fafc" }}
                                />
                                <button
                                    type="button"
                                    onClick={clearImage}
                                    disabled={isPending}
                                    title="Hapus gambar"
                                    className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center bg-black/60 hover:bg-black/80 transition-colors cursor-pointer disabled:opacity-50"
                                >
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex items-center justify-between text-sm" style={{ color: "var(--muted)" }}>
                                <span className="truncate max-w-[70%]">📄 {imagePreview.name}</span>
                                <span className="shrink-0">{imagePreview.sizeLabel}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isPending}
                                className="text-sm font-medium hover:underline cursor-pointer disabled:opacity-50"
                                style={{ color: "var(--primary)" }}
                            >
                                Ganti gambar
                            </button>
                        </div>
                    ) : (
                        /* Drop zone */
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isPending}
                            className="w-full flex flex-col items-center justify-center gap-3 py-12 rounded-xl border-2 border-dashed transition-colors cursor-pointer disabled:opacity-50 hover:border-rose-300 hover:bg-rose-50/50"
                            style={{ borderColor: "var(--border)" }}
                        >
                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                                style={{ background: "var(--background)" }}
                            >
                                <svg className="w-7 h-7" style={{ color: "var(--primary)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                                    Klik untuk pilih screenshot
                                </p>
                                <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                                    JPEG, PNG, WebP · Maks. {MAX_MB} MB
                                </p>
                            </div>
                        </button>
                    )}

                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={isPending}
                    />

                    {imageError && (
                        <div className="alert-error flex items-start gap-2">
                            <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>{imageError}</span>
                        </div>
                    )}

                    <SubmitButton pending={isPending} disabled={!canSubmitImage} label="Periksa Screenshot" />
                </form>
            )}

            {/* Tips */}
            <div className="card p-5">
                <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>
                    💡 Tips pemeriksaan
                </h3>
                <ul className="space-y-2 text-sm" style={{ color: "var(--muted)" }}>
                    {mode === "teks" ? (
                        <>
                            <li className="flex items-start gap-2">
                                <span className="mt-0.5">•</span>
                                <span>Tempel isi pesan selengkapnya untuk hasil analisis yang lebih akurat</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-0.5">•</span>
                                <span>Cocok untuk SMS, WhatsApp, email, atau chat yang mencurigakan</span>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="flex items-start gap-2">
                                <span className="mt-0.5">•</span>
                                <span>Pastikan teks dalam screenshot terlihat jelas dan tidak buram</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-0.5">•</span>
                                <span>Crop area yang berisi pesan utama untuk hasil optimal</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-0.5">•</span>
                                <span>Samarkan data sensitif (OTP, PIN, nomor kartu) sebelum mengunggah</span>
                            </li>
                        </>
                    )}
                    <li className="flex items-start gap-2">
                        <span className="mt-0.5">•</span>
                        <span>Hasil analisis bersifat edukatif sebagai pemeriksaan awal, bukan kepastian hukum</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}

// ─── Shared submit button ─────────────────────────────────────────────────────

function SubmitButton({
    pending,
    disabled,
    label = "Periksa Sekarang",
}: {
    pending: boolean;
    disabled: boolean;
    label?: string;
}) {
    return (
        <button
            type="submit"
            disabled={disabled}
            className="inline-flex items-center justify-center gap-2 w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition-colors text-base cursor-pointer"
        >
            {pending ? (
                <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sedang menganalisis…
                </>
            ) : (
                <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    {label}
                </>
            )}
        </button>
    );
}
