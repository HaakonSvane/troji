import { useState } from "react";
import { graphql, useMutation } from "react-relay";
import type { TrophyRequestFormMutation } from "@/__generated__/TrophyRequestFormMutation.graphql";
import { Button } from "@/components/ui/button";
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

const CreateTrophyRequestMutation = graphql`
    mutation TrophyRequestFormMutation($input: CreateTrophyRequestInput!) {
        createTrophyRequest(input: $input) {
            trophy {
                id
                isAwarded
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
    open: boolean;
    onOpenChange: (open: boolean) => void;
    groupMembers: Member[];
    onRequested?: () => void;
}

export function TrophyRequestForm({
    gameId,
    open,
    onOpenChange,
    groupMembers,
    onRequested,
}: TrophyRequestFormProps) {
    const [commitRequest, isSubmitting] = useMutation<TrophyRequestFormMutation>(
        CreateTrophyRequestMutation
    );

    const [userId, setUserId] = useState("");
    const [description, setDescription] = useState("");
    const [formError, setFormError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const reset = () => {
        setUserId("");
        setDescription("");
        setFormError(null);
        setSuccess(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        if (!userId) {
            setFormError("Select a member to receive the trophy.");
            return;
        }
        if (!gameId) return;
        commitRequest({
            variables: {
                input: {
                    gameId,
                    userId,
                    description: description.trim() || null,
                },
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
            title="Request a trophy"
            description="Nominate a member to receive a trophy for this game."
        >
            {success ? (
                <div className="space-y-4 py-2">
                    <p className="text-sm text-muted-foreground">
                        Trophy request submitted! Members will vote or the admin will decide,
                        depending on the group's decision model.
                    </p>
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
                </div>
            ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label htmlFor="trophy-recipient">Recipient</Label>
                        <Select value={userId} onValueChange={setUserId} disabled={isSubmitting}>
                            <SelectTrigger id="trophy-recipient">
                                <SelectValue placeholder="Select a member…" />
                            </SelectTrigger>
                            <SelectContent>
                                {groupMembers.map((m) => {
                                    const label =
                                        [m.firstName, m.lastName].filter(Boolean).join(" ") || m.id;
                                    return (
                                        <SelectItem key={m.id} value={m.id}>
                                            {label}
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
                            placeholder="Why do they deserve this trophy?"
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
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Submitting…" : "Request trophy"}
                        </Button>
                    </div>
                </form>
            )}
        </DrawerDialog>
    );
}
