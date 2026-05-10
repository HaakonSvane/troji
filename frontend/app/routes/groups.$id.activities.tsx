import { graphql, loadQuery, usePreloadedQuery } from "react-relay";
import { useNavigate } from "react-router";
import type { groupsActivitiesQuery } from "@/__generated__/groupsActivitiesQuery.graphql";
import { getRelayEnvironment } from "@/relay/environment";
import { MedalBadge } from "@/components/MedalBadge";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { formatPersonName } from "@/components/PersonName";
import { formatRelativeTime, formatAbsoluteDateTime } from "@/lib/relativeTime";
import type { Route } from "./+types/groups.$id.activities";

const GroupActivitiesPageQuery = graphql`
    query groupsActivitiesQuery($id: ID!) {
        groupById(id: $id) {
            id
            name
            recentActivityCount
            recentActivity(first: 50) {
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
        me {
            id
        }
    }
`;

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    const environment = getRelayEnvironment();
    const queryRef = loadQuery<groupsActivitiesQuery>(environment, GroupActivitiesPageQuery, {
        id: params.id,
    });
    return { queryRef };
}

export function HydrateFallback() {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="flex flex-col items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                <div className="size-6 animate-spin rounded-full border-2 border-medal-gold/40 border-t-medal-gold" />
                <span>loading</span>
            </div>
        </div>
    );
}

export function meta() {
    return [
        { title: "Activity — Troji" },
        { name: "description", content: "Recent activity in this circle." },
    ];
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

export default function GroupActivities({ loaderData }: Route.ComponentProps) {
    const navigate = useNavigate();
    const data = usePreloadedQuery(GroupActivitiesPageQuery, loaderData.queryRef);
    const group = data.groupById;
    const myId = data.me?.id;

    if (!group) {
        return (
            <main className="container mx-auto flex flex-col items-start gap-3 px-4 py-10 sm:py-14">
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-destructive">
                    <span aria-hidden className="mr-2">!</span>
                    not found
                </p>
                <h1 className="font-heading text-3xl tracking-[0.015em]">
                    That circle isn&apos;t here.
                </h1>
                <Button variant="outline" size="terminal" onClick={() => navigate("/groups")}>
                    <span aria-hidden>‹</span>
                    Back to circles
                </Button>
            </main>
        );
    }

    const items = group.recentActivity ?? [];

    return (
        <main className="container mx-auto flex flex-col gap-6 px-4 py-10 sm:py-14">
            <Breadcrumb
                segments={[
                    { label: "groups", href: "/groups" },
                    { label: group.name, href: `/groups/${group.id}` },
                    { label: "activity" },
                ]}
            />
            <div className="flex items-baseline gap-3">
                <h1 className="font-heading text-3xl font-medium tracking-[0.015em]">Activity</h1>
                {group.recentActivityCount > 50 ? (
                    <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                        showing 50 of {group.recentActivityCount}
                    </span>
                ) : null}
            </div>
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
                            const receiverIsSelf = t.receiver?.id === myId;
                            const awarderIsSelf = t.awardedBy?.id === myId;
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
                            const memberIsSelf = item.member.id === myId;
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
        </main>
    );
}
