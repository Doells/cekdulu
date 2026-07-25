import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { register } from "@/app/actions/auth";

export default async function RegisterPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>;
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
                    <Image
                        src="/logo.png.png"
                        alt="CekDulu Logo"
                        width={72}
                        height={72}
                        className="rounded-2xl mb-4 mx-auto"
                        priority
                    />
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
                        Buat Akun Baru
                    </h2>
                    <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
                        Sudah punya akun?{" "}
                        <Link
                            href="/login"
                            className="font-semibold hover:underline"
                            style={{ color: "var(--primary)" }}
                        >
                            Masuk di sini
                        </Link>
                    </p>

                    {error && <div className="alert-error mb-5">⚠️ {error}</div>}

                    <form action={register} className="space-y-4">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium mb-1.5"
                                style={{ color: "var(--foreground)" }}
                            >
                                Nama Lengkap
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                autoComplete="name"
                                placeholder="Nama Anda"
                                className="input-field"
                            />
                        </div>

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
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium mb-1.5"
                                style={{ color: "var(--foreground)" }}
                            >
                                Kata Sandi
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                autoComplete="new-password"
                                placeholder="Minimal 6 karakter"
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium mb-1.5"
                                style={{ color: "var(--foreground)" }}
                            >
                                Konfirmasi Kata Sandi
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                autoComplete="new-password"
                                placeholder="Ulangi kata sandi"
                                className="input-field"
                            />
                        </div>

                        <button type="submit" className="btn-primary mt-2">
                            Daftar Sekarang
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs mt-6" style={{ color: "var(--muted)" }}>
                    Dengan mendaftar, Anda menyetujui Syarat & Ketentuan CekDulu
                </p>
            </div>
        </div>
    );
}
