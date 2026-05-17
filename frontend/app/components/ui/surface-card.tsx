import * as React from "react";

import { cn } from "@/lib/utils";

type SurfaceCardTone = "default" | "gold";

export function SurfaceCard({
    tone = "default",
    className,
    ...props
}: React.ComponentProps<"div"> & { tone?: SurfaceCardTone }) {
    return (
        <div
            data-slot="surface-card"
            data-tone={tone}
            className={cn(
                tone === "gold" ? "surface-card-gold" : "surface-card",
                className
            )}
            {...props}
        />
    );
}
