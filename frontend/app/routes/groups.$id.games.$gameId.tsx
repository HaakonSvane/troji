import { graphql, loadQuery, usePreloadedQuery, usePaginationFragment } from "react-relay";
import { useNavigate } from "react-router";
import type { groupsGameDetailQuery } from "@/__generated__/groupsGameDetailQuery.graphql";
import type { groupsGameDetail_game$key } from "@/__generated__/groupsGameDetail_game.graphql";
import { AwardTrophyButton } from "@/components/AwardTrophyButton";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { getRelayEnvironment } from "@/relay/environment";
import type { Route } from "./+types/groups.$id.games.$gameId";

const GroupGameDetailQuery = graphql`
    query groupsGameDetailQuery($groupId: ID!, $gameId: ID!) {
        groupById(id: $groupId) {
            id
            name
            members {
                totalCount
            }
        }
        gameById(id: $gameId) {
            id
            group {
                id
            }
            name
            symbol
            description
            ...groupsGameDetail_game
        }
        me {
            id
        }
    }
`;

const GroupGameDetailTrophiesFragment = graphql`
    fragment groupsGameDetail_game on Game
    @refetchable(queryName: "groupsGameDetailPaginationQuery")
    @argumentDefinitions(
        first: { type: "Int", defaultValue: 25 }
        after: { type: "String" }
    ) {
        trophies(first: $first, after: $after) @connection(key: "GameTrophies_trophies") {
            totalCount
            edges {
                node {
                    id
                    isAwarded
                    description
                    game {
                        id
                        symbol
                        name
                    }
                    receiver {
                        id
                        displayName
                    }
                }
            }
        }
    }
`;

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    const environment = getRelayEnvironment();
    const queryRef = loadQuery<groupsGameDetailQuery>(environment, GroupGameDetailQuery, {
        groupId: params.id,
        gameId: params.gameId,
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
        { title: "Game — Troji" },
        { name: "description", content: "Trophy history and stats for this game." },
    ];
}

function StatReadout({
    label,
    value,
    description,
    accented = false,
}: {
    label: string;
    value: number | string;
    description: string;
    accented?: boolean;
}) {
    return (
        <div
            className={
                "surface-card flex flex-col gap-2 p-5" + (accented ? " border-medal-gold/45" : "")
            }
        >
            <p
                className={
                    "font-mono text-[10px] uppercase tracking-[0.22em] " +
                    (accented ? "text-medal-gold" : "text-muted-foreground")
                }
            >
                {label}
            </p>
            <p
                className={
                    "font-heading text-4xl font-medium leading-none tracking-[0.015em] " +
                    (accented ? "text-medal-gold" : "text-foreground")
                }
            >
                {value}
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
        </div>
    );
}

function TrophyHistory({ game }: { game: groupsGameDetail_game$key }) {
    const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment(
        GroupGameDetailTrophiesFragment,
        game
    );

    const trophies = data.trophies?.edges?.map((e) => e?.node).filter(Boolean) ?? [];

    if (trophies.length === 0) {
        return (
            <div className="surface-card flex flex-col items-start gap-2 p-6 sm:p-8">
                <p className="font-heading text-xl tracking-[0.015em]">Nothing on the board.</p>
                <p className="text-sm text-muted-foreground">
                    Hand out the first trophy and start the ledger.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                {trophies.map((trophy) => (
                    <div key={trophy.id} className="surface-card flex items-center gap-4 p-4">
                        <div aria-hidden className="text-2xl">
                            {trophy.game?.symbol}
                        </div>
                        <div className="flex-1">
                            <p className="font-heading text-base font-medium tracking-[0.015em]">
                                {trophy.game?.name}
                            </p>
                            {trophy.description ? (
                                <p className="text-sm text-muted-foreground">
                                    {trophy.description}
                                </p>
                            ) : null}
                            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-medal-gold/85">
                                <span aria-hidden className="mr-2">
                                    ▸
                                </span>
                                awarded to {trophy.receiver?.displayName ?? "—"}
                            </p>
                        </div>
                        {!trophy.isAwarded ? (
                            <span className="pill-muted">pending</span>
                        ) : null}
                    </div>
                ))}
            </div>
            {hasNext ? (
                <div className="flex justify-start">
                    <Button
                        variant="outline"
                        size="sm"
                        busy={isLoadingNext}
                        disabled={isLoadingNext}
                        onClick={() => loadNext(25)}
                    >
                        Load more
                    </Button>
                </div>
            ) : null}
        </div>
    );
}

export default function GroupGameDetail({ loaderData }: Route.ComponentProps) {
    const navigate = useNavigate();
    const data = usePreloadedQuery(GroupGameDetailQuery, loaderData.queryRef);
    const group = data.groupById;
    const game = data.gameById;
    const myId = data.me?.id;

    if (!group || !game || game.group?.id !== group.id) {
        return (
            <main className="container mx-auto flex flex-col items-start gap-3 px-4 py-10 sm:py-14">
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-destructive">
                    <span aria-hidden className="mr-2">
                        !
                    </span>
                    not found
                </p>
                <h1 className="font-heading text-3xl tracking-[0.015em]">No such game.</h1>
                <Button variant="outline" size="terminal" onClick={() => navigate("/groups")}>
                    <span aria-hidden>‹</span>
                    Back to circles
                </Button>
            </main>
        );
    }

    const memberCount = group.members?.totalCount ?? 0;

    return (
        <main className="container mx-auto px-4 py-10 sm:py-14">
            <Breadcrumb
                segments={[
                    { label: "groups", href: "/groups" },
                    { label: group.name, href: `/groups/${group.id}` },
                    { label: game.name },
                ]}
            />

            <section className="mt-6 flex flex-col gap-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                        <span
                            aria-hidden
                            title={game.name}
                            className="shrink-0 text-5xl leading-none"
                        >
                            {game.symbol}
                        </span>
                        <div className="flex flex-col gap-2">
                            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-medal-gold">
                                <span aria-hidden className="mr-2">
                                    ▸
                                </span>
                                game
                            </p>
                            <h1 className="font-heading text-3xl font-medium leading-tight tracking-[0.015em] text-foreground sm:text-4xl">
                                {game.name}
                            </h1>
                            {game.description ? (
                                <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                                    {game.description}
                                </p>
                            ) : null}
                        </div>
                    </div>
                    <AwardTrophyButton
                        preselectedGameId={game.id}
                        groupId={group.id}
                        currentUserId={myId}
                        variant="gold"
                        size="terminal"
                        label="New trophy"
                    />
                </div>

                <TrophyStats game={game} memberCount={memberCount} />
            </section>

            <section className="mt-10 flex flex-col gap-4">
                <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    reward history
                </h2>
                <TrophyHistory game={game} />
            </section>
        </main>
    );
}

function TrophyStats({
    game,
    memberCount,
}: {
    game: groupsGameDetail_game$key;
    memberCount: number;
}) {
    const { data } = usePaginationFragment(GroupGameDetailTrophiesFragment, game);
    const totalCount = data.trophies?.totalCount ?? 0;

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <StatReadout
                label="Awards"
                value={totalCount}
                description="Trophies handed out."
                accented
            />
            <StatReadout
                label="Recipients"
                value={memberCount}
                description="Members eligible to receive."
            />
        </div>
    );
}
