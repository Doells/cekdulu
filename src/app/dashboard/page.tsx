import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/auth";

export default async function DashboardPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const displayName =
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "Pengguna";

    return (
        <div className="min-h-screen" style={{ background: "var(--background)" }}>
            {/* Header / Navbar */}
            <header
                className="sticky top-0 z-50"
                style={{
                    background: "rgba(255,255,255,0.92)",
                    backdropFilter: "blur(12px)",
                    borderBottom: "1px solid var(--border)",
                }}
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: "var(--primary)" }}
                        >
                            <svg
                                className="w-5 h-5 text-white"
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
                        </div>
                        <span className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
                            CekDulu
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-sm hidden sm:block" style={{ color: "var(--muted)" }}>
                            {user.email}
                        </span>
                        <form action={logout}>
                            <button
                                type="submit"
                                className="text-sm font-semibold px-4 py-2 rounded-lg border-2 border-rose-600 text-rose-600 bg-transparent hover:bg-rose-50 transition-colors cursor-pointer"
                            >
                                Keluar
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            {/* Main Content */}
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
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-semibold px-8 py-3 rounded-lg transition-colors text-base cursor-pointer"
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
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        Periksa Pesan
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {/* Total Pemeriksaan */}
                    <div className="card p-6 flex items-center gap-4">
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: "#EFF6FF" }}
                        >
                            <svg
                                className="w-6 h-6 text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>
                                Jumlah Pemeriksaan
                            </p>
                            <p className="text-3xl font-bold mt-0.5" style={{ color: "var(--foreground)" }}>
                                0
                            </p>
                        </div>
                    </div>

                    {/* Risiko Tinggi */}
                    <div className="card p-6 flex items-center gap-4">
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: "var(--primary-light)" }}
                        >
                            <svg
                                className="w-6 h-6"
                                style={{ color: "var(--primary)" }}
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
                        </div>
                        <div>
                            <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>
                                Risiko Tinggi Terdeteksi
                            </p>
                            <p className="text-3xl font-bold mt-0.5" style={{ color: "var(--primary)" }}>
                                0
                            </p>
                        </div>
                    </div>
                </div>

                {/* Riwayat Section */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--foreground)" }}>
                        Riwayat Pemeriksaan
                    </h2>
                    <div className="flex flex-col items-center justify-center py-12 text-center">
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
                        <p className="font-medium" style={{ color: "var(--muted)" }}>
                            Belum ada riwayat pemeriksaan
                        </p>
                        <p className="text-sm mt-1" style={{ color: "var(--border)" }}>
                            Mulai periksa pesan untuk melihat riwayat di sini
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
