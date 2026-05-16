import { useMemo, useState } from "react";
import { graphql, useMutation, useRelayEnvironment } from "react-relay";
import { ConnectionHandler } from "relay-runtime";
import { LayoutGroup, motion } from "motion/react";
import type { TrophyAwardJourneyMutation } from "@/__generated__/TrophyAwardJourneyMutation.graphql";
import { Button } from "@/components/ui/button";
import { DrawerDialog } from "@/components/DrawerDialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MedalBadge } from "@/components/MedalBadge";
import { UserAvatar } from "@/components/UserAvatar";
import { PersonName, formatPersonName } from "@/components/PersonName";
import { cn } from "@/lib/utils";
import { validateCreateTrophyRequestInput } from "@/lib/validation/forms";

const CreateTrophyRequestMutation = graphql`
    mutation TrophyAwardJourneyMutation(
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
                    ...GroupActivityFeed_group
                    awardedTrophyCount
                    topPerformer {
                        user {
                            id
                            firstName
                            middleName
                            lastName
                        }
                        awardCount
                    }
                }
            }
            errors {
                __typename
            }
        }
    }
`;

type Step = "game" | "recipient" | "comment" | "success";

interface Member {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
}

interface AvailableGame {
    id: string;
    name: string;
    symbol: string;
}

