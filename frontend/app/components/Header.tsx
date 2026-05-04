import { useState } from "react";
import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/react-router";
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { NavLink } from "react-router";
import { FeedbackForm } from "@/components/FeedbackForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const navLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/groups", label: "Groups" },
];

export function Header() {
    const [feedbackOpen, setFeedbackOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-14 items-center justify-between px-4">
                <nav className="flex items-center gap-1">
                    {navLinks.map(({ to, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                [
                                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-accent text-accent-foreground"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                                ].join(" ")
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
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
