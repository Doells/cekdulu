"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const MAX_CHARS = 5000;
const MIN_CHARS = 20;

export default function PeriksaForm() {
    const [text, setText] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const charCount = text.length;
    const isUnderMin = charCount < MIN_CHARS;
    const isOverMax = charCount > MAX_CHARS;
    const canSubmit = charCount >= MIN_CHARS && charCount <= MAX_CHARS && !isPending;

    function getCharCountColor() {
        if (isOverMax) return "text-red-600";
        if (charCount > MAX_CHARS * 0.9) return "text-amber-600";
        return "text-gray-400";
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (isUnderMin) {
            setError(`Pesan terlalu pendek. Minimal ${MIN_CHARS} karakter.`);
            return;
        }
        if (isOverMax) {
            setError(`Pesan terlalu panjang. Maksimal ${MAX_CHARS} karakter.`);
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
                    setError(data.error ?? "Terjadi kesalahan. Silakan coba lagi.");
                    return;
                }

                router.push(`/hasil/${data.id}`);
            } catch {
                setError("Gagal terhubung ke server. Periksa koneksi internet Anda.");
            }
        });
    }

    return (
        <div className="space-y-5">
            {/* Peringatan data sensitif */}
            <div className="flex gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
                <svg
                    className="w-5 h-5 text-amber-600 shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                </svg>
                <div>
                    <p className="text-sm font-semibold text-amber-800">Jaga Kerahasiaan Data Anda</p>
                    <p className="text-sm text-amber-700 mt-0.5">
                        Jangan masukkan <strong>password, PIN, OTP, CVV, nomor kartu</strong>, atau data
                        pribadi sensitif lainnya ke dalam kolom ini.
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="card p-6 space-y-4">
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
                                if (error) setError(null);
                            }}
                            disabled={isPending}
                            placeholder="Contoh: &quot;Selamat! Anda memenangkan hadiah senilai Rp 50.000.000. Klik link berikut untuk mengklaim...&quot;"
                            rows={8}
                            className="input-field resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                            style={{ paddingBottom: "2rem" }}
                        />
                        {/* Char counter */}
                        <span
                            className={`absolute bottom-2 right-3 text-xs font-mono ${getCharCountColor()}`}
                        >
                            {charCount.toLocaleString("id-ID")}/{MAX_CHARS.toLocaleString("id-ID")}
                        </span>
                    </div>
                    {isUnderMin && charCount > 0 && (
                        <p className="text-xs mt-1 text-amber-600">
                            Tambahkan {MIN_CHARS - charCount} karakter lagi
                        </p>
                    )}
                </div>

                {error && (
                    <div className="alert-error flex items-start gap-2">
                        <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={!canSubmit}
                    className="inline-flex items-center justify-center gap-2 w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition-colors text-base cursor-pointer"
                >
                    {isPending ? (
                        <>
                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                            </svg>
                            Sedang menganalisis…
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Periksa Sekarang
                        </>
                    )}
                </button>
            </form>

            {/* Tips */}
            <div className="card p-5">
                <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>
                    💡 Tips pemeriksaan
                </h3>
                <ul className="space-y-2 text-sm" style={{ color: "var(--muted)" }}>
                    <li className="flex items-start gap-2">
                        <span className="mt-0.5">•</span>
                        <span>Tempel isi pesan selengkapnya untuk hasil analisis yang lebih akurat</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="mt-0.5">•</span>
                        <span>Cocok untuk SMS, WhatsApp, email, atau chat yang mencurigakan</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="mt-0.5">•</span>
                        <span>Hasil analisis bersifat edukatif, bukan kepastian hukum</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
