import { useState } from "react";
import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/react-router";
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { NavLink } from "react-router";
import { FeedbackForm } from "@/components/FeedbackForm";
import { Button } from "@/components/ui/button";
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
                <VersionChip homeHref="/dashboard" />

                <nav className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 sm:gap-2">
                    {navLinks.map(({ to, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                [
                                    "group inline-flex items-center gap-1.5 rounded-sm px-2 py-1.5 font-mono text-[12px] uppercase tracking-[0.18em] transition-colors sm:px-3 sm:text-[13px]",
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
