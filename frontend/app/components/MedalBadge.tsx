import { cn } from "@/lib/utils";

const medalToneClassName = {
    gold: "bg-[radial-gradient(circle_at_30%_25%,var(--color-medal-gold)_0%,var(--color-medal-gold-shadow)_100%)]",
    silver:
        "bg-[radial-gradient(circle_at_30%_25%,var(--color-medal-silver)_0%,var(--color-medal-silver-shadow)_100%)]",
    bronze:
        "bg-[radial-gradient(circle_at_30%_25%,var(--color-medal-bronze)_0%,var(--color-medal-bronze-shadow)_100%)]",
} as const;

const medalSizeClassName = {
    sm: {
        frame: "size-9 text-base",
        rim: "inset-[2.5px]",
        stamp: "inset-[18%]",
    },
    md: {
        frame: "size-12 text-xl",
        rim: "inset-[3px]",
        stamp: "inset-[19%]",
    },
} as const;

interface MedalBadgeProps {
    emoji: string;
    size?: keyof typeof medalSizeClassName;
    tone?: keyof typeof medalToneClassName;
    awarded?: boolean;
    depth?: "flat" | "raised";
    className?: string;
    title?: string;
}

export function MedalBadge({
    emoji,
    size = "md",
    tone = "gold",
    awarded = true,
    depth = "raised",
    className,
    title,
}: MedalBadgeProps) {
    const sizeClassName = medalSizeClassName[size];

    return (
        <span
            title={title}
            className={cn(
                "relative inline-flex shrink-0 items-center justify-center rounded-full border border-white/15 text-center",
                medalToneClassName[tone],
                sizeClassName.frame,
                depth === "raised"
                    ? "shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_12px_22px_-16px_rgba(0,0,0,0.9)]"
                    : "shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]",
                awarded ? "" : "opacity-45 grayscale saturate-50",
                className
            )}
        >
            <span
                aria-hidden
                className={cn(
                    "absolute rounded-full border border-white/30 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.55),transparent_60%)]",
                    sizeClassName.rim
                )}
            />
            <span
                aria-hidden
                className={cn(
                    "absolute rounded-full border border-black/10 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.62),rgba(255,255,255,0.12)_60%,transparent_78%)] shadow-[inset_0_-4px_8px_rgba(0,0,0,0.16)]",
                    sizeClassName.stamp
                )}
            />
            <span className="relative z-10 drop-shadow-[0_1px_1px_rgba(255,255,255,0.35)]">
                {emoji}
            </span>
        </span>
    );
}