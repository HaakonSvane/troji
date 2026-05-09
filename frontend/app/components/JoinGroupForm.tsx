import { useState } from "react";
import { graphql, useMutation } from "react-relay";
import { useNavigate } from "react-router";
import type { JoinGroupFormMutation } from "@/__generated__/JoinGroupFormMutation.graphql";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const JoinGroupMutation = graphql`
    mutation JoinGroupFormMutation($input: JoinGroupInput!) {
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

interface JoinGroupFormProps {
    onJoined?: () => void;
}

export function JoinGroupForm({ onJoined }: JoinGroupFormProps) {
    const navigate = useNavigate();
    const [joinCode, setJoinCode] = useState("");
    const [joinError, setJoinError] = useState<string | null>(null);

    const [commitJoin, isJoining] = useMutation<JoinGroupFormMutation>(JoinGroupMutation);

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        setJoinError(null);

        const inviteCode = joinCode.trim();
        if (!inviteCode) {
            setJoinError("Enter an invite code.");
            return;
        }

        commitJoin({
            variables: { input: { inviteCode } },
            onCompleted: (response) => {
                const payload = response.joinGroup;
                if (payload?.group?.id) {
                    onJoined?.();
                    navigate(`/groups/${payload.group.id}`);
                    return;
                }

                const expired = payload?.errors?.find(
                    (error) => error?.__typename === "InviteExpiredError"
                );
                setJoinError(
                    expired ? "This invite has expired." : "Could not join circle. Check the code."
                );
            },
            onError: () => setJoinError("Could not join circle. Please try again."),
        });
    };

    return (
        <form className="flex flex-col gap-3" onSubmit={handleJoin}>
            <Input
                placeholder="Invite code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                disabled={isJoining}
            />
            {joinError && <p className="text-sm text-destructive">{joinError}</p>}
            <div className="flex justify-end">
                <Button type="submit" busy={isJoining} disabled={isJoining}>
                    Join circle
                </Button>
            </div>
        </form>
    );
}
