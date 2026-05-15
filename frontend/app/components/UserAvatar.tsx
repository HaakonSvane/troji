import { cn } from "@/lib/utils";

type UserAvatarSize = "sm" | "md" | "lg";

const sizeClass: Record<UserAvatarSize, string> = {
    sm: "size-9 text-xs",
    md: "size-12 text-sm",
    lg: "size-20 text-2xl",
};

interface UserAvatarProps {
    firstName?: string | null;
    lastName?: string | null;
    size?: UserAvatarSize;
    className?: string;
    title?: string;
}

export function UserAvatar({
    firstName,
    lastName,
    size = "sm",
    className,
    title,
}: UserAvatarProps) {
    const initials =
        ((firstName ?? "")[0] ?? "").toUpperCase() +
        ((lastName ?? "")[0] ?? "").toUpperCase();

    return (
        <span
            title={title}
            className={cn(
                "inline-flex shrink-0 items-center justify-center rounded-full border border-medal-gold/30 bg-surface-muted font-medium text-foreground/85",
                sizeClass[size],
                className
            )}
        >
            {initials || "?"}
        </span>
    );
}
