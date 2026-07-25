"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        if (error.message.includes("Invalid login credentials")) {
            redirect("/login?error=Email+atau+kata+sandi+tidak+valid");
        }
        redirect("/login?error=" + encodeURIComponent("Terjadi kesalahan. Silakan coba lagi."));
    }

    redirect("/dashboard");
}

export async function register(formData: FormData) {
    const supabase = await createClient();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
        redirect("/register?error=Kata+sandi+tidak+cocok");
    }

    if (password.length < 6) {
        redirect("/register?error=Kata+sandi+minimal+6+karakter");
    }

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name: name },
        },
    });

    if (error) {
        if (error.message.includes("already registered")) {
            redirect("/register?error=Email+sudah+terdaftar");
        }
        redirect("/register?error=" + encodeURIComponent("Terjadi kesalahan. Silakan coba lagi."));
    }

    redirect("/login?success=Registrasi+berhasil!+Silakan+masuk+dengan+akun+Anda.");
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
}
