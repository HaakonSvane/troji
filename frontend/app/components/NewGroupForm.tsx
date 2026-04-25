import { useState } from "react";
import { graphql, useMutation } from "react-relay";
import { useNavigate } from "react-router";
import type { NewGroupFormMutation } from "@/__generated__/NewGroupFormMutation.graphql";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DrawerDialog } from "@/components/DrawerDialog";

const CreateGroupMutation = graphql`
    mutation NewGroupFormMutation($input: CreateGroupInput!) {
        createGroup(input: $input) {
            group {
                id
                name
                ...GroupBox_group
            }
            errors {
                __typename
            }
        }
    }
`;

interface NewGroupFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Called with the new group id on success */
    onCreated?: (id: string) => void;
}

export function NewGroupForm({ open, onOpenChange, onCreated }: NewGroupFormProps) {
    const navigate = useNavigate();
    const [commitCreateGroup, isSubmitting] =
        useMutation<NewGroupFormMutation>(CreateGroupMutation);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [decisionModel, setDecisionModel] = useState<"DEMOCRACY" | "DICTATORSHIP">("DEMOCRACY");
    const [formError, setFormError] = useState<string | null>(null);

    const reset = () => {
        setName("");
        setDescription("");
        setDecisionModel("DEMOCRACY");
        setFormError(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        const trimmedName = name.trim();
        if (!trimmedName) {
            setFormError("Group name is required.");
            return;
        }
        commitCreateGroup({
            variables: {
                input: {
                    name: trimmedName,
                    description: description.trim() || null,
                    decisionModel,
                },
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onCompleted: (response: any) => {
                const payload = response.createGroup;
                if (payload?.group?.id) {
                    onOpenChange(false);
                    reset();
                    if (onCreated) {
                        onCreated(payload.group.id);
                    } else {
                        navigate(`/groups/${payload.group.id}`);
                    }
                    return;
                }
                setFormError("Could not create group. Please try again.");
            },
            onError: () => {
                setFormError("Could not create group. Please try again.");
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
            title="Create a group"
            description="Give your group a name and choose how trophies are awarded."
        >
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <Label htmlFor="group-name">Name</Label>
                    <Input
                        id="group-name"
                        placeholder="My crew"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isSubmitting}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="group-description">Description</Label>
                    <Textarea
                        id="group-description"
                        placeholder="What is this group about?"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={isSubmitting}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="group-decision-model">Decision model</Label>
                    <Select
                        value={decisionModel}
                        onValueChange={(v) => setDecisionModel(v as "DEMOCRACY" | "DICTATORSHIP")}
                        disabled={isSubmitting}
                    >
                        <SelectTrigger id="group-decision-model">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="DEMOCRACY">Democracy — majority votes</SelectItem>
                            <SelectItem value="DICTATORSHIP">
                                Dictatorship — admin decides
                            </SelectItem>
                        </SelectContent>
                    </Select>
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
                        {isSubmitting ? "Creating…" : "Create group"}
                    </Button>
                </div>
            </form>
        </DrawerDialog>
    );
}
