import { graphql, useFragment } from "react-relay";
import type { GroupGamesTableRow_game$key } from "@/__generated__/GroupGamesTableRow_game.graphql";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

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
    game: GroupGamesTableRow_game$key;
    onRequestTrophy?: (gameId: string) => void;
}

export function GroupGamesTableRow({ game, onRequestTrophy }: GroupGamesTableRowProps) {
    const data = useFragment(GroupGamesTableRowFragment, game);

    return (
        <TableRow>
            <TableCell className="w-12 text-2xl">{data.symbol}</TableCell>
            <TableCell>
                <div>
                    <p className="font-medium">{data.name}</p>
                    {data.description && (
                        <p className="text-xs text-muted-foreground">{data.description}</p>
                    )}
                </div>
            </TableCell>
            <TableCell className="text-center text-sm text-muted-foreground">
                {data.trophies.length}
            </TableCell>
            <TableCell className="text-right">
                <Button variant="outline" size="sm" onClick={() => onRequestTrophy?.(data.id)}>
                    Request trophy
                </Button>
            </TableCell>
        </TableRow>
    );
}
