import { useState } from "react";
import { graphql, usePreloadedQuery, loadQuery } from "react-relay";
import { useNavigate } from "react-router";
import type { groupsDetailQuery } from "@/__generated__/groupsDetailQuery.graphql";
import { getRelayEnvironment } from "@/relay/environment";
import { GroupSocialCard } from "@/components/GroupSocialCard";
import { MemberRow } from "@/components/MemberRow";
import { GroupGamesTableRow } from "@/components/GroupGamesTableRow";
import { NewGameForm } from "@/components/NewGameForm";
import { GroupInvitePanel } from "@/components/GroupInvitePanel";
import { TrophyRequestForm } from "@/components/TrophyRequestForm";
import { TrophyApprovalPanel } from "@/components/TrophyApprovalPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import type { Route } from "./+types/groups.$id";

const GroupPageQuery = graphql`
    query groupsDetailQuery($id: ID!) {
        groupById(id: $id) {
            id
            adminId
            ...GroupSocialCard_group
            games(first: 50, order: { createdDate: DESC })
                @connection(key: "GroupDetail_games", filters: ["order"]) {
                edges {
                    node {
                        id
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
                request {
                    id
                    approvals {
                        userId
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
    const queryRef = loadQuery<groupsDetailQuery>(environment, GroupPageQuery, { id: params.id });
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
    return [{ title: "Group — Troji" }];
}

export default function GroupDetail({ loaderData }: Route.ComponentProps) {
    const navigate = useNavigate();
    const data = usePreloadedQuery(GroupPageQuery, loaderData.queryRef);
    const group = data.groupById;
    const myId = data.me?.id;

    const [newGameOpen, setNewGameOpen] = useState(false);
    const [requestTrophyGameId, setRequestTrophyGameId] = useState<string | null>(null);

    if (!group) {
        return (
            <main className="container mx-auto px-4 py-8">
                <p className="text-muted-foreground">Group not found.</p>
                <Button variant="link" className="px-0 mt-2" onClick={() => navigate("/groups")}>
                    ← Back to groups
                </Button>
            </main>
        );
    }

    const games = group.games?.edges?.map((e) => e?.node).filter(Boolean) ?? [];
    const members = group.members?.edges?.map((e) => e?.node).filter(Boolean) ?? [];
    const isAdmin = myId != null && group.adminId === myId;

    return (
        <main className="container mx-auto px-4 py-8">
            <Button
                variant="link"
                className="px-0 mb-4 text-muted-foreground"
                onClick={() => navigate("/groups")}
            >
                ← Groups
            </Button>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
                {/* Sidebar */}
                <div>
                    <GroupSocialCard group={group} memberCount={members.length} />
                </div>

                {/* Tabs */}
                <Tabs defaultValue="games">
                    <TabsList>
                        <TabsTrigger value="games">Games</TabsTrigger>
                        <TabsTrigger value="members">Members</TabsTrigger>
                        <TabsTrigger value="trophies">Trophies</TabsTrigger>
                        <TabsTrigger value="invite">Invite</TabsTrigger>
                    </TabsList>

                    {/* Games tab */}
                    <TabsContent value="games" className="mt-4">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="heading-section">Games</h2>
                            {isAdmin && (
                                <Button size="sm" onClick={() => setNewGameOpen(true)}>
                                    New game
                                </Button>
                            )}
                        </div>
                        {games.length === 0 ? (
                            <p className="text-supporting">No games yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {games.map((game) => (
                                    <GroupGamesTableRow
                                        key={game!.id}
                                        groupId={group.id}
                                        game={game!}
                                        onAwardTrophy={(gameId) => setRequestTrophyGameId(gameId)}
                                    />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {/* Members tab */}
                    <TabsContent value="members" className="mt-4">
                        <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            Members
                        </h2>
                        <div className="divide-y divide-border rounded-xl border border-border px-4">
                            {members.map((member) => (
                                <MemberRow
                                    key={member!.id}
                                    user={member!}
                                    isAdmin={member!.id === group.adminId}
                                />
                            ))}
                        </div>
                    </TabsContent>

                    {/* Invite tab */}
                    <TabsContent value="invite" className="mt-4">
                        <GroupInvitePanel
                            groupId={group.id}
                            invite={group.invite ?? null}
                            isAdmin={isAdmin}
                        />
                    </TabsContent>

                    {/* Trophies tab */}
                    <TabsContent value="trophies" className="mt-4">
                        <TrophyApprovalPanel
                            trophies={
                                group.trophies as Parameters<
                                    typeof TrophyApprovalPanel
                                >[0]["trophies"]
                            }
                            myId={myId}
                        />
                    </TabsContent>
                </Tabs>
            </div>

            {/* Dialogs */}
            <NewGameForm
                groupId={group.id}
                connectionOwner={group.id}
                open={newGameOpen}
                onOpenChange={setNewGameOpen}
            />
            <TrophyRequestForm
                gameId={requestTrophyGameId}
                open={requestTrophyGameId !== null}
                onOpenChange={(open) => {
                    if (!open) setRequestTrophyGameId(null);
                }}
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
