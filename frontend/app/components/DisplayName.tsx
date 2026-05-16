import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatFullName } from "@/lib/format/names";
import { cn } from "@/lib/utils";

interface ProfileShape {
    firstName: string;
    middleName?: string | null;
    lastName: string;
}

interface DisplayNameUser {
    displayName: string;
    profile?: ProfileShape | null;
}

interface DisplayNameProps {
    user: DisplayNameUser;
    isSelf?: boolean;
    /** When true and `profile` is present and the viewer is not the user, hovering / tapping reveals the full name. */
    showFullName?: boolean;
    /** Override the self label. Defaults to "(you)". Pass empty string to suppress. */
    selfLabel?: string;
    className?: string;
    selfClassName?: string;
}

export function DisplayName({
    user,
    isSelf = false,
    showFullName = false,
    selfLabel = "(you)",
    className,
    selfClassName,
}: DisplayNameProps) {
    const fullName = user.profile ? formatFullName(user.profile, "") : "";
    const enableTooltip =
        showFullName && !isSelf && fullName.length > 0 && fullName !== user.displayName;

    const nameSpan = enableTooltip ? (
        <span
            tabIndex={0}
            className="cursor-help rounded-sm underline decoration-dotted decoration-border underline-offset-4 outline-none focus-visible:ring-1 focus-visible:ring-medal-gold/50"
        >
            {user.displayName}
        </span>
    ) : (
        <span>{user.displayName}</span>
    );

    const content = (
        <span className={cn("inline-flex items-baseline gap-1", className)}>
            {enableTooltip ? (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>{nameSpan}</TooltipTrigger>
                        <TooltipContent>{fullName}</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ) : (
                nameSpan
            )}
            {isSelf && selfLabel ? (
                <span className={cn("text-muted-foreground", selfClassName)}>{selfLabel}</span>
            ) : null}
        </span>
    );

    return content;
}
