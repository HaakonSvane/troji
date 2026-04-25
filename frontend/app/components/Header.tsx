import { UserButton } from "@clerk/react-router";
import { NavLink } from "react-router";

const navLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/groups", label: "Groups" },
];

export function Header() {
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
                <UserButton />
            </div>
        </header>
    );
}
