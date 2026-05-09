import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { TerminalCursor } from "@/components/TerminalCursor";
import { VersionChip } from "@/components/VersionChip";

export function Welcome() {
    return (
        <main className="relative isolate min-h-screen overflow-hidden">
            <div
                aria-hidden
                className="terminal-grid pointer-events-none absolute inset-0 -z-10 opacity-60"
            />

            <header className="mx-auto flex max-w-6xl items-center border-b border-border px-6 py-4">
                <VersionChip />
            </header>

            <section className="mx-auto flex max-w-3xl flex-col items-start px-6 py-24 sm:py-32">
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                    <span className="text-medal-gold">$</span>
                    <span className="ml-2">a trophy ledger for your circles</span>
                </p>

                <h1 className="mt-10 font-heading text-7xl font-medium leading-[0.92] tracking-[0.025em] text-medal-gold sm:text-[8.5rem]">
                    troji
                </h1>

                <p className="mt-10 max-w-xl font-heading text-2xl italic leading-snug tracking-[0.025em] text-foreground/95 sm:text-3xl">
                    To the victor, the data.
                </p>
                <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                    Strip away the noise and crown your champions in the dark. Your
                    rivalries deserve a ledger, not a feed—because nothing beats the
                    cold, quantified proof that you are better than your friends.
                </p>

                <ul className="mt-10 grid gap-2 font-mono text-[13px] text-muted-foreground">
                    <li className="flex items-center gap-3">
                        <span className="text-medal-gold">▸</span>
                        <span>private by design — your group, your data</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <span className="text-medal-gold">▸</span>
                        <span>fast by default — no spinner soup</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <span className="text-medal-gold">▸</span>
                        <span>built for small groups — not stadiums</span>
                    </li>
                </ul>

                <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button variant="gold" size="terminal" asChild>
                        <Link to="/sign-up">
                            <span aria-hidden>▸</span>
                            <span>create account</span>
                            <TerminalCursor />
                        </Link>
                    </Button>
                    <Button variant="outline" size="terminal" asChild>
                        <Link to="/sign-in">
                            <span aria-hidden>›</span>
                            <span>sign in</span>
                        </Link>
                    </Button>
                </div>
            </section>

            <footer className="mx-auto flex max-w-6xl flex-col gap-2 border-t border-border px-6 py-4 font-mono text-[11px] text-muted-foreground/80 sm:flex-row sm:items-center sm:justify-between">
                <span>~/troji</span>
                <span className="flex items-center gap-3">
                    <span>no ads</span>
                    <span aria-hidden className="text-border">·</span>
                    <span>no telemetry</span>
                    <span aria-hidden className="text-border">·</span>
                    <span>made by friends</span>
                </span>
            </footer>
        </main>
    );
}
