type RiskLevel = "rendah" | "sedang" | "tinggi" | string;

interface RiskBadgeProps {
    level: RiskLevel;
    size?: "sm" | "md";
}

const config: Record<string, { label: string; className: string }> = {
    rendah: {
        label: "Risiko Rendah",
        className:
            "bg-green-100 text-green-800 border border-green-200",
    },
    sedang: {
        label: "Risiko Sedang",
        className:
            "bg-amber-100 text-amber-800 border border-amber-200",
    },
    tinggi: {
        label: "Risiko Tinggi",
        className:
            "bg-red-100 text-red-800 border border-red-200",
    },
};

export default function RiskBadge({ level, size = "md" }: RiskBadgeProps) {
    const cfg = config[level] ?? {
        label: level,
        className: "bg-gray-100 text-gray-700 border border-gray-200",
    };

    const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";

    return (
        <span
            className={`inline-flex items-center rounded-full font-semibold ${sizeClass} ${cfg.className}`}
        >
            {cfg.label}
        </span>
    );
}
