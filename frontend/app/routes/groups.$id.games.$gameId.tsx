import { useState } from "react";
import { graphql, loadQuery, usePreloadedQuery } from "react-relay";
import { useNavigate } from "react-router";
import type { groupsGameDetailQuery } from "@/__generated__/groupsGameDetailQuery.graphql";
import { MedalBadge } from "@/components/MedalBadge";
import { TrophyApprovalPanel } from "@/components/TrophyApprovalPanel";
import { TrophyRequestForm } from "@/components/TrophyRequestForm";
import { Button } from "@/components/ui/button";
import { getRelayEnvironment } from "@/relay/environment";
import type { Route } from "./+types/groups.$id.games.$gameId";

const GroupGameDetailQuery = graphql`
    query groupsGameDetailQuery($groupId: ID!, $gameId: ID!) {
        groupById(id: $groupId) {
            id
            name
            members(first: 50) {
                edges {
                    node {
                        id
                        firstName
                        lastName
                    }
                }
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
            trophies {
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
                    firstName
                    lastName
                }
                request {
                    id
                    approvals {
                        user {
                            id
                        }
                        isApproved
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
    const queryRef = loadQuery<groupsGameDetailQuery>(environment, GroupGameDetailQuery, {
        groupId: params.id,
        gameId: params.gameId,
    });
    return { queryRef };
}

export function HydrateFallback() {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
    );
}

export function meta() {
    return [{ title: "Game — Troji" }];
}

export default function GroupGameDetail({ loaderData }: Route.ComponentProps) {
    const navigate = useNavigate();
    const data = usePreloadedQuery(GroupGameDetailQuery, loaderData.queryRef);
    const group = data.groupById;
    const game = data.gameById;
    const myId = data.me?.id;
    const [awardOpen, setAwardOpen] = useState(false);

    if (!group || !game || game.group?.id !== group.id) {
        return (
            <main className="container mx-auto px-4 py-8">
                <p className="text-supporting">Game not found.</p>
                <Button variant="link" className="mt-2 px-0" onClick={() => navigate("/groups")}>
                    ← Back to groups
                </Button>
            </main>
        );
    }

    const members = group.members?.edges?.map((edge) => edge?.node).filter(Boolean) ?? [];
    const trophies = game.trophies ?? [];

    return (
        <main className="container mx-auto px-4 py-8">
            <Button
                variant="link"
                className="mb-4 px-0 text-muted-foreground"
                onClick={() => navigate(`/groups/${group.id}`)}
            >
                ← {group.name}
            </Button>
            <section className="surface-card space-y-6 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start gap-4">
                        <MedalBadge
                            emoji={game.symbol}
                            size="md"
                            title={game.name}
                            className="md:size-14"
                        />
                        <div className="space-y-2">
                            <p className="heading-section">Game</p>
                            <div>
                                <h1 className="heading-page text-2xl">{game.name}</h1>
                                <p className="mt-2 text-supporting">
                                    {game.description ||
                                        "Use this reward to celebrate standout moments in the group."}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="pill-muted">
                            {trophies.length === 1
                                ? "1 trophy awarded"
                                : `${trophies.length} trophies awarded`}
                        </span>
                        <Button onClick={() => setAwardOpen(true)}>Award trophy</Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="surface-card bg-surface p-4 shadow-none">
                        <p className="heading-section">Recipients</p>
                        <p className="mt-3 text-2xl font-semibold">{members.length}</p>
                        <p className="mt-1 text-supporting">
                            Eligible group members for quick handouts.
                        </p>
                    </div>
                    <div className="surface-card bg-surface p-4 shadow-none">
                        <p className="heading-section">Awards</p>
                        <p className="mt-3 text-2xl font-semibold">
                            {trophies.filter((trophy) => trophy.isAwarded).length}
                        </p>
                        <p className="mt-1 text-supporting">Completed rewards tied to this game.</p>
                    </div>
                    <div className="surface-card bg-surface p-4 shadow-none">
                        <p className="heading-section">Pending</p>
                        <p className="mt-3 text-2xl font-semibold">
                            {trophies.filter((trophy) => !trophy.isAwarded).length}
                        </p>
                        <p className="mt-1 text-supporting">Requests still waiting to settle.</p>
                    </div>
                </div>
            </section>

            <section className="mt-6 space-y-3">
                <h2 className="heading-section">Reward history</h2>
                <TrophyApprovalPanel
                    trophies={trophies as Parameters<typeof TrophyApprovalPanel>[0]["trophies"]}
                    myId={myId}
                />
            </section>

            <TrophyRequestForm
                gameId={game.id}
                open={awardOpen}
                onOpenChange={setAwardOpen}
                groupMembers={
                    members as Array<{
                        id: string;
                        firstName?: string | null;
                        lastName?: string | null;
                    }>
                }
            />
        </main>
    );
}
