import { graphql, useFragment } from "react-relay";
import { ChevronRight, Gift } from "lucide-react";
import { Link } from "react-router";
import type { GroupGamesTableRow_game$key } from "@/__generated__/GroupGamesTableRow_game.graphql";
import { Button, type ButtonDisabledProp } from "@/components/ui/button";
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
    onAwardTrophy?: (gameId: string) => void;
    awardDisabled?: ButtonDisabledProp;
}

export function GroupGamesTableRow({ groupId, game, onAwardTrophy, awardDisabled }: GroupGamesTableRowProps) {
    const data = useFragment(GroupGamesTableRowFragment, game);
    const trophyLabel = data.trophies.length === 1 ? "1 trophy" : `${data.trophies.length} trophies`;

    return (
        <div className="surface-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <Link
                to={`/groups/${groupId}/games/${data.id}`}
                className="flex min-w-0 flex-1 items-center gap-4 rounded-lg outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
            >
                <MedalBadge emoji={data.symbol} size="md" title={data.name} />
                <div className="min-w-0 flex-1">
                    <p className="font-medium">{data.name}</p>
                    {data.description ? (
                        <p className="text-supporting line-clamp-2">{data.description}</p>
                    ) : (
                        <p className="text-supporting">Open this game to inspect its rewards and history.</p>
                    )}
                </div>
                <div className="hidden items-center gap-2 sm:flex">
                    <span className="pill-muted">{trophyLabel}</span>
                    <ChevronRight className="size-4 text-muted-foreground" />
                </div>
            </Link>
            <div className="flex items-center justify-between gap-3 sm:justify-end">
                <span className="pill-muted sm:hidden">{trophyLabel}</span>
                <Button
                    variant="outline"
                    size="sm"
                    leadingIcon={<Gift />}
                    disabled={awardDisabled}
                    onClick={() => onAwardTrophy?.(data.id)}
                >
                    Award trophy
                </Button>
            </div>
        </div>
    );
}
