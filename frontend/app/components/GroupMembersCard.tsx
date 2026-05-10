import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router";
import { MemberRow } from "@/components/MemberRow";
import { Button } from "@/components/ui/button";
import type { MemberRow_user$key } from "@/__generated__/MemberRow_user.graphql";

type MemberNode = MemberRow_user$key & {
    id: string;
};

interface GroupMembersCardProps {
    members: MemberNode[];
    totalCount: number;
    groupId: string;
    adminId?: string | null;
    currentUserId?: string | null;
    className?: string;
}

export function GroupMembersCard({
    members,
    totalCount,
    groupId,
    adminId,
    currentUserId,
    className,
}: GroupMembersCardProps) {
    return (
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
                    <span className="text-foreground/85">{totalCount}</span>{" "}
                    <span>{totalCount === 1 ? "soul" : "souls"}</span>
                </span>
            </header>

            <div className="flex flex-1 flex-col divide-y divide-border">
                {members.map((member) => (
                    <MemberRow
                        key={member.id}
                        user={member}
                        isAdmin={member.id === adminId}
                        isSelf={member.id === currentUserId}
                    />
                ))}
            </div>

            {totalCount > members.length ? (
                <footer className="mt-auto flex items-center pt-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        trailingIcon={<ArrowRightIcon />}
                        asChild
                    >
                        <Link to={`/groups/${groupId}/members`}>
                            View all {totalCount}
                        </Link>
                    </Button>
                </footer>
            ) : null}
        </section>
    );
}
