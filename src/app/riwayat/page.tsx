import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import AnalysisCard, { type AnalysisSummary } from "@/components/AnalysisCard";
import Link from "next/link";

export default async function RiwayatPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const displayName =
        user.user_metadata?.full_name || user.email?.split("@")[0] || "Pengguna";

    const { data: analyses } = await supabase
        .from("analyses")
        .select("id, input_text, risk_level, risk_score, scam_type, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    const list: AnalysisSummary[] = analyses ?? [];

    return (
        <div className="min-h-screen" style={{ background: "var(--background)" }}>
            <Navbar email={user.email ?? ""} displayName={displayName} />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--foreground)" }}>
                            Riwayat Pemeriksaan
                        </h1>
                        <p className="mt-1" style={{ color: "var(--muted)" }}>
                            {list.length > 0
                                ? `${list.length} pemeriksaan ditemukan`
                                : "Belum ada pemeriksaan"}
                        </p>
                    </div>
                    <Link
                        href="/periksa"
                        className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors text-sm shrink-0"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Periksa Baru
                    </Link>
                </div>

                {list.length === 0 ? (
                    <div className="card p-12 flex flex-col items-center text-center">
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                            style={{ backgroundColor: "var(--background)" }}
                        >
                            <svg
                                className="w-8 h-8"
                                style={{ color: "var(--border)" }}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                            </svg>
                        </div>
                        <p className="font-medium mb-1" style={{ color: "var(--muted)" }}>
                            Belum ada riwayat pemeriksaan
                        </p>
                        <p className="text-sm mb-6" style={{ color: "var(--border)" }}>
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
                        {list.map((analysis) => (
                            <AnalysisCard key={analysis.id} analysis={analysis} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
