import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type GroupImageSize = "hero" | "card" | "field";

const groupImageSizeClass: Record<GroupImageSize, string> = {
    hero: "size-20 text-2xl sm:size-24 sm:text-3xl",
    card: "size-14 text-xl sm:size-16",
    field: "size-16 text-xl",
};

function groupInitial(name: string): string {
    const trimmed = name.trim();
    return trimmed.length > 0 ? trimmed.charAt(0).toUpperCase() : "?";
}

interface GroupImageProps {
    name: string;
    imageUrl?: string | null;
    size: GroupImageSize;
    loading?: boolean;
    className?: string;
}

export function GroupImage({ name, imageUrl, size, loading, className }: GroupImageProps) {
    const sizeClass = groupImageSizeClass[size];
    if (loading) {
        return (
            <Skeleton
                className={cn(
                    "shrink-0 rounded-full ring-1 ring-medal-gold/30",
                    sizeClass,
                    className
                )}
            />
        );
    }
    return (
        <div
            className={cn(
                "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-muted font-heading font-medium text-foreground/85 ring-1 ring-medal-gold/30",
                sizeClass,
                className
            )}
        >
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                />
            ) : (
                <span aria-hidden>{groupInitial(name)}</span>
            )}
        </div>
    );
}
