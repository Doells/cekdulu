import Link from "next/link";
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
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
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
