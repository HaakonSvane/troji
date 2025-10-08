import { GroupGamesTableRowFragment$key } from "@/__generated__/GroupGamesTableRowFragment.graphql";
import { TableCell, TableRow } from "@/components/ui/table";
import { Suspense } from "react";
import { graphql, useFragment } from "react-relay";

const GroupGamesTableRowFragment = graphql`
    fragment GroupGamesTableRowFragment on Game {
        id
        symbol
        name
        description
        trophies {
            id
        }
        topPlayers(first: 1) {
            edges {
                node {
                    username
                }
            }
        }
    }
`;

type GroupGamesTableRowProps = {
    fragmentKey: GroupGamesTableRowFragment$key;
};

export const GroupGamesTableRow = ({ fragmentKey }: GroupGamesTableRowProps) => {
    const game = useFragment(GroupGamesTableRowFragment, fragmentKey);
    return (
        <Suspense fallback={<p>heee</p>}>
            <TableRow>
                <TableCell className="text-center">{game.symbol}</TableCell>
                <TableCell className="font-medium">{game.name}</TableCell>
                <TableCell className="text-muted">{game.description}</TableCell>
                <TableCell className="text-right">{game.trophies?.length}</TableCell>
                <TableCell className="text-center">
                    {game.topPlayers?.edges?.at(0)?.node.username ?? "None"}
                </TableCell>
            </TableRow>
        </Suspense>
    );
};
