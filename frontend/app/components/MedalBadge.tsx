import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import "./MedalBadge.css";
import {
    GLARE_ANGLE_DIM,
    GLARE_ANGLE_PEAK,
    GLARE_PEAK_OPACITY,
    GLARE_STOPS,
    LIGHT_DIM,
    LIGHT_PEAK,
    MEDAL_GLOW,
    MEDAL_GRADIENT,
    MEDAL_SIZE,
    SPECULAR_STOP,
    type MedalSize,
    type MedalTone,
} from "./MedalBadge.config";

const toneFrameClass: Record<MedalTone, string> = {
    gold: "medal-frame-gold",
    silver: "medal-frame-silver",
    bronze: "medal-frame-bronze",
};

const toneCarvedEmojiClass: Record<MedalTone, string> = {
    gold: "medal-emoji-carved-gold",
    silver: "medal-emoji-carved-silver",
    bronze: "medal-emoji-carved-bronze",
};

// ── Scroll helpers ────────────────────────────────────────────────────────────

/** u=0 at/above viewport center (peak lighting), u=1 at viewport bottom (dim). */
function scrollProgress(centerY: number): number {
    return Math.max(0, (centerY / window.innerHeight - 0.5) * 2);
}

/** Focal point of the gradient for a given scroll progress. */
function lightPosition(u: number) {
    return {
        x: LIGHT_PEAK.x - u * (LIGHT_PEAK.x - LIGHT_DIM.x),
        y: LIGHT_PEAK.y - u * (LIGHT_PEAK.y - LIGHT_DIM.y),
    };
}

/** Glare streak angle and opacity for a given scroll progress.
 *  Linear sweep avoids the atan2 quadrant-crossing discontinuity. */
function glareParams(u: number) {
    return {
        angle: GLARE_ANGLE_PEAK - u * (GLARE_ANGLE_PEAK - GLARE_ANGLE_DIM),
        opacity: 1 - u,
    };
}

// ── Component ─────────────────────────────────────────────────────────────────

interface MedalBadgeProps {
    emoji: string;
    size?: MedalSize;
    tone?: MedalTone;
    awarded?: boolean;
    depth?: "flat" | "raised" | "carved";
    className?: string;
    title?: string;
}

export function MedalBadge({
    emoji,
    size = "md",
    tone = "gold",
    awarded = true,
    depth = "carved",
    className,
    title,
}: MedalBadgeProps) {
    const { frame, rim, stamp } = MEDAL_SIZE[size];
    const frameRef = useRef<HTMLSpanElement>(null);
    const glareRef = useRef<HTMLSpanElement>(null);

    // Stable random glow multiplier per instance (0.6–1.4×)
    const glowFactor = useRef(0.6 + Math.random() * 0.8).current;
    const { blur, spread, baseOpacity, l, c, h } = MEDAL_GLOW[tone];
    const glowAlpha = Math.min(1, baseOpacity * glowFactor).toFixed(2);
    const glowShadow = `0 0 ${Math.round(blur * glowFactor)}px ${Math.round(spread * glowFactor)}px oklch(${l} ${c} ${h} / ${glowAlpha})`;

    const baseShadow =
        depth === "raised"  ? "inset 0 1px 1px rgba(255,255,255,0.45), 0 12px 22px -16px rgba(0,0,0,0.9)"
        : depth === "carved" ? "inset 0 1px 1px rgba(255,255,255,0.25), 0 12px 22px -16px rgba(0,0,0,0.9)"
        :                      "inset 0 1px 1px rgba(255,255,255,0.2)";

    useEffect(() => {
        const el = frameRef.current;
        const glare = glareRef.current;
        if (!el || !glare) return;

        const { spec, base, shadow } = MEDAL_GRADIENT[tone];
        const { outerFade, innerFade } = GLARE_STOPS;

        function update() {
            const rect = el!.getBoundingClientRect();
            const u = scrollProgress(rect.top + rect.height / 2);
            const { x, y } = lightPosition(u);
            const { angle, opacity } = glareParams(u);

            el!.style.backgroundImage = `radial-gradient(circle at ${x.toFixed(1)}% ${y.toFixed(1)}%, ${spec} 0%, ${base} ${SPECULAR_STOP}%, ${shadow} 100%)`;
            el!.style.setProperty("--medal-shine-x", `${x.toFixed(1)}%`);
            el!.style.setProperty("--medal-shine-y", `${y.toFixed(1)}%`);

            const a1 = (opacity * GLARE_PEAK_OPACITY * 0.65).toFixed(2);
            const a2 = (opacity * GLARE_PEAK_OPACITY).toFixed(2);
            glare!.style.backgroundImage = `linear-gradient(
                ${angle.toFixed(1)}deg,
                transparent ${outerFade}%,
                rgba(255,255,255,${a1}) ${innerFade}%,
                rgba(255,255,255,${a2}) 50%,
                rgba(255,255,255,${a1}) ${100 - innerFade}%,
                transparent ${100 - outerFade}%
            )`;
        }

        window.addEventListener("scroll", update, { passive: true });
        update();
        return () => window.removeEventListener("scroll", update);
    }, [tone]);

    return (
        <span
            ref={frameRef}
            title={title}
            style={{ boxShadow: `${baseShadow}, ${glowShadow}` }}
            className={cn(
                "medal-badge",
                "relative inline-flex shrink-0 items-center justify-center rounded-full border border-white/15 text-center",
                toneFrameClass[tone],
                frame,
                awarded ? "" : "opacity-45 grayscale saturate-50",
                className
            )}
        >
            <span
                aria-hidden
                className={cn(
                    "absolute rounded-full border border-white/30 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.55),transparent_60%)]",
                    rim
                )}
            />
            <span
                aria-hidden
                className={cn(
                    "absolute rounded-full",
                    depth === "carved"
                        ? "border border-black/20 medal-stamp-carved"
                        : "border border-black/10 medal-stamp-raised",
                    stamp
                )}
            />
            <span
                ref={glareRef}
                aria-hidden
                className="absolute inset-0 rounded-full"
                style={{ mixBlendMode: "screen" }}
            />
            <span
                className={cn(
                    "relative z-10",
                    depth === "carved"
                        ? toneCarvedEmojiClass[tone]
                        : "drop-shadow-[0_1px_1px_rgba(255,255,255,0.35)]"
                )}
            >
                {emoji}
            </span>
        </span>
    );
}
