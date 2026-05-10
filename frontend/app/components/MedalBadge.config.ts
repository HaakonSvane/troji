// ─── Medal visual parameters ──────────────────────────────────────────────────
// All tuneable numbers live here. The component reads these but never hardcodes
// visual values itself, so this is the single place to experiment.

// ── Scroll-driven light position ─────────────────────────────────────────────

/** Focal point of the radial gradient when the medal is at/above center of the
 *  viewport (the "peak" lighting position), as % of the medal's diameter. */
export const LIGHT_PEAK = { x: 80, y: 80 } as const;

/** Focal point when the medal is at the bottom of the viewport (dimmed). */
export const LIGHT_DIM = { x: 15, y: 10 } as const;

/** Gradient stop (%) where the specular hotspot fades into the base metal color.
 *  Lower = harder, tighter hotspot. Higher = softer, more diffuse. */
export const SPECULAR_STOP = 15;

// ── Glare streak ─────────────────────────────────────────────────────────────

/** Angle (degrees) of the glare streak at peak lighting (medal at center/top).
 *  Rotates linearly to DIM_ANGLE as the medal moves toward the bottom.
 *  Using a direct sweep avoids the atan2 discontinuity. */
export const GLARE_ANGLE_PEAK = 135;
export const GLARE_ANGLE_DIM = 85;

/** Max opacity of the streak's bright center line (at peak, u=0). Fades to 0 at dim. */
export const GLARE_PEAK_OPACITY = 0.82;

/** Gradient stop positions (%) controlling streak width.
 *  outerFade: where the soft halo begins/ends.
 *  innerFade: where the bright core begins/ends. */
export const GLARE_STOPS = { outerFade: 30, innerFade: 46 } as const;

// ── Per-tone gradient colors ──────────────────────────────────────────────────

export type MedalTone = "gold" | "silver" | "bronze";

/** Three-stop radial gradient: specular hotspot → base metal → deep shadow. */
export const MEDAL_GRADIENT: Record<MedalTone, { spec: string; base: string; shadow: string }> = {
    gold:   { spec: "oklch(0.98 0.08 84)",   base: "oklch(0.80 0.15 84)",  shadow: "oklch(0.28 0.09 71)"  },
    silver: { spec: "oklch(0.97 0.005 255)", base: "oklch(0.73 0.02 255)", shadow: "oklch(0.28 0.01 255)" },
    bronze: { spec: "oklch(0.88 0.12 48)",   base: "oklch(0.58 0.13 48)",  shadow: "oklch(0.22 0.07 38)"  },
};

// ── Per-tone glow (box-shadow) ────────────────────────────────────────────────

/** Outer glow behind each medal. baseOpacity is scaled by a per-instance random
 *  factor (0.6–1.4×) so medals in the same tone aren't uniformly identical.
 *  Gold is most intense (proportional to tier worth). */
export const MEDAL_GLOW: Record<MedalTone, {
    blur: number;
    spread: number;
    baseOpacity: number;
    l: number; c: number; h: number; // oklch components of the glow color
}> = {
    gold:   { blur: 22, spread: 5, baseOpacity: 0.55, l: 0.78, c: 0.14, h: 84  },
    silver: { blur: 13, spread: 3, baseOpacity: 0.32, l: 0.73, c: 0.02, h: 255 },
    bronze: { blur:  8, spread: 2, baseOpacity: 0.20, l: 0.58, c: 0.13, h: 48  },
};

// ── Size variants ─────────────────────────────────────────────────────────────

export const MEDAL_SIZE = {
    sm: { frame: "size-9 text-base",  rim: "inset-[1.5px]", stamp: "inset-[14%]" },
    md: { frame: "size-12 text-xl",   rim: "inset-[2px]",   stamp: "inset-[14%]" },
    lg: { frame: "size-20 text-4xl",  rim: "inset-[2px]",   stamp: "inset-[12%]" },
} as const;

export type MedalSize = keyof typeof MEDAL_SIZE;
