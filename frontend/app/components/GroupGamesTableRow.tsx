import { graphql, useFragment } from "react-relay";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router";
import type { GroupGamesTableRow_game$key } from "@/__generated__/GroupGamesTableRow_game.graphql";
import { AwardTrophyButton } from "@/components/AwardTrophyButton";

const GroupGamesTableRowFragment = graphql`
    fragment GroupGamesTableRow_game on Game {
        id
        name
        symbol
        description
        trophies {
            totalCount
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
    const trophyCount = data.trophies?.totalCount ?? 0;
    const trophyLabel = trophyCount === 1 ? "1 trophy" : `${trophyCount} trophies`;

    return (
        <div className="surface-card surface-card-interactive overflow-hidden">
            <Link
                to={`/groups/${groupId}/games/${data.id}`}
                className="flex items-start gap-3 p-4 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-medal-gold/40"
            >
                <span aria-hidden className="mt-0.5 shrink-0 text-3xl leading-none">
                    {data.symbol}
                </span>
                <div className="min-w-0 flex-1">
                    <p className="truncate font-heading text-base font-medium tracking-[0.015em] text-foreground">
                        {data.name}
                    </p>
                    {data.description ? (
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                            {data.description}
                        </p>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            Open to inspect rewards.
                        </p>
                    )}
                </div>
                <ChevronRightIcon className="mt-1 size-4 shrink-0 text-muted-foreground" />
            </Link>
            <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
                <span className="pill-muted">{trophyLabel}</span>
                <AwardTrophyButton
                    preselectedGameId={data.id}
                    groupId={groupId}
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
