import { useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { MemberRow } from "@/components/MemberRow";
import { Button } from "@/components/ui/button";
import { DrawerDialog } from "@/components/DrawerDialog";
import type { MemberRow_user$key } from "@/__generated__/MemberRow_user.graphql";

const PREVIEW_COUNT = 4;

type MemberNode = MemberRow_user$key & {
    id: string;
};

interface GroupMembersCardProps {
    members: MemberNode[];
    adminId?: string | null;
    currentUserId?: string | null;
    className?: string;
}

export function GroupMembersCard({
    members,
    adminId,
    currentUserId,
    className,
}: GroupMembersCardProps) {
    const [allOpen, setAllOpen] = useState(false);
    const total = members.length;
    const overflow = Math.max(0, total - PREVIEW_COUNT);
    const preview = members.slice(0, PREVIEW_COUNT);

    return (
        <>
            <section
                className={
                    "surface-card flex min-h-56 flex-col gap-3 p-5 sm:p-6 " + (className ?? "")
                }
            >
                <header className="flex items-center justify-between gap-3">
                    <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                        <span className="text-medal-gold">$</span>
                        <span className="ml-2">members</span>
                    </h2>
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                        <span className="text-foreground/85">{total}</span>{" "}
                        <span>{total === 1 ? "soul" : "souls"}</span>
                    </span>
                </header>

                <div className="flex flex-1 flex-col divide-y divide-border">
                    {preview.map((member) => (
                        <MemberRow
                            key={member.id}
                            user={member}
                            isAdmin={member.id === adminId}
                            isSelf={member.id === currentUserId}
                        />
                    ))}
                </div>

                {overflow > 0 ? (
                    <footer className="mt-auto flex items-center pt-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            trailingIcon={<ArrowRightIcon />}
                            onClick={() => setAllOpen(true)}
                        >
                            See all {total}
                        </Button>
                    </footer>
                ) : null}
            </section>

            <DrawerDialog
                open={allOpen}
                onOpenChange={setAllOpen}
                title="Members"
                description={`Everyone in this circle (${total}).`}
            >
                <div className="flex flex-col divide-y divide-border">
                    {members.map((member) => (
                        <MemberRow
                            key={member.id}
                            user={member}
                            isAdmin={member.id === adminId}
                            isSelf={member.id === currentUserId}
                        />
                    ))}
                </div>
            </DrawerDialog>
        </>
    );
}
