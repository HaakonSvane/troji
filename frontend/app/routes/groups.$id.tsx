import { useState } from "react";
import { graphql, usePreloadedQuery, loadQuery } from "react-relay";
import { ConnectionHandler } from "relay-runtime";
import { useNavigate } from "react-router";
import { Gamepad2, Gift, Plus, Trophy, UserPlus, Users } from "lucide-react";
import type { groupsDetailQuery } from "@/__generated__/groupsDetailQuery.graphql";
import { getRelayEnvironment } from "@/relay/environment";
import { GroupSocialCard } from "@/components/GroupSocialCard";
import { MemberRow } from "@/components/MemberRow";
import { GroupGamesTableRow } from "@/components/GroupGamesTableRow";
import { NewGameForm } from "@/components/NewGameForm";
import { GroupInviteManager } from "@/components/GroupInviteManager";
import { TrophyRequestForm } from "@/components/TrophyRequestForm";
import { TrophyApprovalPanel } from "@/components/TrophyApprovalPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import type { Route } from "./+types/groups.$id";

const GroupPageQuery = graphql`
    query groupsDetailQuery($id: ID!) {
        groupById(id: $id) {
            id
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
    const [activeTab, setActiveTab] = useState("games");
    const [inviteOpen, setInviteOpen] = useState(false);
    const [requestTrophyOpen, setRequestTrophyOpen] = useState(false);
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
    const isAdmin = myId != null && group.admin?.id === myId;

    // Disabled states for award-trophy actions with contextual hints.
    const awardTrophyDisabled =
        members.length < 2
            ? { isDisabled: true, reason: "You need at least one other member to award a trophy." }
            : false;
    const newTrophyDisabled =
        members.length < 2
            ? { isDisabled: true, reason: "You need at least one other member to award a trophy." }
            : games.length === 0
              ? { isDisabled: true, reason: "Create a game first before awarding trophies." }
              : false;

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
                    <GroupSocialCard
                        group={group}
                        memberCount={members.length}
                        currentUserId={myId}
                    />
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="h-11 rounded-xl p-1">
                        <TabsTrigger
                            value="games"
                            className="px-4 data-[state=active]:scale-110 hover:text-current"
                        >
                            <Gamepad2 className="size-4" />
                            Games
                        </TabsTrigger>
                        <TabsTrigger
                            value="members"
                            className="px-4 data-[state=active]:scale-110 hover:text-current"
                        >
                            <Users className="size-4" />
                            Members
                        </TabsTrigger>
                        <TabsTrigger
                            value="trophies"
                            className="px-4 data-[state=active]:scale-110 hover:text-current"
                        >
                            <Trophy className="size-4" />
                            Trophies
                        </TabsTrigger>
                    </TabsList>

                    {/* Games tab */}
                    <TabsContent value="games" className="mt-4">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="heading-section">Games</h2>
                            {isAdmin && (
                                <Button
                                    size="sm"
                                    leadingIcon={<Plus />}
                                    onClick={() => setNewGameOpen(true)}
                                >
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
                                        awardDisabled={awardTrophyDisabled}
                                        onAwardTrophy={(gameId) => {
                                            setRequestTrophyGameId(gameId);
                                            setRequestTrophyOpen(true);
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {/* Members tab */}
                    <TabsContent value="members" className="mt-4">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="heading-section">Members</h2>
                            {isAdmin && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    leadingIcon={<UserPlus />}
                                    onClick={() => setInviteOpen(true)}
                                >
                                    Invite
                                </Button>
                            )}
                        </div>
                        <div className="divide-y divide-border rounded-xl border border-border px-4">
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

                    {/* Trophies tab */}
                    <TabsContent value="trophies" className="mt-4">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="heading-section">Trophies</h2>
                            <Button
                                size="sm"
                                variant="outline"
                                leadingIcon={<Gift />}
                                disabled={newTrophyDisabled}
                                onClick={() => {
                                    setRequestTrophyGameId(null);
                                    setRequestTrophyOpen(true);
                                }}
                            >
                                New trophy
                            </Button>
                        </div>
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
            <TrophyRequestForm
                gameId={requestTrophyGameId}
                availableGames={trophyGameOptions}
                open={requestTrophyOpen}
                onOpenChange={(open) => {
                    setRequestTrophyOpen(open);
                    if (!open) {
                        setRequestTrophyGameId(null);
                    }
                }}
                groupMembers={
                    members as Array<{
                        id: string;
                        firstName?: string | null;
                        lastName?: string | null;
                    }>
                }
                currentUserId={myId}
            />
        </main>
    );
}
