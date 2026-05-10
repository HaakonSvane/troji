import { useState } from "react";
import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/react-router";
import { Bars3Icon, ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { NavLink } from "react-router";
import { FeedbackForm } from "@/components/FeedbackForm";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { VersionChip } from "@/components/VersionChip";

const navLinks = [
    { to: "/dashboard", label: "dashboard" },
    { to: "/groups", label: "groups" },
];

export function Header() {
    const [feedbackOpen, setFeedbackOpen] = useState(false);

    return (
        <header className="z-40 w-full border-b border-border bg-background">
            <div className="container relative mx-auto flex h-12 items-center justify-between gap-3 px-4 sm:h-14">
                <div className="flex items-center gap-2">
                    <VersionChip homeHref="/dashboard" />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label="Open navigation menu"
                                className="xl:hidden"
                            >
                                <Bars3Icon className="size-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="start"
                            onCloseAutoFocus={(event) => event.preventDefault()}
                            className="min-w-44 border-border bg-background p-1"
                        >
                            {navLinks.map(({ to, label }) => (
                                <DropdownMenuItem key={to} asChild>
                                    <NavLink
                                        to={to}
                                        className={({ isActive }) =>
                                            [
                                                "group flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 font-mono text-[12px] uppercase tracking-[0.18em] transition-colors",
                                                isActive
                                                    ? "text-medal-gold focus:text-medal-gold"
                                                    : "text-muted-foreground hover:text-foreground",
                                            ].join(" ")
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <span
                                                    aria-hidden
                                                    className={
                                                        isActive
                                                            ? "text-medal-gold"
                                                            : "text-muted-foreground/60 group-hover:text-foreground/60"
                                                    }
                                                >
                                                    ▸
                                                </span>
                                                <span>{label}</span>
                                            </>
                                        )}
                                    </NavLink>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-2 xl:flex">
                    {navLinks.map(({ to, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                [
                                    "group inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 font-mono text-[13px] uppercase tracking-[0.18em] transition-colors",
                                    isActive
                                        ? "text-medal-gold"
                                        : "text-muted-foreground hover:text-foreground",
                                ].join(" ")
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <span
                                        aria-hidden
                                        className={
                                            isActive
                                                ? "text-medal-gold"
                                                : "text-muted-foreground/60 group-hover:text-foreground/60"
                                        }
                                    >
                                        ▸
                                    </span>
                                    <span>{label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setFeedbackOpen(true)}
                        aria-label="Send feedback"
                    >
                        <ChatBubbleOvalLeftEllipsisIcon className="size-5" />
                    </Button>
                    <ClerkLoading>
                        <Skeleton className="size-8 rounded-full" />
                    </ClerkLoading>
                    <ClerkLoaded>
                        <UserButton />
                    </ClerkLoaded>
                </div>
                <FeedbackForm open={feedbackOpen} onOpenChange={setFeedbackOpen} />
            </div>
        </header>
    );
}
