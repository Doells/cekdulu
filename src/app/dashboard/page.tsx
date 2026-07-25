import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import AnalysisCard, { type AnalysisSummary } from "@/components/AnalysisCard";
import Link from "next/link";

export default async function DashboardPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const displayName =
        user.user_metadata?.full_name || user.email?.split("@")[0] || "Pengguna";

    // Ambil data analisis: semua untuk statistik, 5 terbaru untuk tampilan
    const { data: allAnalyses } = await supabase
        .from("analyses")
        .select("id, input_text, risk_level, risk_score, scam_type, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    const analyses: AnalysisSummary[] = allAnalyses ?? [];
    const recent = analyses.slice(0, 5);

    // Hitung statistik
    const totalCount = analyses.length;
    const tinggiCount = analyses.filter((a) => a.risk_level === "tinggi").length;
    const sedangCount = analyses.filter((a) => a.risk_level === "sedang").length;
    const rendahCount = analyses.filter((a) => a.risk_level === "rendah").length;

    return (
        <div className="min-h-screen" style={{ background: "var(--background)" }}>
            <Navbar email={user.email ?? ""} displayName={displayName} />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Greeting */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--foreground)" }}>
                        Selamat datang, {displayName}! 👋
                    </h1>
                    <p className="mt-1" style={{ color: "var(--muted)" }}>
                        Lindungi diri Anda dari hoaks dan pesan berbahaya
                    </p>
                </div>

                {/* CTA Button */}
                <div className="mb-8">
                    <Link
                        href="/periksa"
                        className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-semibold px-8 py-3 rounded-lg transition-colors text-base"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                        </svg>
                        Periksa Pesan
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {/* Total */}
                    <div className="card p-5 flex flex-col items-start gap-2">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: "#EFF6FF" }}
                        >
                            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>{totalCount}</p>
                            <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>Total Pemeriksaan</p>
                        </div>
                    </div>

                    {/* Risiko Tinggi */}
                    <div className="card p-5 flex flex-col items-start gap-2">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-50">
                            <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-rose-600">{tinggiCount}</p>
                            <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>Risiko Tinggi</p>
                        </div>
                    </div>

                    {/* Risiko Sedang */}
                    <div className="card p-5 flex flex-col items-start gap-2">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-50">
                            <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-amber-600">{sedangCount}</p>
                            <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>Risiko Sedang</p>
                        </div>
                    </div>

                    {/* Risiko Rendah */}
                    <div className="card p-5 flex flex-col items-start gap-2">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-green-50">
                            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-green-600">{rendahCount}</p>
                            <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>Risiko Rendah</p>
                        </div>
                    </div>
                </div>

                {/* Riwayat Terbaru */}
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
                            Pemeriksaan Terbaru
                        </h2>
                        {totalCount > 5 && (
                            <Link
                                href="/riwayat"
                                className="text-sm font-medium hover:underline"
                                style={{ color: "var(--primary)" }}
                            >
                                Lihat semua →
                            </Link>
                        )}
                    </div>

                    {recent.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div
                                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                                style={{ backgroundColor: "var(--background)" }}
                            >
                                <svg className="w-8 h-8" style={{ color: "var(--border)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <p className="font-medium mb-1" style={{ color: "var(--muted)" }}>
                                Belum ada riwayat pemeriksaan
                            </p>
                            <p className="text-sm mb-5" style={{ color: "var(--border)" }}>
                                Mulai periksa pesan untuk melihat riwayat di sini
                            </p>
                            <Link
                                href="/periksa"
                                className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
                            >
                                Periksa Pesan Pertama
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recent.map((analysis) => (
                                <AnalysisCard key={analysis.id} analysis={analysis} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
