import { useState, useEffect, RefObject, useMemo } from "react";

const SPEED = 1;

export const useGradient = (element: RefObject<HTMLElement | null>, colors: string[]) => {
    const percentages = useMemo(
        () => Array.from({ length: colors.length }).map((_, index) => index * 100),
        [colors],
    );

    const [movingColor, setMovingColor] = useState(percentages);

    const scrollTextColorAdjust = () => {
        const box = element.current?.getBoundingClientRect();
        if (box && window) {
            const elementInView = box.top < window.innerHeight && box.bottom >= 0;
            const screenHeight = window && window.innerHeight;
            const elementPixelsFromScreenTop = box.top;

            if (elementInView) {
                const heightFraction = (screenHeight - elementPixelsFromScreenTop) / screenHeight;
                const distance = 100 / (colors.length - 1);
                const gradientPercentages = percentages.map(
                    (_, index) => (-((heightFraction - 0.5) * SPEED) + index) * distance,
                );

                setMovingColor(gradientPercentages);
            }
        }
    };

    useEffect(() => {
        document.addEventListener("scroll", scrollTextColorAdjust);
        scrollTextColorAdjust();
        return () => {
            document.removeEventListener("scroll", scrollTextColorAdjust);
        };
    }, []);

    return colors
        .reverse()
        .map((col, index) => `${col} ${movingColor[index]}%`)
        .join(", ");
};
