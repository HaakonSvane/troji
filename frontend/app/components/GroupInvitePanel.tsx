import { useState } from "react";
import { graphql, useMutation } from "react-relay";
import { useNavigate } from "react-router";
import type { GroupInvitePanelCreateMutation } from "@/__generated__/GroupInvitePanelCreateMutation.graphql";
import type { GroupInvitePanelJoinMutation } from "@/__generated__/GroupInvitePanelJoinMutation.graphql";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const CreateGroupInviteMutation = graphql`
    mutation GroupInvitePanelCreateMutation($input: CreateGroupInviteInput!) {
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

const JoinGroupMutation = graphql`
    mutation GroupInvitePanelJoinMutation($input: JoinGroupInput!) {
        joinGroup(input: $input) {
            group {
                id
                name
            }
            errors {
                __typename
                ... on InviteExpiredError {
                    message
                }
            }
        }
    }
`;

interface InviteData {
    inviteCode: string;
    expirationDate: string;
}

interface GroupInvitePanelProps {
    groupId: string;
    invite: InviteData | null;
    isAdmin: boolean;
}

function formatExpiry(iso: string) {
    return new Date(iso).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

export function GroupInvitePanel({ groupId, invite: initialInvite, isAdmin }: GroupInvitePanelProps) {
    const navigate = useNavigate();
    const [currentInvite, setCurrentInvite] = useState<InviteData | null>(initialInvite);
    const [inviteError, setInviteError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const [joinCode, setJoinCode] = useState("");
    const [joinError, setJoinError] = useState<string | null>(null);

    const [commitCreate, isCreating] =
        useMutation<GroupInvitePanelCreateMutation>(CreateGroupInviteMutation);
    const [commitJoin, isJoining] =
        useMutation<GroupInvitePanelJoinMutation>(JoinGroupMutation);

    const handleCreateInvite = () => {
        setInviteError(null);
        commitCreate({
            variables: { input: { groupId } },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onCompleted: (response: any) => {
                const payload = response.createGroupInvite;
                if (payload?.invite) {
                    setCurrentInvite(payload.invite);
                    return;
                }
                const tooSoon = payload?.errors?.find(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (e: any) => e.__typename === "InviteResetTooSoonError"
                );
                if (tooSoon) {
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

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        setJoinError(null);
        const code = joinCode.trim();
        if (!code) {
            setJoinError("Enter an invite code.");
            return;
        }
        commitJoin({
            variables: { input: { inviteCode: code } },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onCompleted: (response: any) => {
                const payload = response.joinGroup;
                if (payload?.group?.id) {
                    navigate(`/groups/${payload.group.id}`);
                    return;
                }
                const expired = payload?.errors?.find(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (e: any) => e.__typename === "InviteExpiredError"
                );
                setJoinError(
                    expired ? "This invite has expired." : "Could not join group. Check the code."
                );
            },
            onError: () => setJoinError("Could not join group. Please try again."),
        });
    };

    return (
        <div className="space-y-6">
            {/* Admin: generate / display invite */}
            {isAdmin && (
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        Invite link
                    </h3>
                    {currentInvite ? (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <code className="flex-1 rounded-md border border-border bg-muted px-3 py-2 text-sm font-mono">
                                    {currentInvite.inviteCode}
                                </code>
                                <Button variant="outline" size="sm" onClick={handleCopy}>
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
                                onClick={handleCreateInvite}
                            >
                                {isCreating ? "Regenerating…" : "Regenerate"}
                            </Button>
                        </div>
                    ) : (
                        <Button disabled={isCreating} onClick={handleCreateInvite}>
                            {isCreating ? "Generating…" : "Generate invite code"}
                        </Button>
                    )}
                    {inviteError && <p className="text-sm text-destructive">{inviteError}</p>}
                </div>
            )}

            {isAdmin && <Separator />}

            {/* Any member: join via code */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Join a group
                </h3>
                <form className="flex gap-2" onSubmit={handleJoin}>
                    <Input
                        placeholder="Invite code"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        disabled={isJoining}
                        className="flex-1"
                    />
                    <Button type="submit" disabled={isJoining}>
                        {isJoining ? "Joining…" : "Join"}
                    </Button>
                </form>
                {joinError && <p className="text-sm text-destructive">{joinError}</p>}
            </div>
        </div>
    );
}
