import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { initialsFromDisplayName } from "@/lib/format/names";
import { cn } from "@/lib/utils";

export type UserAvatarSize = "xs" | "sm" | "md" | "lg";

const sizeClass: Record<UserAvatarSize, string> = {
    xs: "size-8 text-[11px]",
    sm: "size-9 text-xs",
    md: "size-14 text-base",
    lg: "size-20 text-2xl",
};

interface UserAvatarProps {
    displayName?: string | null;
    avatarUrl?: string | null;
    size?: UserAvatarSize;
    className?: string;
    title?: string;
    loading?: boolean;
}

export function UserAvatar({
    displayName,
    avatarUrl,
    size = "sm",
    className,
    title,
    loading,
}: UserAvatarProps) {
    if (loading) {
        return (
            <Skeleton
                title={title}
                className={cn(
                    "rounded-full ring-1 ring-medal-gold/30",
                    sizeClass[size],
                    className
                )}
            />
        );
    }

    const initials = initialsFromDisplayName(displayName);
    return (
        <Avatar
            key={avatarUrl ? "with-image" : "no-image"}
            title={title}
            className={cn(
                "bg-surface-muted font-medium text-foreground/85 ring-1 ring-medal-gold/30",
                sizeClass[size],
                className
            )}
        >
            {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
            <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
    );
}
