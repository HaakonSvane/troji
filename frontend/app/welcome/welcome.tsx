import { Link } from "react-router";

export function Welcome() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-10 px-4 py-16">
            <div className="flex flex-col items-center gap-3">
                <h1 className="font-heading text-4xl font-semibold tracking-tight">troji</h1>
                <p className="text-center text-sm text-muted-foreground max-w-xs">
                    Track wins, trophies, and rivalries — with your crew.
                </p>
            </div>
            <div className="flex flex-col items-stretch gap-3 w-full max-w-xs">
                <Link
                    to="/sign-up"
                    className="inline-flex w-full items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                    Create an account
                </Link>
                <Link
                    to="/sign-in"
                    className="inline-flex w-full items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-semibold shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                    Sign in
                </Link>
            </div>
        </main>
    );
}
