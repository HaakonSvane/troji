import { useState } from "react";
import { graphql, useMutation } from "react-relay";
import { Copy, RefreshCcw } from "lucide-react";
import type { GroupInviteManagerMutation } from "@/__generated__/GroupInviteManagerMutation.graphql";
import { DrawerDialog } from "@/components/DrawerDialog";
import { Button } from "@/components/ui/button";

const CreateGroupInviteMutation = graphql`
    mutation GroupInviteManagerMutation($input: CreateGroupInviteInput!) {
        createGroupInvite(input: $input) {
            invite {
                inviteCode
                expirationDate
            }
            errors {
                __typename
                ... on InviteResetTooSoonError {
                    message
                    secondsToWait
                }
            }
        }
    }
`;

interface InviteData {
    inviteCode: string;
    expirationDate: string;
}

interface GroupInviteManagerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    groupId: string;
    invite: InviteData | null;
}

function formatExpiry(iso: string) {
    return new Date(iso).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

export function GroupInviteManager({
    open,
    onOpenChange,
    groupId,
    invite: initialInvite,
}: GroupInviteManagerProps) {
    const [currentInvite, setCurrentInvite] = useState<InviteData | null>(initialInvite);
    const [inviteError, setInviteError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const [commitCreate, isCreating] =
        useMutation<GroupInviteManagerMutation>(CreateGroupInviteMutation);

    const handleCreateInvite = () => {
        setInviteError(null);
        commitCreate({
            variables: { input: { groupId } },
            onCompleted: (response) => {
                const payload = response.createGroupInvite;
                if (payload?.invite) {
                    setCurrentInvite(payload.invite);
                    return;
                }

                const tooSoon = payload?.errors?.find(
                    (error) => error?.__typename === "InviteResetTooSoonError"
                );
                if (tooSoon?.__typename === "InviteResetTooSoonError") {
                    setInviteError(
                        `Wait ${tooSoon.secondsToWait}s before generating a new invite.`
                    );
                    return;
                }

                setInviteError("Could not generate invite. Please try again.");
            },
            onError: () => setInviteError("Could not generate invite. Please try again."),
        });
    };

    const handleCopy = () => {
        if (!currentInvite) return;

        navigator.clipboard.writeText(currentInvite.inviteCode).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <DrawerDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Invite members"
            description="Generate and share an invite code for this group."
        >
            <div className="space-y-3">
                {currentInvite ? (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <code className="flex-1 rounded-md border border-border bg-muted px-3 py-2 text-sm font-mono">
                                {currentInvite.inviteCode}
                            </code>
                            <Button
                                variant="outline"
                                size="sm"
                                leadingIcon={<Copy />}
                                onClick={handleCopy}
                            >
                                {copied ? "Copied!" : "Copy"}
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Expires {formatExpiry(currentInvite.expirationDate)}
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={isCreating}
                            leadingIcon={<RefreshCcw />}
                            onClick={handleCreateInvite}
                        >
                            {isCreating ? "Regenerating..." : "Regenerate"}
                        </Button>
                    </div>
                ) : (
                    <Button disabled={isCreating} onClick={handleCreateInvite}>
                        {isCreating ? "Generating..." : "Generate invite code"}
                    </Button>
                )}
                {inviteError && <p className="text-sm text-destructive">{inviteError}</p>}
            </div>
        </DrawerDialog>
    );
}
