import { graphql, useFragment } from "react-relay";
import type { GroupActivityFeed_group$key } from "@/__generated__/GroupActivityFeed_group.graphql";
import { MedalBadge } from "@/components/MedalBadge";
import { formatPersonName } from "@/components/PersonName";
import { formatRelativeTime, formatAbsoluteDateTime } from "@/lib/relativeTime";

const GroupActivityFeedFragment = graphql`
    fragment GroupActivityFeed_group on Group {
        recentActivity(first: 20) {
            __typename
            id
            occurredAt
            ... on TrophyAwardedActivity {
                trophy {
                    id
                    description
                    game {
                        id
                        symbol
                        name
                    }
                    receiver {
                        id
                        firstName
                        middleName
                        lastName
                    }
                    awardedBy {
                        id
                        firstName
                        middleName
                        lastName
                    }
                }
            }
            ... on MemberJoinedActivity {
                member {
                    id
                    firstName
                    middleName
                    lastName
                }
            }
        }
    }
`;

interface GroupActivityFeedProps {
    group: GroupActivityFeed_group$key;
    currentUserId?: string | null;
}

function ActivityTime({ iso }: { iso: string }) {
    return (
        <time
            dateTime={iso}
            title={formatAbsoluteDateTime(iso)}
            className="shrink-0 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
        >
            {formatRelativeTime(iso)}
        </time>
    );
}

export function GroupActivityFeed({ group, currentUserId }: GroupActivityFeedProps) {
    const data = useFragment(GroupActivityFeedFragment, group);
    const items = data.recentActivity ?? [];

    return (
        <section className="flex flex-col gap-4">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                <span className="text-medal-gold">$</span>
                <span className="ml-2">recent activity</span>
            </h2>

            {items.length === 0 ? (
                <div className="surface-card flex flex-col items-start gap-2 p-6 sm:p-8">
                    <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-medal-gold">
                        <span aria-hidden className="mr-2">▸</span>
                        ledger quiet
                    </p>
                    <p className="font-heading text-2xl italic tracking-[0.015em] text-foreground sm:text-3xl">
                        Nothing&apos;s happened yet.
                    </p>
                </div>
            ) : (
                <ol className="surface-card flex flex-col divide-y divide-border">
                    {items.map((item) => {
                        if (item.__typename === "TrophyAwardedActivity" && item.trophy) {
                            const t = item.trophy;
                            const receiverIsSelf = t.receiver?.id === currentUserId;
                            const awarderIsSelf = t.awardedBy?.id === currentUserId;
                            const receiverName = formatPersonName({
                                firstName: t.receiver?.firstName,
                                middleName: t.receiver?.middleName,
                                lastName: t.receiver?.lastName,
                            });
                            const awarderName = t.awardedBy
                                ? formatPersonName({
                                      firstName: t.awardedBy.firstName,
                                      middleName: t.awardedBy.middleName,
                                      lastName: t.awardedBy.lastName,
                                  })
                                : null;
                            return (
                                <li
                                    key={item.id}
                                    className="flex items-start gap-3 px-4 py-3 sm:gap-4 sm:px-5"
                                >
                                    <MedalBadge
                                        emoji={t.game?.symbol ?? "🏆"}
                                        size="sm"
                                        title={t.game?.name}
                                        className="mt-0.5"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm leading-relaxed text-foreground/90">
                                            {awarderName ? (
                                                <>
                                                    <span className="text-foreground">
                                                        {awarderIsSelf ? "You" : awarderName}
                                                    </span>{" "}
                                                    awarded{" "}
                                                </>
                                            ) : null}
                                            <em className="font-heading not-italic tracking-[0.015em] text-foreground">
                                                {t.game?.name ?? "trophy"}
                                            </em>{" "}
                                            to{" "}
                                            <span className="text-foreground">
                                                {receiverIsSelf ? "you" : receiverName}
                                            </span>
                                        </p>
                                        {t.description ? (
                                            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                                                {t.description}
                                            </p>
                                        ) : null}
                                    </div>
                                    <ActivityTime iso={item.occurredAt} />
                                </li>
                            );
                        }
                        if (item.__typename === "MemberJoinedActivity" && item.member) {
                            const memberIsSelf = item.member.id === currentUserId;
                            const memberName = formatPersonName({
                                firstName: item.member.firstName,
                                middleName: item.member.middleName,
                                lastName: item.member.lastName,
                            });
                            const initials = (
                                (item.member.firstName?.[0] ?? "") +
                                (item.member.lastName?.[0] ?? "")
                            ).toUpperCase() || "?";
                            return (
                                <li
                                    key={item.id}
                                    className="flex items-start gap-3 px-4 py-3 sm:gap-4 sm:px-5"
                                >
                                    <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border border-medal-gold/30 bg-surface-muted text-xs font-medium text-foreground/85">
                                        {initials}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm leading-relaxed text-foreground/90">
                                            <span className="text-foreground">
                                                {memberIsSelf ? "You" : memberName}
                                            </span>{" "}
                                            joined the circle
                                        </p>
                                    </div>
                                    <ActivityTime iso={item.occurredAt} />
                                </li>
                            );
                        }
                        return null;
                    })}
                </ol>
            )}
        </section>
    );
}
