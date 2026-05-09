import type { ReactNode } from "react";
import { VersionChip } from "@/components/VersionChip";

type AuthShellProps = {
    prompt: string;
    headline?: ReactNode;
    children: ReactNode;
};

export function AuthShell({ prompt, headline, children }: AuthShellProps) {
    return (
        <main className="relative isolate flex min-h-screen flex-col">
            <div
                aria-hidden
                className="terminal-grid pointer-events-none absolute inset-0 -z-10 opacity-50"
            />

            <header className="mx-auto flex w-full max-w-6xl items-center border-b border-border px-6 py-4">
                <VersionChip />
            </header>

            <section className="mx-auto flex w-full max-w-md flex-1 flex-col items-stretch px-6 py-10 sm:py-16">
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                    <span className="text-medal-gold">$</span>
                    <span className="ml-2">{prompt}</span>
                </p>
                {headline ? (
                    <p className="mt-6 font-heading text-2xl italic leading-snug tracking-[0.025em] text-foreground/95 sm:text-3xl">
                        {headline}
                    </p>
                ) : null}
                <div className="mt-10">{children}</div>
            </section>

            <footer className="mx-auto flex w-full max-w-6xl flex-col gap-2 border-t border-border px-6 py-4 font-mono text-[11px] text-muted-foreground/80 sm:flex-row sm:items-center sm:justify-between">
                <span>~/troji</span>
                <span className="flex items-center gap-3">
                    <span>no ads</span>
                    <span aria-hidden className="text-border">
                        ·
                    </span>
                    <span>no telemetry</span>
                    <span aria-hidden className="text-border">
                        ·
                    </span>
                    <span>made by friends</span>
                </span>
            </footer>
        </main>
    );
}
