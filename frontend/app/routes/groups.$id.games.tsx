import { graphql, loadQuery, usePreloadedQuery } from "react-relay";
import { useNavigate } from "react-router";
import type { groupsGamesQuery } from "@/__generated__/groupsGamesQuery.graphql";
import { getRelayEnvironment } from "@/relay/environment";
import { GroupGamesTableRow } from "@/components/GroupGamesTableRow";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import type { Route } from "./+types/groups.$id.games";

const GroupGamesPageQuery = graphql`
    query groupsGamesQuery($id: ID!) {
        groupById(id: $id) {
            id
            name
            games(first: 50) {
                totalCount
                edges {
                    node {
                        id
                        ...GroupGamesTableRow_game
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
    const queryRef = loadQuery<groupsGamesQuery>(environment, GroupGamesPageQuery, {
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
        { title: "Games — Troji" },
        { name: "description", content: "All games in this circle." },
    ];
}

export default function GroupGames({ loaderData }: Route.ComponentProps) {
    const navigate = useNavigate();
    const data = usePreloadedQuery(GroupGamesPageQuery, loaderData.queryRef);
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

    const games = group.games?.edges?.map((e) => e?.node).filter(Boolean) ?? [];

    return (
        <main className="container mx-auto flex flex-col gap-6 px-4 py-10 sm:py-14">
            <Breadcrumb
                segments={[
                    { label: "groups", href: "/groups" },
                    { label: group.name, href: `/groups/${group.id}` },
                    { label: "games" },
                ]}
            />
            <div className="flex items-baseline gap-3">
                <h1 className="font-heading text-3xl font-medium tracking-[0.015em]">Games</h1>
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    {group.games?.totalCount ?? 0} total
                </span>
            </div>
            {games.length === 0 ? (
                <div className="surface-card flex flex-col items-start gap-2 p-6 sm:p-8">
                    <p className="font-heading text-xl tracking-[0.015em]">No games yet.</p>
                    <p className="text-sm text-muted-foreground">
                        Go back to the circle and create one.
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {games.map((game) => (
                        <GroupGamesTableRow
                            key={game.id}
                            groupId={group.id}
                            game={game}
                            currentUserId={myId}
                        />
                    ))}
                </div>
            )}
        </main>
    );
}
