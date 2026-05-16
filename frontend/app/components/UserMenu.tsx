import { Suspense } from "react";
import { useClerk } from "@clerk/react-router";
import { ArrowRightOnRectangleIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { graphql, usePreloadedQuery } from "react-relay";
import type { PreloadedQuery } from "react-relay";
import { Link } from "react-router";
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
import { initialsFromDisplayName } from "@/lib/format/names";

export const UserMenuQuery = graphql`
    query UserMenuQuery {
        me {
            displayName
        }
    }
`;

interface UserMenuContentProps {
    queryRef: PreloadedQuery<UserMenuQueryType>;
}

function UserMenuContent({ queryRef }: UserMenuContentProps) {
    const data = usePreloadedQuery(UserMenuQuery, queryRef);
    const { signOut } = useClerk();

    const displayName = data.me?.displayName ?? "Unknown";
    const initials = initialsFromDisplayName(displayName);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    aria-label="Open user menu"
                    className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-medal-gold/30 bg-surface-muted font-mono text-[11px] font-medium text-foreground/85 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-medal-gold/50"
                >
                    {initials}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                onCloseAutoFocus={(e) => e.preventDefault()}
                className="min-w-44 border-border bg-background p-1"
            >
                <DropdownMenuLabel className="px-3 py-2 font-sans text-xs text-foreground/70">
                    {displayName}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="min-h-8 cursor-pointer gap-2 px-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground focus:text-foreground">
                    <Link to="/settings">
                        <Cog6ToothIcon className="size-3.5 shrink-0" />
                        Settings
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="min-h-8 cursor-pointer gap-2 px-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground focus:text-foreground"
                    onSelect={() => signOut({ redirectUrl: "/" })}
                >
                    <ArrowRightOnRectangleIcon className="size-3.5 shrink-0" />
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
