import { useState, Suspense } from "react";
import { graphql, usePreloadedQuery, loadQuery } from "react-relay";
import type { PreloadedQuery } from "react-relay";
import { GiftIcon } from "@heroicons/react/24/outline";
import { type VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "@/components/ui/button";
import { TrophyAwardJourney } from "@/components/TrophyAwardJourney";
import { getRelayEnvironment } from "@/relay/environment";
import type { AwardTrophyButtonDataQuery } from "@/__generated__/AwardTrophyButtonDataQuery.graphql";

const AwardDialogDataQuery = graphql`
    query AwardTrophyButtonDataQuery($groupId: ID!) {
        groupById(id: $groupId) {
            games(first: 50) {
                edges {
                    node {
                        id
                        name
                        symbol
                    }
                }
            }
            members(first: 50) {
                edges {
                    node {
                        id
                        displayName
                    }
                }
            }
        }
    }
`;

interface AwardTrophyButtonProps extends VariantProps<typeof buttonVariants> {
    preselectedGameId?: string | null;
    groupId: string;
    currentUserId?: string | null;
    label?: string;
    /**
     * Number of group members excluding the current user. When `0`, the
     * trigger renders disabled with an explanatory tooltip. When `null` or
     * omitted, the trigger always renders enabled (the dialog itself shows
     * an empty state if the loaded data turns out to be empty).
     */
    otherMemberCount?: number | null;
}

function AwardDialogWithData({
    queryRef,
    preselectedGameId,
    groupId,
    currentUserId,
    onClose,
}: {
    queryRef: PreloadedQuery<AwardTrophyButtonDataQuery>;
    preselectedGameId: string | null;
    groupId: string;
    currentUserId?: string | null;
    onClose: () => void;
}) {
    const data = usePreloadedQuery(AwardDialogDataQuery, queryRef);
    const games =
        data.groupById?.games?.edges?.map((e) => e?.node).filter(Boolean) ?? [];
    const members =
        data.groupById?.members?.edges?.map((e) => e?.node).filter(Boolean) ?? [];

    return (
        <TrophyAwardJourney
            gameId={preselectedGameId}
            groupId={groupId}
            availableGames={games as Array<{ id: string; name: string; symbol: string }>}
            open={true}
            onOpenChange={(next) => { if (!next) onClose(); }}
            groupMembers={members.filter((m) => m?.id !== currentUserId) as Array<{
                id: string;
                displayName: string;
            }>}
            currentUserId={currentUserId}
        />
    );
}

export function AwardTrophyButton({
    preselectedGameId = null,
    groupId,
    currentUserId,
    label = "Award trophy",
    variant,
    size,
    otherMemberCount,
}: AwardTrophyButtonProps) {
    const [queryRef, setQueryRef] = useState<PreloadedQuery<AwardTrophyButtonDataQuery> | null>(null);

    const noOneToAward = otherMemberCount != null && otherMemberCount <= 0;
    const disabled = noOneToAward
        ? {
              isDisabled: true,
              reason: "No one else in this circle to award yet — invite a member first.",
          }
        : undefined;

    const handleClick = () => {
        const ref = loadQuery<AwardTrophyButtonDataQuery>(
            getRelayEnvironment(),
            AwardDialogDataQuery,
            { groupId }
        );
        setQueryRef(ref);
    };

    return (
        <>
            <Button
                variant={variant}
                size={size}
                leadingIcon={<GiftIcon />}
                disabled={disabled}
                onClick={handleClick}
            >
                {label}
            </Button>
            {queryRef && (
                <Suspense fallback={null}>
                    <AwardDialogWithData
                        queryRef={queryRef}
                        preselectedGameId={preselectedGameId}
                        groupId={groupId}
                        currentUserId={currentUserId}
                        onClose={() => setQueryRef(null)}
                    />
                </Suspense>
            )}
        </>
    );
}
