import { useState } from "react";
import { graphql, usePreloadedQuery, loadQuery } from "react-relay";
import { ConnectionHandler } from "relay-runtime";
import { useNavigate } from "react-router";
import type { groupsDetailQuery } from "@/__generated__/groupsDetailQuery.graphql";
import { getRelayEnvironment } from "@/relay/environment";
import { GroupHero } from "@/components/GroupHero";
import { GroupTopPerformer } from "@/components/GroupTopPerformer";
import { GroupMembersCard } from "@/components/GroupMembersCard";
import { GroupActivityFeed } from "@/components/GroupActivityFeed";
import { GroupAside } from "@/components/GroupAside";
import { NewGameForm } from "@/components/NewGameForm";
import { GroupInviteManager } from "@/components/GroupInviteManager";
import { Button } from "@/components/ui/button";
import type { Route } from "./+types/groups.$id";

const GroupPageQuery = graphql`
    query groupsDetailQuery($id: ID!) {
        groupById(id: $id) {
            id
            admin {
                id
            }
            ...GroupHero_group
            ...GroupActivityFeed_group
            games(first: 3) @connection(key: "GroupDetail_games") {
                totalCount
                edges {
                    node {
                        id
                        name
                        symbol
                        ...GroupGamesTableRow_game
                    }
                }
            }
            members(first: 3) {
                totalCount
                edges {
                    node {
                        id
                        displayName
                        ...MemberRow_user
                    }
                }
            }
            invite {
                inviteCode
                expirationDate
            }
            awardedTrophyCount
            topPerformer {
                user {
                    id
                    displayName
                    avatarUrl(size: 128)
                    profile {
                        firstName
                        middleName
                        lastName
                    }
                }
                awardCount
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
    return [
        { title: "Circle — Troji" },
        { name: "description", content: "Standings, recent activity, and rewards in this circle." },
    ];
}

export default function GroupDetail({ loaderData }: Route.ComponentProps) {
    const navigate = useNavigate();
    const data = usePreloadedQuery(GroupPageQuery, loaderData.queryRef);
    const group = data.groupById;
    const myId = data.me?.id;

    const [newGameOpen, setNewGameOpen] = useState(false);
    const [inviteOpen, setInviteOpen] = useState(false);

    if (!group) {
        return (
            <main className="container mx-auto flex flex-col items-start gap-3 px-4 py-10 sm:py-14">
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-destructive">
                    <span aria-hidden className="mr-2">
                        !
                    </span>
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

    const games = group.games?.edges?.map((e) => e?.node).filter(Boolean) ?? [];
    const members = group.members?.edges?.map((e) => e?.node).filter(Boolean) ?? [];
    const isAdmin = myId != null && group.admin?.id === myId;

    const gameConnections = [
        ConnectionHandler.getConnectionID(group.id, "GroupDetail_games"),
    ];

    return (
        <main className="container mx-auto flex flex-col gap-10 px-4 py-10 sm:py-14">
            <GroupHero
                group={group}
                memberCount={group.members?.totalCount ?? 0}
                awardCount={group.awardedTrophyCount}
                gamesTotalCount={group.games?.totalCount ?? 0}
                isAdmin={isAdmin}
                currentUserId={myId}
                onInvite={() => setInviteOpen(true)}
            />

            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                <GroupTopPerformer
                    user={group.topPerformer?.user ?? null}
                    count={group.topPerformer?.awardCount ?? 0}
                    currentUserId={myId}
                />
                <GroupMembersCard
                    members={members as MembersCardMembers}
                    totalCount={group.members?.totalCount ?? 0}
                    groupId={group.id}
                    adminId={group.admin?.id}
                    currentUserId={myId}
                />
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
                <GroupActivityFeed group={group} groupId={group.id} currentUserId={myId} />
                <GroupAside
                    groupId={group.id}
                    isAdmin={isAdmin}
                    currentUserId={myId}
                    games={games as GroupAsideGames}
                    gamesTotalCount={group.games?.totalCount ?? 0}
                    onNewGame={() => setNewGameOpen(true)}
                />
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

type GroupAsideGames = React.ComponentProps<typeof GroupAside>["games"];
type MembersCardMembers = React.ComponentProps<typeof GroupMembersCard>["members"];
