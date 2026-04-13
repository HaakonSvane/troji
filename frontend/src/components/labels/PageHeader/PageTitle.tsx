"use client";

import { useGradient } from "@/hooks/useGradient";
import { cn } from "@/lib/utils";
import { useRef } from "react";

export const PageTitle = ({ ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    const headingRef = useRef<HTMLHeadingElement>(null);
    const gradientColors = useGradient(headingRef, ["#ffd597", "#e77d8d", "#110b57"]);
    return (
        <h1
            ref={headingRef}
            style={{
                background: `linear-gradient(0deg, ${gradientColors})`,
                wordSpacing: 5,
                transition: "all ease-in-out 0.2s",
            }}
            className={cn(
                "inline-block text-transparent bg-clip-text! text-3xl sm:text-4xl font-bold tracking-tight",
                props.className,
            )}
            {...props}
        />
    );
};
