import { PersonName } from "@/components/PersonName";

interface TopPerformerUser {
    id: string;
    firstName?: string | null;
    middleName?: string | null;
    lastName?: string | null;
}

interface GroupTopPerformerProps {
    user: TopPerformerUser | null;
    count: number;
    currentUserId?: string | null;
    className?: string;
}

function getInitials(user: TopPerformerUser): string {
    const first = user.firstName?.[0] ?? "";
    const last = user.lastName?.[0] ?? "";
    return (first + last).toUpperCase() || "?";
}

export function GroupTopPerformer({
    user,
    count,
    currentUserId,
    className,
}: GroupTopPerformerProps) {
    return (
        <section className={"flex flex-col gap-4 " + (className ?? "")}>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                <span className="text-medal-gold">$</span>
                <span className="ml-2">top performer</span>
            </h2>

            <div className="surface-card flex flex-1 flex-col gap-4 p-5 sm:p-6">
            {user ? (
                <div className="flex flex-1 items-center gap-4">
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-full border border-medal-gold/40 bg-surface-muted text-base font-medium text-foreground/90">
                        {getInitials(user)}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <PersonName
                            firstName={user.firstName}
                            middleName={user.middleName}
                            lastName={user.lastName}
                            isSelf={user.id === currentUserId}
                            className="truncate font-heading text-2xl font-medium tracking-[0.015em] text-foreground sm:text-3xl"
                        />
                        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                            <span className="text-medal-gold">{count}</span>{" "}
                            <span>{count === 1 ? "award" : "awards"}</span>
                            <span aria-hidden className="mx-2 text-border">
                                ·
                            </span>
                            <span>leading the circle</span>
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-1 flex-col items-start justify-center gap-2">
                    <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-medal-gold">
                        <span aria-hidden className="mr-2">
                            ▸
                        </span>
                        no champion yet
                    </p>
                    <p className="font-heading text-xl tracking-[0.015em] text-foreground sm:text-2xl">
                        Settle a rivalry. Crown one.
                    </p>
                </div>
            )}
            </div>
        </section>
    );
}