interface TrophyAwardJourneyProps {
    gameId: string | null;
    groupId: string;
    availableGames: AvailableGame[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
    groupMembers: Member[];
    currentUserId?: string | null;
    onRequested?: () => void;
}

export function TrophyAwardJourney({
    gameId,
    groupId,
    availableGames,
    open,
    onOpenChange,
    groupMembers,
    currentUserId,
    onRequested,
}: TrophyAwardJourneyProps) {
    const gameIsLocked = gameId != null || availableGames.length === 1;
    const recipientIsLocked = groupMembers.length === 1;

    const initialGameId =
        gameId ?? (availableGames.length === 1 ? availableGames[0].id : "");
    const initialUserId = groupMembers.length === 1 ? groupMembers[0].id : "";

    const nextStep = (current: Step): Step => {
        if (current === "game") return recipientIsLocked ? "comment" : "recipient";
        if (current === "recipient") return "comment";
        return current;
    };

    const initialStep: Step = !initialGameId
        ? "game"
        : !initialUserId
          ? "recipient"
          : "comment";

    const environment = useRelayEnvironment();
    const [commitRequest, isSubmitting] = useMutation<TrophyAwardJourneyMutation>(
        CreateTrophyRequestMutation
    );

    const [step, setStep] = useState<Step>(initialStep);
    const [selectedGameId, setSelectedGameId] = useState(initialGameId);
    const [selectedUserId, setSelectedUserId] = useState(initialUserId);
    const [description, setDescription] = useState("");
    const [formError, setFormError] = useState<string | null>(null);

    const selectedGame = useMemo(
        () => availableGames.find((g) => g.id === selectedGameId) ?? null,
        [availableGames, selectedGameId]
    );
    const selectedMember = useMemo(
        () => groupMembers.find((m) => m.id === selectedUserId) ?? null,
        [groupMembers, selectedUserId]
    );

    const reset = () => {
        setStep(initialStep);
        setSelectedGameId(initialGameId);
        setSelectedUserId(initialUserId);
        setDescription("");
        setFormError(null);
    };

    const closeDialog = (next: boolean) => {
        if (isSubmitting) return;
        onOpenChange(next);
        if (!next) reset();
    };

    const previousStep = (current: Step): Step | null => {
        if (current === "recipient") return gameIsLocked ? null : "game";
        if (current === "comment") {
            if (!recipientIsLocked) return "recipient";
            if (!gameIsLocked) return "game";
            return null;
        }
        return null;
    };

    const back = previousStep(step);

    const goBack = () => {
        if (isSubmitting || !back) return;
        if (back === "game") setSelectedGameId("");
        if (back === "recipient") setSelectedUserId("");
        setStep(back);
        setFormError(null);
    };

    const pickGame = (id: string) => {
        setSelectedGameId(id);
        setStep(nextStep("game"));
    };

    const pickRecipient = (id: string) => {
        setSelectedUserId(id);
        setStep(nextStep("recipient"));
    };

    const submit = () => {
        setFormError(null);
        const validation = validateCreateTrophyRequestInput({
            gameId: selectedGameId,
            userId: selectedUserId,
            description,
        });
        if (!validation.success) {
            setFormError(validation.error);
            return;
        }
        const gameConnectionId = ConnectionHandler.getConnectionID(
            selectedGameId,
            "GameTrophies_trophies"
        );
        const connectionExists = environment.getStore().getSource().has(gameConnectionId);
        commitRequest({
            variables: {
                input: validation.data,
                connections: connectionExists ? [gameConnectionId] : [],
                groupId,
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onCompleted: (response: any) => {
                const payload = response.createTrophyRequest;
                if (payload?.trophy?.id) {
                    setStep("success");
                    onRequested?.();
                    return;
                }
                setFormError("Could not submit trophy request. Please try again.");
            },
            onError: () =>
                setFormError("Could not submit trophy request. Please try again."),
        });
    };

    const title =
        step === "game"
            ? "Pick a game"
            : step === "recipient"
              ? "Pick a recipient"
              : step === "comment"
                ? "Add a note"
                : "Awarded";

    const dialogDescription =
        step === "game"
            ? "Which game earned them a medal?"
            : step === "recipient"
              ? "Who is this medal going to?"
              : step === "comment"
                ? "Add a short reason, or leave it blank."
                : undefined;

    return (
        <DrawerDialog
            open={open}
            onOpenChange={closeDialog}
            title={title}
            description={dialogDescription}
            footer={
                step === "success" ? (
                    <div className="flex justify-end">
                        <Button onClick={() => closeDialog(false)}>Done</Button>
                    </div>
                ) : step === "comment" ? (
                    <div className="flex justify-end gap-2">
                        {back && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={goBack}
                                disabled={isSubmitting}
                            >
                                Back
                            </Button>
                        )}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => closeDialog(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            busy={isSubmitting}
                            disabled={isSubmitting}
                            onClick={submit}
                        >
                            Award trophy
                        </Button>
                    </div>
                ) : (
                    <div className="flex justify-end gap-2">
                        {back && (
                            <Button type="button" variant="outline" onClick={goBack}>
                                Back
                            </Button>
                        )}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => closeDialog(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                )
            }
        >
            <LayoutGroup id="award-journey">
                <Breadcrumb step={step} game={selectedGame} member={selectedMember} />
                <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="min-h-[280px]"
                >
                    {step === "game" && (
                        <GameStep
                            games={availableGames}
                            selectedGame={selectedGame}
                            onPick={pickGame}
                        />
                    )}
                    {step === "recipient" && (
                        <RecipientStep
                            members={groupMembers}
                            selectedMember={selectedMember}
                            currentUserId={currentUserId}
                            onPick={pickRecipient}
                        />
                    )}
                    {step === "comment" && (
                        <CommentStep
                            description={description}
                            onChange={setDescription}
                            disabled={isSubmitting}
                        />
                    )}
                    {step === "success" && (
                        <SuccessStep
                            game={selectedGame}
                            member={selectedMember}
                            currentUserId={currentUserId}
                        />
                    )}
                    {formError && (
                        <p className="pt-3 text-sm text-destructive">{formError}</p>
                    )}
                </motion.div>
            </LayoutGroup>
        </DrawerDialog>
    );
}

function Breadcrumb({
    step,
    game,
    member,
}: {
    step: Step;
    game: AvailableGame | null;
    member: Member | null;
}) {
    const showMedal = step !== "game" && game != null;
    const showAvatar = (step === "comment" || step === "success") && member != null;
    if (!showMedal && !showAvatar) {
        return <div className="h-12" aria-hidden />;
    }
    return (
        <div className="flex h-12 items-center justify-center gap-3">
            {showMedal && (
                <motion.span
                    layoutId="award-medal"
                    className="inline-flex rounded-full"
                >
                    <MedalBadge emoji={game!.symbol} size="sm" title={game!.name} />
                </motion.span>
            )}
            {showMedal && showAvatar && (
                <span className="font-mono text-sm text-medal-gold/70">›</span>
            )}
            {showAvatar && (
                <motion.span
                    layoutId="award-avatar"
                    className="inline-flex rounded-full"
                >
                    <UserAvatar
                        firstName={member!.firstName}
                        lastName={member!.lastName}
                        size="sm"
                    />
                </motion.span>
            )}
        </div>
    );
}

function GameStep({
    games,
    selectedGame,
    onPick,
}: {
    games: AvailableGame[];
    selectedGame: AvailableGame | null;
    onPick: (id: string) => void;
}) {
    const selectedGameId = selectedGame?.id ?? "";
    return (
        <div className="space-y-5">
            <div className="flex justify-center py-3">
                <motion.span
                    layoutId="award-medal"
                    className="inline-flex rounded-full"
                >
                    <MedalBadge
                        emoji={selectedGame?.symbol ?? "🏅"}
                        size="lg"
                        awarded={selectedGame != null}
                    />
                </motion.span>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {games.map((g) => (
                    <button
                        key={g.id}
                        type="button"
                        onClick={() => onPick(g.id)}
                        className={cn(
                            "flex items-center gap-3 rounded-md border border-medal-gold/20 bg-surface-muted/60 p-3 text-left transition-colors hover:border-medal-gold/60 hover:bg-surface-muted",
                            g.id === selectedGameId && "border-medal-gold/70"
                        )}
                    >
                        <span className="shrink-0 text-2xl">{g.symbol}</span>
                        <span className="font-sans text-sm">{g.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

function RecipientStep({
    members,
    selectedMember,
    currentUserId,
    onPick,
}: {
    members: Member[];
    selectedMember: Member | null;
    currentUserId?: string | null;
    onPick: (id: string) => void;
}) {
    const selectedUserId = selectedMember?.id ?? "";
    return (
        <div className="space-y-5">
            <div className="flex justify-center py-3">
                <motion.span
                    layoutId="award-avatar"
                    className="inline-flex rounded-full"
                >
                    <UserAvatar
                        firstName={selectedMember?.firstName}
                        lastName={selectedMember?.lastName}
                        size="lg"
                    />
                </motion.span>
            </div>
            <div className="space-y-1.5">
                {members.map((m) => {
                    const fallback = formatPersonName({
                        firstName: m.firstName,
                        lastName: m.lastName,
                        fallback: m.id,
                    });
                    return (
                        <button
                            key={m.id}
                            type="button"
                            onClick={() => onPick(m.id)}
                            className={cn(
                                "flex w-full items-center gap-3 rounded-md border border-medal-gold/20 bg-surface-muted/60 p-3 text-left transition-colors hover:border-medal-gold/60 hover:bg-surface-muted",
                                m.id === selectedUserId && "border-medal-gold/70"
                            )}
                        >
                            <UserAvatar
                                firstName={m.firstName}
                                lastName={m.lastName}
                                size="sm"
                            />
                            <PersonName
                                firstName={m.firstName}
                                lastName={m.lastName}
                                isSelf={m.id === currentUserId}
                                fallback={fallback}
                                className="font-sans text-sm"
                            />
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function CommentStep({
    description,
    onChange,
    disabled,
}: {
    description: string;
    onChange: (value: string) => void;
    disabled: boolean;
}) {
    return (
        <div className="space-y-3 pt-2">
            <Label htmlFor="trophy-description">Reason (optional)</Label>
            <Textarea
                id="trophy-description"
                placeholder="What earned them this reward?"
                rows={5}
                value={description}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
            />
        </div>
    );
}

function SuccessStep({
    game,
    member,
    currentUserId,
}: {
    game: AvailableGame | null;
    member: Member | null;
    currentUserId?: string | null;
}) {
    return (
        <div className="space-y-3 py-4 text-center">
            <p className="font-heading text-2xl text-foreground">Awarded</p>
            {game && member && (
                <p className="text-sm text-supporting">
                    <span className="mr-1">{game.symbol}</span>
                    <span className="font-medium text-foreground/90">{game.name}</span>
                    <span className="mx-1.5 text-muted-foreground">to</span>
                    <PersonName
                        firstName={member.firstName}
                        lastName={member.lastName}
                        isSelf={member.id === currentUserId}
                        fallback={member.id}
                        className="font-medium text-foreground/90"
                    />
                </p>
            )}
        </div>
    );
}
