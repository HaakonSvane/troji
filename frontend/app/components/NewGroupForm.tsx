import { useState } from "react";
import { ConnectionHandler, graphql, useMutation } from "react-relay";
import { useNavigate } from "react-router";
import type { NewGroupFormMutation } from "@/__generated__/NewGroupFormMutation.graphql";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DrawerDialog } from "@/components/DrawerDialog";
import { validateCreateGroupInput } from "@/lib/validation/forms";

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
    /** Relay store ID of the connection owner (the viewer/me record) */
    connectionOwner: string;
    /** Called with the new group id on success */
    onCreated?: (id: string) => void;
}

export function NewGroupForm({
    open,
    onOpenChange,
    connectionOwner,
    onCreated,
}: NewGroupFormProps) {
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
            },
            updater: (store) => {
                const payload = store.getRootField("createGroup");
                const newGroup = payload?.getLinkedRecord("group");
                if (!newGroup) return;

                const owner = store.get(connectionOwner);
                if (!owner) return;

                const conn = ConnectionHandler.getConnection(owner, "Groups_groups");
                if (!conn) return;

                const edge = ConnectionHandler.createEdge(store, conn, newGroup, "GroupsEdge");
                ConnectionHandler.insertEdgeBefore(conn, edge);
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
