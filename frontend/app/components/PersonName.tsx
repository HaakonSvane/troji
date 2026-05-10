import { cn } from "@/lib/utils";

interface PersonNameProps {
    firstName?: string | null;
    middleName?: string | null;
    lastName?: string | null;
    isSelf?: boolean;
    fallback?: string;
    className?: string;
    selfClassName?: string;
}

export function formatPersonName({
    firstName,
    middleName,
    lastName,
    fallback = "Unknown",
}: Pick<PersonNameProps, "firstName" | "middleName" | "lastName" | "fallback">) {
    return [firstName, middleName, lastName].filter(Boolean).join(" ") || fallback;
}

export function PersonName({
    firstName,
    middleName,
    lastName,
    isSelf = false,
    fallback,
    className,
    selfClassName,
}: PersonNameProps) {
    const fullName = formatPersonName({ firstName, middleName, lastName, fallback });

    return (
        <span className={cn("inline-flex items-baseline gap-1", className)}>
            <span>{fullName}</span>
            {isSelf && (
                <span className={cn("text-muted-foreground", selfClassName)}>(you)</span>
            )}
        </span>
    );
}
