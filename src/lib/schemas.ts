import { z } from "zod";

// Request body dari client ke /api/analyze (mode teks)
export const analyzeRequestSchema = z.object({
    text: z
        .string()
        .min(20, "Pesan terlalu pendek. Minimal 20 karakter.")
        .max(5000, "Pesan terlalu panjang. Maksimal 5000 karakter."),
});

// Tipe MIME gambar yang diterima
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

// Ukuran maksimal gambar: 5 MB
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

// Respons JSON terstruktur dari Gemini (untuk teks maupun gambar)
export const geminiResponseSchema = z.object({
    extracted_text: z.string().optional().default(""),
    risk_score: z.number().int().min(0).max(100),
    risk_level: z.enum(["rendah", "sedang", "tinggi"]),
    scam_type: z.string(),
    indicators: z.array(z.string()),
    explanation: z.string(),
    recommendations: z.array(z.string()),
});

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;
export type GeminiResponse = z.infer<typeof geminiResponseSchema>;
