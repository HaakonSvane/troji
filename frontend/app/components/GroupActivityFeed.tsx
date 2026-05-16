import { graphql, useFragment } from "react-relay";
import { Link } from "react-router";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import type { GroupActivityFeed_group$key } from "@/__generated__/GroupActivityFeed_group.graphql";
import { MedalBadge } from "@/components/MedalBadge";
import { DisplayName } from "@/components/DisplayName";
import { UserAvatar } from "@/components/UserAvatar";
import { formatRelativeTime, formatAbsoluteDateTime } from "@/lib/relativeTime";
import { Button } from "@/components/ui/button";

const GroupActivityFeedFragment = graphql`
    fragment GroupActivityFeed_group on Group {
        recentActivityCount
        recentActivity(first: 5) {
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
                        displayName
                        profile {
                            firstName
                            middleName
                            lastName
                        }
                    }
                    awardedBy {
                        id
                        displayName
                        profile {
                            firstName
                            middleName
                            lastName
                        }
                    }
                }
            }
            ... on MemberJoinedActivity {
                member {
                    id
                    displayName
                    avatarUrl(size: 64)
                    profile {
                        firstName
                        middleName
                        lastName
                    }
                }
            }
        }
    }
`;

interface GroupActivityFeedProps {
    group: GroupActivityFeed_group$key;
    groupId: string;
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

export function GroupActivityFeed({ group, groupId, currentUserId }: GroupActivityFeedProps) {
    const data = useFragment(GroupActivityFeedFragment, group);
    const items = data.recentActivity ?? [];
    const hasMore = data.recentActivityCount > items.length;

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
                    <p className="font-heading text-2xl tracking-[0.015em] text-foreground sm:text-3xl">
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
                                            {t.awardedBy ? (
                                                <>
                                                    {awarderIsSelf ? (
                                                        <span className="text-foreground">You</span>
                                                    ) : (
                                                        <DisplayName
                                                            user={t.awardedBy}
                                                            showFullName
                                                            className="text-foreground"
                                                        />
                                                    )}{" "}
                                                    awarded{" "}
                                                </>
                                            ) : null}
                                            <em className="font-heading not-italic tracking-[0.015em] text-foreground">
                                                {t.game?.name ?? "trophy"}
                                            </em>{" "}
                                            to{" "}
                                            {receiverIsSelf ? (
                                                <span className="text-foreground">you</span>
                                            ) : t.receiver ? (
                                                <DisplayName
                                                    user={t.receiver}
                                                    showFullName
                                                    className="text-foreground"
                                                />
                                            ) : (
                                                <span className="text-foreground">Unknown</span>
                                            )}
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
                            return (
                                <li
                                    key={item.id}
                                    className="flex items-start gap-3 px-4 py-3 sm:gap-4 sm:px-5"
                                >
                                    <UserAvatar
                                        displayName={item.member.displayName}
                                        avatarUrl={item.member.avatarUrl}
                                        size="sm"
                                        className="mt-0.5"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm leading-relaxed text-foreground/90">
                                            {memberIsSelf ? (
                                                <span className="text-foreground">You</span>
                                            ) : (
                                                <DisplayName
                                                    user={item.member}
                                                    showFullName
                                                    className="text-foreground"
                                                />
                                            )}{" "}
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
            {hasMore ? (
                <footer className="flex items-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        trailingIcon={<ArrowRightIcon />}
                        asChild
                    >
                        <Link to={`/groups/${groupId}/activities`}>
                            View all {data.recentActivityCount}
                        </Link>
                    </Button>
                </footer>
            ) : null}
        </section>
    );
}
