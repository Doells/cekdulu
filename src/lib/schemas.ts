import { z } from "zod";

// Request body dari client ke /api/analyze
export const analyzeRequestSchema = z.object({
    text: z
        .string()
        .min(20, "Pesan terlalu pendek. Minimal 20 karakter.")
        .max(5000, "Pesan terlalu panjang. Maksimal 5000 karakter."),
});

// Respons JSON terstruktur dari Gemini
export const geminiResponseSchema = z.object({
    risk_score: z.number().int().min(0).max(100),
    risk_level: z.enum(["rendah", "sedang", "tinggi"]),
    scam_type: z.string(),
    indicators: z.array(z.string()),
    explanation: z.string(),
    recommendations: z.array(z.string()),
});

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;
export type GeminiResponse = z.infer<typeof geminiResponseSchema>;
