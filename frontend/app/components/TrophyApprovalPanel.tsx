import { graphql, useMutation } from "react-relay";
import type { TrophyApprovalPanelMutation } from "@/__generated__/TrophyApprovalPanelMutation.graphql";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const ApproveTrophyMutation = graphql`
    mutation TrophyApprovalPanelMutation($input: ApproveTrophyInput!) {
        approveTrophy(input: $input) {
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

interface TrophyItem {
    id: string;
    isAwarded: boolean;
    description?: string | null;
    game: { id: string; symbol: string; name: string };
    receiver: { id: string; firstName: string; lastName: string };
    request: {
        id: number;
        approvals: Array<{ userId: string; isApproved: boolean }>;
    };
}

interface TrophyApprovalPanelProps {
    trophies: TrophyItem[];
    myId: string | undefined | null;
}

function TrophyApprovalRow({
    trophy,
    myId,
}: {
    trophy: TrophyItem;
    myId: string | undefined | null;
}) {
    const [commitApprove, isSubmitting] =
        useMutation<TrophyApprovalPanelMutation>(ApproveTrophyMutation);

    const myApproval = trophy.request.approvals.find((a) => a.userId === myId);
    const approvedCount = trophy.request.approvals.filter((a) => a.isApproved).length;
    const totalApprovers = trophy.request.approvals.length;
    const receiverName = `${trophy.receiver.firstName} ${trophy.receiver.lastName}`;

    const handleApprove = () => {
        commitApprove({
            variables: { input: { trophyId: trophy.id } },
            // optimistic: nothing; just let Relay refetch via the store update
        });
    };

    return (
        <div className="flex items-center gap-3 py-3">
            <span className="text-2xl">{trophy.game.symbol}</span>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">
                    {trophy.game.name}{" "}
                    <span className="font-normal text-muted-foreground">→ {receiverName}</span>
                </p>
                {trophy.description && (
                    <p className="text-xs text-muted-foreground truncate">{trophy.description}</p>
                )}
                {totalApprovers > 0 && (
                    <p className="text-xs text-muted-foreground">
                        {approvedCount}/{totalApprovers} approval{totalApprovers !== 1 ? "s" : ""}
                    </p>
                )}
            </div>
            {trophy.isAwarded ? (
                <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                    Awarded
                </span>
            ) : myApproval && myApproval.isApproved ? (
                <span className="text-xs text-muted-foreground">Approved</span>
            ) : (
                <Button
                    size="sm"
                    variant="outline"
                    disabled={isSubmitting || myApproval === undefined}
                    title={
                        myApproval === undefined
                            ? "You are not an approver for this trophy"
                            : undefined
                    }
                    onClick={handleApprove}
                >
                    {isSubmitting ? "Approving…" : "Approve"}
                </Button>
            )}
        </div>
    );
}

export function TrophyApprovalPanel({ trophies, myId }: TrophyApprovalPanelProps) {
    const pending = trophies.filter((t) => !t.isAwarded);
    const awarded = trophies.filter((t) => t.isAwarded);

    if (trophies.length === 0) {
        return (
            <p className="text-sm text-muted-foreground">
                No trophies yet. Request one from a game!
            </p>
        );
    }

    return (
        <div className="space-y-4">
            {pending.length > 0 && (
                <div>
                    <h3 className="mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        Pending
                    </h3>
                    <div className="divide-y divide-border rounded-xl border border-border px-4">
                        {pending.map((t) => (
                            <TrophyApprovalRow key={t.id} trophy={t} myId={myId} />
                        ))}
                    </div>
                </div>
            )}
            {pending.length > 0 && awarded.length > 0 && <Separator />}
            {awarded.length > 0 && (
                <div>
                    <h3 className="mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        Awarded
                    </h3>
                    <div className="divide-y divide-border rounded-xl border border-border px-4">
                        {awarded.map((t) => (
                            <TrophyApprovalRow key={t.id} trophy={t} myId={myId} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
