import Link from "next/link";
import RiskBadge from "./RiskBadge";

export interface AnalysisSummary {
    id: string;
    input_text: string;
    risk_level: string;
    risk_score: number;
    scam_type: string;
    created_at: string;
}

interface AnalysisCardProps {
    analysis: AnalysisSummary;
}

function formatDate(isoString: string): string {
    try {
        return new Date(isoString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return isoString;
    }
}

export default function AnalysisCard({ analysis }: AnalysisCardProps) {
    const preview =
        analysis.input_text.length > 100
            ? analysis.input_text.slice(0, 100) + "…"
            : analysis.input_text;

    return (
        <Link href={`/hasil/${analysis.id}`} className="block group">
            <div className="card p-4 hover:border-rose-200 transition-colors group-hover:shadow-sm">
                <div className="flex items-start justify-between gap-3 mb-2">
                    <RiskBadge level={analysis.risk_level} size="sm" />
                    <span className="text-xs shrink-0" style={{ color: "var(--muted)" }}>
                        {formatDate(analysis.created_at)}
                    </span>
                </div>
                <p className="text-sm mb-1 font-medium" style={{ color: "var(--foreground)" }}>
                    {analysis.scam_type || "Analisis Pesan"}
                </p>
                <p className="text-sm line-clamp-2" style={{ color: "var(--muted)" }}>
                    {preview}
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs font-medium" style={{ color: "var(--primary)" }}>
                    Lihat detail
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </Link>
    );
}
