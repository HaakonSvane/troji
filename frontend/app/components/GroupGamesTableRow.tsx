import { graphql, useFragment } from "react-relay";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router";
import type { GroupGamesTableRow_game$key } from "@/__generated__/GroupGamesTableRow_game.graphql";
import { AwardTrophyButton } from "@/components/AwardTrophyButton";
import { MedalBadge } from "@/components/MedalBadge";

const GroupGamesTableRowFragment = graphql`
    fragment GroupGamesTableRow_game on Game {
        id
        name
        symbol
        description
        trophies {
            id
        }
    }
`;

interface GroupGamesTableRowProps {
    groupId: string;
    game: GroupGamesTableRow_game$key;
    groupMembers: Array<{ id: string; firstName?: string | null; lastName?: string | null }>;
    currentUserId?: string | null;
}

export function GroupGamesTableRow({
    groupId,
    game,
    groupMembers,
    currentUserId,
}: GroupGamesTableRowProps) {
    const data = useFragment(GroupGamesTableRowFragment, game);
    const trophyLabel =
        data.trophies.length === 1 ? "1 trophy" : `${data.trophies.length} trophies`;

    return (
        <div className="surface-card flex flex-col gap-3 p-4 transition-colors hover:border-medal-gold/40 sm:flex-row sm:items-center sm:justify-between">
            <Link
                to={`/groups/${groupId}/games/${data.id}`}
                className="flex min-w-0 flex-1 items-center gap-4 rounded-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-medal-gold/40"
            >
                <MedalBadge emoji={data.symbol} size="md" title={data.name} />
                <div className="min-w-0 flex-1">
                    <p className="font-heading text-base font-medium tracking-[0.015em] text-foreground">
                        {data.name}
                    </p>
                    {data.description ? (
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                            {data.description}
                        </p>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            Open this game to inspect its rewards and history.
                        </p>
                    )}
                </div>
                <div className="hidden items-center gap-2 sm:flex">
                    <span className="pill-muted">{trophyLabel}</span>
                    <ChevronRightIcon className="size-4 text-muted-foreground" />
                </div>
            </Link>
            <div className="flex items-center justify-between gap-3 sm:justify-end">
                <span className="pill-muted sm:hidden">{trophyLabel}</span>
                <AwardTrophyButton
                    preselectedGameId={data.id}
                    availableGames={[{ id: data.id, name: data.name, symbol: data.symbol }]}
                    groupMembers={groupMembers}
                    currentUserId={currentUserId}
                    variant="outline"
                    size="sm"
                />
            </div>
        </div>
    );
}
