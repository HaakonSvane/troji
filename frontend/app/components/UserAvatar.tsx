import { useState } from "react";
import { initialsFromDisplayName } from "@/lib/format/names";
import { cn } from "@/lib/utils";

type UserAvatarSize = "sm" | "md" | "lg";

const sizeClass: Record<UserAvatarSize, string> = {
    sm: "size-9 text-xs",
    md: "size-12 text-sm",
    lg: "size-20 text-2xl",
};

interface UserAvatarProps {
    displayName?: string | null;
    avatarUrl?: string | null;
    size?: UserAvatarSize;
    className?: string;
    title?: string;
}

export function UserAvatar({
    displayName,
    avatarUrl,
    size = "sm",
    className,
    title,
}: UserAvatarProps) {
    const [imgFailed, setImgFailed] = useState(false);
    const initials = initialsFromDisplayName(displayName);
    const showImage = avatarUrl && !imgFailed;

    return (
        <span
            title={title}
            className={cn(
                "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-medal-gold/30 bg-surface-muted font-medium text-foreground/85",
                sizeClass[size],
                className
            )}
        >
            {showImage ? (
                <img
                    src={avatarUrl}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    onError={() => setImgFailed(true)}
                    className="h-full w-full object-cover"
                />
            ) : (
                initials
            )}
        </span>
    );
}
