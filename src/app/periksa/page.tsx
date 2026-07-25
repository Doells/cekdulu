import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import PeriksaForm from "./PeriksaForm";

export default async function PeriksaPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const displayName =
        user.user_metadata?.full_name || user.email?.split("@")[0] || "Pengguna";

    return (
        <div className="min-h-screen" style={{ background: "var(--background)" }}>
            <Navbar email={user.email ?? ""} displayName={displayName} />
            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--foreground)" }}>
                        Periksa Pesan
                    </h1>
                    <p className="mt-1" style={{ color: "var(--muted)" }}>
                        Tempel pesan mencurigakan di bawah untuk dianalisis oleh AI
                    </p>
                </div>
                <PeriksaForm />
            </main>
        </div>
    );
}
