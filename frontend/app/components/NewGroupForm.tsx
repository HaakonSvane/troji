import { useState } from "react";
import { graphql, useMutation } from "react-relay";
import { useNavigate } from "react-router";
import type { NewGroupFormMutation } from "@/__generated__/NewGroupFormMutation.graphql";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DrawerDialog } from "@/components/DrawerDialog";
import {
    getMutationErrorMessage,
    getMutationNetworkErrorMessage,
} from "@/lib/relay/mutationErrors";
import { validateCreateGroupInput } from "@/lib/validation/forms";

const CreateGroupMutation = graphql`
    mutation NewGroupFormMutation($input: CreateGroupInput!, $connections: [ID!]!) {
        createGroup(input: $input) {
            group @prependNode(connections: $connections, edgeTypeName: "GroupsEdge") {
                id
                name
                ...GroupBox_group
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

interface NewGroupFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    connections: string[];
    /** Called with the new group id on success */
    onCreated?: (id: string) => void;
}

export function NewGroupForm({ open, onOpenChange, connections, onCreated }: NewGroupFormProps) {
    const navigate = useNavigate();
    const [commitCreateGroup, isSubmitting] =
        useMutation<NewGroupFormMutation>(CreateGroupMutation);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [formError, setFormError] = useState<string | null>(null);

    const reset = () => {
        setName("");
        setDescription("");
        setFormError(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        const validation = validateCreateGroupInput({
            name,
            description,
        });
        if (!validation.success) {
            setFormError(validation.error);
            return;
        }

        commitCreateGroup({
            variables: {
                input: validation.data,
                connections,
            },
            optimisticResponse: {
                createGroup: {
                    group: {
                        __typename: "Group",
                        id: `client:new-group:${validation.data.name}`,
                        name: validation.data.name,
                        description: validation.data.description,
                        decisionModel: "OPEN",
                    },
                    errors: [],
                },
            },
            onCompleted: (response) => {
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
                setFormError(
                    getMutationErrorMessage(
                        payload?.errors,
                        "Could not create group. Please try again."
                    )
                );
            },
            onError: (error) => {
                setFormError(
                    getMutationNetworkErrorMessage(
                        error,
                        "Could not create group. Please try again."
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
            title="Create a group"
            description="Give your group a name. Trophy gifting is open by default."
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
                        Create group
                    </Button>
                </div>
            </form>
        </DrawerDialog>
    );
}
