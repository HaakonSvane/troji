import { DisplayName } from "@/components/DisplayName";
import { SurfaceCard } from "@/components/ui/surface-card";
import { UserAvatar } from "@/components/UserAvatar";

interface TopPerformerUser {
    id: string;
    displayName: string;
    avatarUrl?: string | null;
    profile?: {
        firstName: string;
        middleName?: string | null;
        lastName: string;
    } | null;
}

interface GroupTopPerformerProps {
    user: TopPerformerUser | null;
    count: number;
    currentUserId?: string | null;
    className?: string;
}

export function GroupTopPerformer({
    user,
    count,
    currentUserId,
    className,
}: GroupTopPerformerProps) {
    return (
        <section className={"flex flex-col gap-4 " + (className ?? "")}>
            <h2
                className={
                    "font-mono text-[11px] uppercase tracking-[0.22em] " +
                    (user ? "text-medal-gold" : "text-muted-foreground")
                }
            >
                <span className={user ? undefined : "text-medal-gold"}>$</span>
                <span className="ml-2">top performer</span>
            </h2>

            <SurfaceCard
                tone={user ? "gold" : "default"}
                className="flex flex-1 flex-col gap-4 p-5 sm:p-6"
            >
            {user ? (
                <div className="flex flex-1 items-center gap-4">
                    <UserAvatar
                        displayName={user.displayName}
                        avatarUrl={user.avatarUrl}
                        size="md"
                    />
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <DisplayName
                            user={user}
                            isSelf={user.id === currentUserId}
                            showFullName
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
            </SurfaceCard>
        </section>
    );
}
