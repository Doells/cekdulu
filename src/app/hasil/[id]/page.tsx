import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import RiskBadge from "@/components/RiskBadge";
import Link from "next/link";

export default async function HasilPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: analysis, error } = await supabase
        .from("analyses")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

    if (error || !analysis) {
        notFound();
    }

    const displayName =
        user.user_metadata?.full_name || user.email?.split("@")[0] || "Pengguna";

    const score: number = analysis.risk_score;
    const level: string = analysis.risk_level;

    // Warna skor berdasarkan level
    function getScoreColor() {
        if (level === "tinggi") return "#E11D48";
        if (level === "sedang") return "#D97706";
        return "#16A34A";
    }

    function getScoreBgColor() {
        if (level === "tinggi") return "#FFF1F2";
        if (level === "sedang") return "#FFFBEB";
        return "#F0FDF4";
    }

    const indicators: string[] = Array.isArray(analysis.indicators)
        ? analysis.indicators
        : [];
    const recommendations: string[] = Array.isArray(analysis.recommendations)
        ? analysis.recommendations
        : [];

    const formattedDate = new Date(analysis.created_at).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className="min-h-screen" style={{ background: "var(--background)" }}>
            <Navbar email={user.email ?? ""} displayName={displayName} />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm" style={{ color: "var(--muted)" }}>
                    <Link href="/dashboard" className="hover:underline" style={{ color: "var(--primary)" }}>
                        Dashboard
                    </Link>
                    <span>/</span>
                    <Link href="/riwayat" className="hover:underline" style={{ color: "var(--primary)" }}>
                        Riwayat
                    </Link>
                    <span>/</span>
                    <span>Hasil Analisis</span>
                </div>

                {/* Header card */}
                <div className="card p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                        <div>
                            <h1 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
                                Hasil Analisis Pesan
                            </h1>
                            <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
                                {formattedDate}
                            </p>
                        </div>
                        <RiskBadge level={level} />
                    </div>

                    {/* Skor risiko */}
                    <div
                        className="flex items-center gap-4 p-4 rounded-xl mb-4"
                        style={{ backgroundColor: getScoreBgColor() }}
                    >
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 font-bold text-xl"
                            style={{ backgroundColor: getScoreColor(), color: "white" }}
                        >
                            {score}
                        </div>
                        <div>
                            <p className="font-semibold" style={{ color: getScoreColor() }}>
                                Skor Risiko: {score}/100
                            </p>
                            <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
                                {level === "tinggi"
                                    ? "Pesan ini sangat berisiko. Harap berhati-hati."
                                    : level === "sedang"
                                        ? "Pesan ini perlu diwaspadai."
                                        : "Pesan ini tampak relatif aman."}
                            </p>
                        </div>
                    </div>

                    {/* Dugaan modus */}
                    <div className="flex flex-wrap gap-2">
                        <span className="text-sm font-medium" style={{ color: "var(--muted)" }}>
                            Dugaan modus:
                        </span>
                        <span
                            className="text-sm font-semibold px-2 py-0.5 rounded-md"
                            style={{
                                backgroundColor: "var(--primary-light)",
                                color: "var(--primary)",
                            }}
                        >
                            {analysis.scam_type || "Tidak terdeteksi"}
                        </span>
                    </div>
                </div>

                {/* Pesan yang dianalisis */}
                <div className="card p-6">
                    <h2 className="text-base font-semibold mb-3" style={{ color: "var(--foreground)" }}>
                        📋 Pesan yang Dianalisis
                    </h2>
                    <p
                        className="text-sm whitespace-pre-wrap rounded-lg p-3 leading-relaxed"
                        style={{
                            background: "var(--background)",
                            color: "var(--foreground)",
                            border: "1px solid var(--border)",
                        }}
                    >
                        {analysis.input_text}
                    </p>
                </div>

                {/* Penjelasan */}
                <div className="card p-6">
                    <h2 className="text-base font-semibold mb-3" style={{ color: "var(--foreground)" }}>
                        🔍 Penjelasan Analisis
                    </h2>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                        {analysis.explanation}
                    </p>
                </div>

                {/* Indikator mencurigakan */}
                {indicators.length > 0 && (
                    <div className="card p-6">
                        <h2 className="text-base font-semibold mb-3" style={{ color: "var(--foreground)" }}>
                            ⚠️ Indikator Mencurigakan
                        </h2>
                        <ul className="space-y-2">
                            {indicators.map((item: string, i: number) => (
                                <li key={i} className="flex items-start gap-2.5 text-sm">
                                    <span
                                        className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                                        style={{
                                            backgroundColor: "var(--primary-light)",
                                            color: "var(--primary)",
                                        }}
                                    >
                                        !
                                    </span>
                                    <span style={{ color: "var(--foreground)" }}>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Rekomendasi */}
                {recommendations.length > 0 && (
                    <div className="card p-6">
                        <h2 className="text-base font-semibold mb-3" style={{ color: "var(--foreground)" }}>
                            ✅ Rekomendasi Tindakan
                        </h2>
                        <ul className="space-y-2">
                            {recommendations.map((item: string, i: number) => (
                                <li key={i} className="flex items-start gap-2.5 text-sm">
                                    <span
                                        className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                                        style={{ backgroundColor: "#DCFCE7", color: "#16A34A" }}
                                    >
                                        ✓
                                    </span>
                                    <span style={{ color: "var(--foreground)" }}>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Disclaimer */}
                <div
                    className="flex gap-3 p-4 rounded-xl text-sm"
                    style={{
                        backgroundColor: "#F8FAFC",
                        border: "1px solid var(--border)",
                        color: "var(--muted)",
                    }}
                >
                    <svg
                        className="w-5 h-5 shrink-0 mt-0.5 text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>
                        <strong>Disclaimer:</strong> Hasil ini merupakan pemeriksaan awal berbasis AI dan
                        bersifat edukatif. Bukan merupakan kepastian hukum. Selalu gunakan penilaian
                        pribadi dan konsultasikan kejahatan siber kepada pihak berwenang.
                    </span>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/periksa"
                        className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
                    >
                        Periksa Pesan Lain
                    </Link>
                    <Link
                        href="/riwayat"
                        className="inline-flex items-center gap-2 border-2 border-gray-200 hover:bg-gray-50 font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
                        style={{ color: "var(--foreground)" }}
                    >
                        Lihat Semua Riwayat
                    </Link>
                </div>
            </main>
        </div>
    );
}
