import { useState } from "react";
import { graphql, usePreloadedQuery, loadQuery } from "react-relay";
import { ConnectionHandler } from "relay-runtime";
import { Link, useNavigate } from "react-router";
import { PlusIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import type { groupsDetailQuery } from "@/__generated__/groupsDetailQuery.graphql";
import { getRelayEnvironment } from "@/relay/environment";
import { GroupSocialCard } from "@/components/GroupSocialCard";
import { MemberRow } from "@/components/MemberRow";
import { GroupGamesTableRow } from "@/components/GroupGamesTableRow";
import { NewGameForm } from "@/components/NewGameForm";
import { GroupInviteManager } from "@/components/GroupInviteManager";
import { AwardTrophyButton } from "@/components/AwardTrophyButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import type { Route } from "./+types/groups.$id";

const GroupPageQuery = graphql`
    query groupsDetailQuery($id: ID!) {
        groupById(id: $id) {
            id
            name
            admin {
                id
            }
            ...GroupSocialCard_group
            games(first: 50, order: { createdDate: DESC })
                @connection(key: "GroupDetail_games", filters: ["order"]) {
                edges {
                    node {
                        id
                        name
                        symbol
                        ...GroupGamesTableRow_game
                    }
                }
            }
            members(first: 50) {
                edges {
                    node {
                        id
                        firstName
                        lastName
                        ...MemberRow_user
                    }
                }
            }
            invite {
                inviteCode
                expirationDate
            }
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
            }
        }
        me {
            id
        }
    }
`;

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    const environment = getRelayEnvironment();
    const queryRef = loadQuery<groupsDetailQuery>(environment, GroupPageQuery, { id: params.id });
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
    return [{ title: "Group — Troji" }];
}

function TabCount({ value }: { value: number }) {
    return (
        <span className="ml-2 rounded-sm border border-border px-1.5 py-0.5 font-mono text-[10px] tracking-wide text-muted-foreground">
            {value}
        </span>
    );
}

export default function GroupDetail({ loaderData }: Route.ComponentProps) {
    const navigate = useNavigate();
    const data = usePreloadedQuery(GroupPageQuery, loaderData.queryRef);
    const group = data.groupById;
    const myId = data.me?.id;

    const [newGameOpen, setNewGameOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("games");
    const [inviteOpen, setInviteOpen] = useState(false);

    if (!group) {
        return (
            <main className="container mx-auto flex flex-col items-start gap-3 px-4 py-10">
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-destructive">
                    <span aria-hidden className="mr-2">!</span>
                    not found
                </p>
                <h1 className="font-heading text-3xl italic tracking-[0.015em]">
                    That circle isn&apos;t here.
                </h1>
                <Button variant="outline" size="terminal" onClick={() => navigate("/groups")}>
                    <span aria-hidden>‹</span>
                    Back to circles
                </Button>
            </main>
        );
    }

    const games = group.games?.edges?.map((e) => e?.node).filter(Boolean) ?? [];
    const members = group.members?.edges?.map((e) => e?.node).filter(Boolean) ?? [];
    const isAdmin = myId != null && group.admin?.id === myId;

    const trophyGameOptions = games.map((game) => ({
        id: game!.id,
        name: game!.name,
        symbol: game!.symbol,
    }));
    const gameConnections = [
        ConnectionHandler.getConnectionID(group.id, "GroupDetail_games", {
            order: { createdDate: "DESC" },
        }),
    ];

    return (
        <main className="container mx-auto px-4 py-10 sm:py-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                <span className="text-medal-gold">$</span>
                <Link
                    to="/groups"
                    className="ml-2 transition-colors hover:text-foreground"
                >
                    groups
                </Link>
                <span aria-hidden className="mx-2 text-border">
                    /
                </span>
                <span className="text-foreground/85">{group.name}</span>
            </p>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
                <div>
                    <GroupSocialCard
                        group={group}
                        memberCount={members.length}
                        currentUserId={myId}
                    />
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="games">
                            Games
                            <TabCount value={games.length} />
                        </TabsTrigger>
                        <TabsTrigger value="members">
                            Members
                            <TabCount value={members.length} />
                        </TabsTrigger>
                        <TabsTrigger value="trophies">
                            Trophies
                            <TabCount value={group.trophies?.length ?? 0} />
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="games" className="mt-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                                games in this circle
                            </h2>
                            {isAdmin ? (
                                <Button
                                    size="sm"
                                    leadingIcon={<PlusIcon />}
                                    onClick={() => setNewGameOpen(true)}
                                >
                                    New game
                                </Button>
                            ) : null}
                        </div>
                        {games.length === 0 ? (
                            <div className="surface-card flex flex-col items-start gap-3 p-6 sm:p-8">
                                <p className="font-heading text-xl italic tracking-[0.015em]">
                                    No games yet.
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {isAdmin
                                        ? "Create one and start handing out trophies."
                                        : "Wait for the owner to add a game."}
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {games.map((game) => (
                                    <GroupGamesTableRow
                                        key={game!.id}
                                        groupId={group.id}
                                        game={game!}
                                        groupMembers={
                                            members as Array<{
                                                id: string;
                                                firstName?: string | null;
                                                lastName?: string | null;
                                            }>
                                        }
                                        currentUserId={myId}
                                    />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="members" className="mt-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                                people in this circle
                            </h2>
                            {isAdmin ? (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    leadingIcon={<UserPlusIcon />}
                                    onClick={() => setInviteOpen(true)}
                                >
                                    Invite
                                </Button>
                            ) : null}
                        </div>
                        <div className="surface-card divide-y divide-border px-4">
                            {members.map((member) => (
                                <MemberRow
                                    key={member!.id}
                                    user={member!}
                                    isAdmin={member!.id === group.admin?.id}
                                    isSelf={member!.id === myId}
                                />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="trophies" className="mt-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                                rewards handed out
                            </h2>
                            <AwardTrophyButton
                                preselectedGameId={null}
                                availableGames={trophyGameOptions}
                                groupMembers={
                                    members as Array<{
                                        id: string;
                                        firstName?: string | null;
                                        lastName?: string | null;
                                    }>
                                }
                                currentUserId={myId}
                                label="New trophy"
                                variant="outline"
                                size="sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            {group.trophies && group.trophies.length > 0 ? (
                                group.trophies.map((trophy) => (
                                    <div
                                        key={trophy.id}
                                        className="surface-card flex items-center gap-4 p-4"
                                    >
                                        <div
                                            aria-hidden
                                            className="text-2xl"
                                        >
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
                                            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-medal-gold/80">
                                                <span aria-hidden className="mr-2">▸</span>
                                                awarded to {trophy.receiver?.firstName}{" "}
                                                {trophy.receiver?.lastName}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="surface-card flex flex-col items-start gap-3 p-6 sm:p-8">
                                    <p className="font-heading text-xl italic tracking-[0.015em]">
                                        No trophies awarded yet.
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Settle a rivalry. Crown a champion.
                                    </p>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            <NewGameForm
                groupId={group.id}
                connections={gameConnections}
                open={newGameOpen}
                onOpenChange={setNewGameOpen}
            />
            <GroupInviteManager
                open={inviteOpen}
                onOpenChange={setInviteOpen}
                groupId={group.id}
                invite={group.invite ?? null}
            />
        </main>
    );
}
