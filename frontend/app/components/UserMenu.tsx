import { Suspense } from "react";
import { useClerk } from "@clerk/react-router";
import { graphql, usePreloadedQuery } from "react-relay";
import type { PreloadedQuery } from "react-relay";
import type { UserMenuQuery as UserMenuQueryType } from "@/__generated__/UserMenuQuery.graphql";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

export const UserMenuQuery = graphql`
    query UserMenuQuery {
        me {
            firstName
            lastName
        }
    }
`;

interface UserMenuContentProps {
    queryRef: PreloadedQuery<UserMenuQueryType>;
}

function UserMenuContent({ queryRef }: UserMenuContentProps) {
    const data = usePreloadedQuery(UserMenuQuery, queryRef);
    const { signOut } = useClerk();

    const firstName = data.me?.firstName ?? "";
    const lastName = data.me?.lastName ?? "";
    const initials = [firstName[0], lastName[0]].filter(Boolean).join("").toUpperCase() || "?";
    const fullName = [firstName, lastName].filter(Boolean).join(" ") || "Unknown";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    aria-label="Open user menu"
                    className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-medal-gold/30 bg-surface-muted font-mono text-[11px] font-medium text-foreground/85 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-medal-gold/50"
                >
                    {initials}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="min-w-44 border-border bg-background p-1"
            >
                <DropdownMenuLabel className="px-2 py-1.5 font-sans text-xs text-foreground/70">
                    {fullName}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground focus:text-foreground"
                    onSelect={() => signOut({ redirectUrl: "/" })}
                >
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

interface UserMenuProps {
    queryRef?: PreloadedQuery<UserMenuQueryType>;
}

export function UserMenu({ queryRef }: UserMenuProps) {
    if (!queryRef) return <Skeleton className="size-8 rounded-full" />;
    return (
        <Suspense fallback={<Skeleton className="size-8 rounded-full" />}>
            <UserMenuContent queryRef={queryRef} />
        </Suspense>
    );
}
