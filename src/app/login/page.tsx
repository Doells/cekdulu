import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { login } from "@/app/actions/auth";

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string; success?: string }>;
}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user) {
        redirect("/dashboard");
    }

    const params = await searchParams;
    const error = params.error;
    const success = params.success;

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            {/* Background decoration */}
            <div
                className="fixed inset-0 -z-10"
                style={{
                    background:
                        "radial-gradient(ellipse at top left, rgba(225,29,72,0.08) 0%, transparent 60%), radial-gradient(ellipse at bottom right, rgba(225,29,72,0.05) 0%, transparent 60%)",
                }}
            />

            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                        style={{ backgroundColor: "var(--primary)" }}
                    >
                        <svg
                            className="w-9 h-9 text-white"
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
                    <h1 className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>
                        CekDulu
                    </h1>
                    <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                        Periksa pesan sebelum percaya
                    </p>
                </div>

                {/* Card */}
                <div className="card p-8">
                    <h2 className="text-xl font-semibold mb-1" style={{ color: "var(--foreground)" }}>
                        Masuk ke Akun
                    </h2>
                    <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
                        Belum punya akun?{" "}
                        <Link
                            href="/register"
                            className="font-semibold hover:underline"
                            style={{ color: "var(--primary)" }}
                        >
                            Daftar sekarang
                        </Link>
                    </p>

                    {error && <div className="alert-error mb-5">⚠️ {error}</div>}
                    {success && <div className="alert-success mb-5">✅ {success}</div>}

                    <form action={login} className="space-y-4">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium mb-1.5"
                                style={{ color: "var(--foreground)" }}
                            >
                                Alamat Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                placeholder="anda@email.com"
                                className="input-field"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium"
                                    style={{ color: "var(--foreground)" }}
                                >
                                    Kata Sandi
                                </label>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                autoComplete="current-password"
                                placeholder="••••••••"
                                className="input-field"
                            />
                        </div>

                        <button type="submit" className="btn-primary mt-2">
                            Masuk
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs mt-6" style={{ color: "var(--muted)" }}>
                    Dengan masuk, Anda menyetujui Syarat & Ketentuan CekDulu
                </p>
            </div>
        </div>
    );
}
