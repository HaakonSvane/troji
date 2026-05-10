import { PlusIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router";
import { GroupGamesTableRow } from "@/components/GroupGamesTableRow";
import { Button } from "@/components/ui/button";
import type { GroupGamesTableRow_game$key } from "@/__generated__/GroupGamesTableRow_game.graphql";

type GameNode = GroupGamesTableRow_game$key & {
    id: string;
    name: string;
    symbol: string;
};

interface GroupAsideProps {
    groupId: string;
    isAdmin: boolean;
    currentUserId?: string | null;
    games: GameNode[];
    gamesTotalCount: number;
    onNewGame: () => void;
}

export function GroupAside({
    groupId,
    isAdmin,
    currentUserId,
    games,
    gamesTotalCount,
    onNewGame,
}: GroupAsideProps) {
    return (
        <aside className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
                <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    <span className="text-medal-gold">$</span>
                    <span className="ml-2">games</span>
                </h2>
                {isAdmin ? (
                    <Button
                        size="sm"
                        variant="outline"
                        leadingIcon={<PlusIcon />}
                        onClick={onNewGame}
                    >
                        New game
                    </Button>
                ) : null}
            </div>
            {games.length === 0 ? (
                <div className="surface-card flex flex-col items-start gap-2 p-5">
                    <p className="font-heading text-base tracking-[0.015em]">
                        No games yet.
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {isAdmin
                            ? "Create one and start handing out trophies."
                            : "Wait for the owner to add a game."}
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {games.map((game) => (
                        <GroupGamesTableRow
                            key={game.id}
                            groupId={groupId}
                            game={game}
                            currentUserId={currentUserId}
                        />
                    ))}
                </div>
            )}
            {gamesTotalCount > games.length ? (
                <footer className="flex items-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        trailingIcon={<ArrowRightIcon />}
                        asChild
                    >
                        <Link to={`/groups/${groupId}/games`}>
                            View all {gamesTotalCount}
                        </Link>
                    </Button>
                </footer>
            ) : null}
        </aside>
    );
}
