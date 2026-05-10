import { useState } from "react";
import { GiftIcon } from "@heroicons/react/24/outline";
import { type VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "@/components/ui/button";
import { TrophyRequestForm } from "@/components/TrophyRequestForm";

interface AwardTrophyButtonProps extends VariantProps<typeof buttonVariants> {
    /** Pre-selected game. Pass null to show a game-picker dropdown inside the form. */
    preselectedGameId?: string | null;
    availableGames: Array<{ id: string; name: string; symbol: string }>;
    groupMembers: Array<{ id: string; firstName?: string | null; lastName?: string | null }>;
    currentUserId?: string | null;
    label?: string;
}

export function AwardTrophyButton({
    preselectedGameId = null,
    availableGames,
    groupMembers,
    currentUserId,
    label = "Award trophy",
    variant,
    size,
}: AwardTrophyButtonProps) {
    const [open, setOpen] = useState(false);

    const eligibleMembers = groupMembers.filter((m) => m.id !== currentUserId);

    const disabled =
        eligibleMembers.length === 0
            ? { isDisabled: true, reason: "You need at least one other member to award a trophy." }
            : !preselectedGameId && availableGames.length === 0
              ? { isDisabled: true, reason: "Create a game first before awarding trophies." }
              : false;

    return (
        <>
            <Button
                variant={variant}
                size={size}
                leadingIcon={<GiftIcon />}
                disabled={disabled}
                onClick={() => setOpen(true)}
            >
                {label}
            </Button>
            <TrophyRequestForm
                gameId={preselectedGameId}
                availableGames={availableGames}
                open={open}
                onOpenChange={setOpen}
                groupMembers={eligibleMembers}
                currentUserId={currentUserId}
            />
        </>
    );
}
