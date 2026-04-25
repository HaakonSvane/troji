import { Link } from "react-router";
import logoDark from "./logo-dark.svg";
import logoLight from "./logo-light.svg";

export function Welcome() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-12 px-4 py-16">
            <div className="flex flex-col items-center gap-6">
                <div className="w-48 max-w-[50vw]">
                    <img src={logoLight} alt="Troji" className="block w-full dark:hidden" />
                    <img src={logoDark} alt="Troji" className="hidden w-full dark:block" />
                </div>
                <p className="text-center text-lg text-muted-foreground max-w-sm">
                    Track wins, trophies, and rivalries — with your crew.
                </p>
            </div>
            <div className="flex flex-col items-center gap-3 w-full max-w-xs">
                <Link
                    to="/sign-in"
                    className="inline-flex w-full items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                    Sign in
                </Link>
                <Link
                    to="/sign-up"
                    className="inline-flex w-full items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-semibold shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                    Create an account
                </Link>
            </div>
        </main>
    );
}

