"use client";
import { useGradient } from "@/hooks/useGradient";
import { cn } from "@/lib/utils";
import { useRef } from "react";

type SectionHeaderProps = {
    title: string;
};

export const SectionHeader = ({ title }: SectionHeaderProps) => {
    const headingRef = useRef<HTMLHeadingElement>(null);
    const gradientColors = useGradient(headingRef, ["#ffd597", "#e77d8d", "#110b57"]);

    return (
        <h2
            ref={headingRef}
            style={{
                background: `linear-gradient(0deg, ${gradientColors})`,
                wordSpacing: 5,
                transition: "all ease-in-out 0.2s",
            }}
            className={cn("inline-block text-transparent bg-clip-text!")}
        >
            {title}
        </h2>
    );
};
