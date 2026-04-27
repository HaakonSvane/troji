import { useState } from "react";
import { graphql, useMutation } from "react-relay";
import type { NewGameFormMutation } from "@/__generated__/NewGameFormMutation.graphql";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DrawerDialog } from "@/components/DrawerDialog";
import { EmojiPicker } from "@/components/EmojiPicker";
import {
    getMutationErrorMessage,
    getMutationNetworkErrorMessage,
} from "@/lib/relay/mutationErrors";
import { validateCreateGameInput } from "@/lib/validation/forms";

const CreateGameMutation = graphql`
    mutation NewGameFormMutation($input: CreateGameInput!, $connections: [ID!]!) {
        createGame(input: $input) {
            game @prependNode(connections: $connections, edgeTypeName: "GamesEdge") {
                id
                ...GroupGamesTableRow_game
            }
            errors {
                __typename
                ... on Error {
                    message
                }
            }
        }
    }
`;

interface NewGameFormProps {
    groupId: string;
    connections: string[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreated?: (gameId: string) => void;
}

export function NewGameForm({
    groupId,
    connections,
    open,
    onOpenChange,
    onCreated,
}: NewGameFormProps) {
    const [commitCreateGame, isSubmitting] = useMutation<NewGameFormMutation>(CreateGameMutation);

    const [name, setName] = useState("");
    const [symbol, setSymbol] = useState("🏆");
    const [description, setDescription] = useState("");
    const [formError, setFormError] = useState<string | null>(null);

    const reset = () => {
        setName("");
        setSymbol("🏆");
        setDescription("");
        setFormError(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        const validation = validateCreateGameInput({
            groupId,
            name,
            symbol,
            description,
        });
        if (!validation.success) {
            setFormError(validation.error);
            return;
        }

        commitCreateGame({
            variables: {
                input: validation.data,
                connections,
            },
            optimisticResponse: {
                createGame: {
                    game: {
                        __typename: "Game",
                        id: `client:new-game:${groupId}:${validation.data.name}`,
                        name: validation.data.name,
                        symbol: validation.data.symbol,
                        description: validation.data.description,
                        trophies: [],
                    },
                    errors: [],
                },
            },
            onCompleted: (response) => {
                const payload = response.createGame;
                if (payload?.game?.id) {
                    onOpenChange(false);
                    reset();
                    onCreated?.(payload.game.id);
                    return;
                }
                setFormError(
                    getMutationErrorMessage(
                        payload?.errors,
                        "Could not create game. Please try again."
                    )
                );
            },
            onError: (error) => {
                setFormError(
                    getMutationNetworkErrorMessage(
                        error,
                        "Could not create game. Please try again."
                    )
                );
            },
        });
    };

    return (
        <DrawerDialog
            open={open}
            onOpenChange={(next) => {
                if (!isSubmitting) {
                    onOpenChange(next);
                    if (!next) reset();
                }
            }}
            title="Create a game"
            description="Define what a win means in this game."
        >
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <Label>Symbol</Label>
                    <EmojiPicker value={symbol} onChange={setSymbol} disabled={isSubmitting} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="game-name">Name</Label>
                    <Input
                        id="game-name"
                        placeholder="Best clutch play"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isSubmitting}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="game-description">Description</Label>
                    <Textarea
                        id="game-description"
                        placeholder="What does it mean to win this game?"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={isSubmitting}
                    />
                </div>
                {formError && <p className="text-sm text-destructive">{formError}</p>}
                <div className="flex justify-end gap-2 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isSubmitting}
                        onClick={() => {
                            onOpenChange(false);
                            reset();
                        }}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" busy={isSubmitting} disabled={isSubmitting}>
                        Create game
                    </Button>
                </div>
            </form>
        </DrawerDialog>
    );
}
