import { GroupGamesPanelFragment$key } from "@/__generated__/GroupGamesPanelFragment.graphql";
import { Button } from "@/components/ui/button";
import {
    DrawerDialog,
    DrawerDialogBody,
    DrawerDialogContent,
    DrawerDialogDescription,
    DrawerDialogHeader,
    DrawerDialogTitle,
    DrawerDialogTrigger,
} from "@/components/ui/drawerDialog";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCaption,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Dices } from "lucide-react";
import { useState } from "react";
import { graphql, useFragment } from "react-relay";
import { toast } from "sonner";
import { GroupGamesTableRow } from "./GroupGamesTableRow";
import { NewGameForm } from "./NewGameForm";

const GroupGamesPanelFragment = graphql`
    fragment GroupGamesPanelFragment on Group {
        id
        games(first: 10, order: [{ createdDate: DESC }]) @connection(key: "GroupGamesPanel_games") {
            __id
            edges {
                node {
                    id
                    ...GroupGamesTableRowFragment
                }
            }
        }
    }
`;

type GroupGamesPanelProps = {
    fragmentKey: GroupGamesPanelFragment$key;
};

export const GroupGamesPanel = ({ fragmentKey }: GroupGamesPanelProps) => {
    const data = useFragment(GroupGamesPanelFragment, fragmentKey);
    const [isCreateGameDialogOpen, setIsCreateGameDialogOpen] = useState<boolean>(false);

    const onCreateNewGameSuccess = () => {
        setIsCreateGameDialogOpen(false);
        toast.success("Successfully created a new game!");
    };

    return (
        <>
            <div className="flex flex-row gap-4">
                <Input placeholder="Search for a game..." />
                <DrawerDialog
                    open={isCreateGameDialogOpen}
                    onOpenChange={setIsCreateGameDialogOpen}
                >
                    <DrawerDialogTrigger asChild>
                        <Button
                            variant="secondary"
                            leadingIcon={Dices}
                            className="whitespace-nowrap"
                        >
                            Create game
                        </Button>
                    </DrawerDialogTrigger>
                    <DrawerDialogContent>
                        <DrawerDialogHeader>
                            <DrawerDialogTitle>Create a new game</DrawerDialogTitle>
                            <DrawerDialogDescription>
                                Create a new game for all members of this group to compete in. The
                                rules of the game is up for you to decide, but make sure to give the
                                game a fitting trophy for future winners!
                            </DrawerDialogDescription>
                        </DrawerDialogHeader>
                        <DrawerDialogBody>
                            <NewGameForm
                                groupId={data.id}
                                connectionId={data.games!.__id}
                                onSuccess={onCreateNewGameSuccess}
                            />
                        </DrawerDialogBody>
                    </DrawerDialogContent>
                </DrawerDialog>
            </div>
            <Table>
                <TableCaption>A list of this group's games!</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Trophies</TableHead>
                        <TableHead className="text-right">Top player</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.games?.edges?.map(game => (
                        <GroupGamesTableRow key={game.node.id} fragmentKey={game.node} />
                    ))}
                </TableBody>
            </Table>
        </>
    );
};
