import Link from "next/link";
import Image from "next/image";
import { logout } from "@/app/actions/auth";

interface NavbarProps {
    email: string;
    displayName?: string;
}

export default function Navbar({ email }: NavbarProps) {
    return (
        <header
            className="sticky top-0 z-50"
            style={{
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(12px)",
                borderBottom: "1px solid var(--border)",
            }}
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <Image
                        src="/logo.png.png"
                        alt="CekDulu Logo"
                        width={32}
                        height={32}
                        className="rounded-lg"
                        priority
                    />
                    <Link
                        href="/dashboard"
                        className="text-lg font-bold hover:opacity-80 transition-opacity"
                        style={{ color: "var(--foreground)" }}
                    >
                        CekDulu
                    </Link>
                </div>

                {/* Nav links */}
                <nav className="hidden sm:flex items-center gap-1">
                    <Link
                        href="/dashboard"
                        className="px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100"
                        style={{ color: "var(--muted)" }}
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/periksa"
                        className="px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-rose-50"
                        style={{ color: "var(--primary)" }}
                    >
                        Periksa Pesan
                    </Link>
                    <Link
                        href="/riwayat"
                        className="px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100"
                        style={{ color: "var(--muted)" }}
                    >
                        Riwayat
                    </Link>
                </nav>

                {/* User info + logout */}
                <div className="flex items-center gap-3">
                    <span className="text-sm hidden lg:block truncate max-w-[160px]" style={{ color: "var(--muted)" }}>
                        {email}
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

            {/* Mobile nav */}
            <div className="sm:hidden flex items-center gap-1 px-4 pb-2 overflow-x-auto">
                <Link
                    href="/dashboard"
                    className="px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors hover:bg-gray-100"
                    style={{ color: "var(--muted)" }}
                >
                    Dashboard
                </Link>
                <Link
                    href="/periksa"
                    className="px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors hover:bg-rose-50"
                    style={{ color: "var(--primary)" }}
                >
                    Periksa Pesan
                </Link>
                <Link
                    href="/riwayat"
                    className="px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors hover:bg-gray-100"
                    style={{ color: "var(--muted)" }}
                >
                    Riwayat
                </Link>
            </div>
        </header>
    );
}
