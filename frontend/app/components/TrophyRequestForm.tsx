import { useState } from "react";
import { graphql, useMutation } from "react-relay";
import { ConnectionHandler } from "relay-runtime";
import type { TrophyRequestFormMutation } from "@/__generated__/TrophyRequestFormMutation.graphql";
import { Button } from "@/components/ui/button";
import { PersonName, formatPersonName } from "@/components/PersonName";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DrawerDialog } from "@/components/DrawerDialog";
import { validateCreateTrophyRequestInput } from "@/lib/validation/forms";

const CreateTrophyRequestMutation = graphql`
    mutation TrophyRequestFormMutation(
        $input: CreateTrophyRequestInput!
        $connections: [ID!]!
        $groupId: ID!
    ) {
        createTrophyRequest(input: $input) {
            trophy @appendNode(connections: $connections, edgeTypeName: "TrophiesEdge") {
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
            }
            query {
                groupById(id: $groupId) {
                    recentActivity(first: 20) {
                        __typename
                        id
                        occurredAt
                        ... on TrophyAwardedActivity {
                            trophy {
                                id
                                description
                                game {
                                    id
                                    symbol
                                    name
                                }
                                receiver {
                                    id
                                    firstName
                                    middleName
                                    lastName
                                }
                                awardedBy {
                                    id
                                    firstName
                                    middleName
                                    lastName
                                }
                            }
                        }
                        ... on MemberJoinedActivity {
                            member {
                                id
                                firstName
                                middleName
                                lastName
                            }
                        }
                    }
                }
            }
            errors {
                __typename
            }
        }
    }
`;

interface Member {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
}

interface TrophyRequestFormProps {
    gameId: string | null;
    groupId: string;
    availableGames: Array<{ id: string; name: string; symbol: string }>;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    groupMembers: Member[];
    currentUserId?: string | null;
    onRequested?: () => void;
}

export function TrophyRequestForm({
    gameId,
    groupId,
    availableGames,
    open,
    onOpenChange,
    groupMembers,
    currentUserId,
    onRequested,
}: TrophyRequestFormProps) {
    const [commitRequest, isSubmitting] = useMutation<TrophyRequestFormMutation>(
        CreateTrophyRequestMutation
    );

    const [selectedGameId, setSelectedGameId] = useState(gameId ?? "");
    const [userId, setUserId] = useState("");
    const [description, setDescription] = useState("");
    const [formError, setFormError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const effectiveGameId = gameId ?? selectedGameId;

    const reset = () => {
        setSelectedGameId(gameId ?? "");
        setUserId("");
        setDescription("");
        setFormError(null);
        setSuccess(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        if (!effectiveGameId) {
            setFormError("Select a game.");
            return;
        }

        const validation = validateCreateTrophyRequestInput({
            gameId: effectiveGameId,
            userId,
            description,
        });
        if (!validation.success) {
            setFormError(validation.error);
            return;
        }

        const gameConnectionId = ConnectionHandler.getConnectionID(effectiveGameId, "GameTrophies_trophies");
        const groupConnectionId = ConnectionHandler.getConnectionID(groupId, "GroupTrophies_trophies");

        commitRequest({
            variables: {
                input: validation.data,
                connections: [gameConnectionId, groupConnectionId],
                groupId,
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onCompleted: (response: any) => {
                const payload = response.createTrophyRequest;
                if (payload?.trophy?.id) {
                    setSuccess(true);
                    onRequested?.();
                    return;
                }
                setFormError("Could not submit trophy request. Please try again.");
            },
            onError: () => setFormError("Could not submit trophy request. Please try again."),
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
            title="Award a trophy"
            description="Choose who should receive this reward and add a note if you want."
            footer={
                success ? (
                    <div className="flex justify-end">
                        <Button
                            onClick={() => {
                                onOpenChange(false);
                                reset();
                            }}
                        >
                            Done
                        </Button>
                    </div>
                ) : (
                    <div className="flex justify-end gap-2">
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
                        <Button
                            type="submit"
                            form="trophy-request-form"
                            busy={isSubmitting}
                            disabled={isSubmitting}
                        >
                            Award trophy
                        </Button>
                    </div>
                )
            }
        >
            {success ? (
                <div className="space-y-4 py-2">
                    <p className="text-supporting">Trophy request submitted successfully.</p>
                </div>
            ) : (
                <form id="trophy-request-form" className="space-y-4" onSubmit={handleSubmit}>
                    {!gameId && (
                        <div className="space-y-2">
                            <Label htmlFor="trophy-game">Game</Label>
                            <Select
                                value={selectedGameId}
                                onValueChange={setSelectedGameId}
                                disabled={isSubmitting}
                            >
                                <SelectTrigger id="trophy-game">
                                    <SelectValue placeholder="Select a game..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableGames.map((game) => (
                                        <SelectItem key={game.id} value={game.id}>
                                            {game.symbol} {game.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="trophy-recipient">Recipient</Label>
                        <Select value={userId} onValueChange={setUserId} disabled={isSubmitting}>
                            <SelectTrigger id="trophy-recipient">
                                <SelectValue placeholder="Select a member…" />
                            </SelectTrigger>
                            <SelectContent>
                                {groupMembers.map((m) => {
                                    const label = formatPersonName({
                                        firstName: m.firstName,
                                        lastName: m.lastName,
                                        fallback: m.id,
                                    });
                                    return (
                                        <SelectItem key={m.id} value={m.id}>
                                            <PersonName
                                                firstName={m.firstName}
                                                lastName={m.lastName}
                                                fallback={label}
                                                isSelf={m.id === currentUserId}
                                            />
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="trophy-description">Reason (optional)</Label>
                        <Textarea
                            id="trophy-description"
                            placeholder="What earned them this reward?"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>
                    {formError && <p className="text-sm text-destructive">{formError}</p>}
                </form>
            )}
        </DrawerDialog>
    );
}
