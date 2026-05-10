import { graphql, useFragment } from "react-relay";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import type { GroupHero_group$key } from "@/__generated__/GroupHero_group.graphql";
import { AwardTrophyButton } from "@/components/AwardTrophyButton";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { formatRelativeTime, formatAbsoluteDateTime } from "@/lib/relativeTime";

const GroupHeroFragment = graphql`
    fragment GroupHero_group on Group {
        id
        name
        description
        createdDate
        admin {
            id
            firstName
            lastName
        }
    }
`;

interface GroupHeroProps {
    group: GroupHero_group$key;
    memberCount: number;
    awardCount: number;
    isAdmin: boolean;
    currentUserId?: string | null;
    availableGames: Array<{ id: string; name: string; symbol: string }>;
    groupMembers: Array<{ id: string; firstName?: string | null; lastName?: string | null }>;
    onInvite: () => void;
}

export function GroupHero({
    group,
    memberCount,
    awardCount,
    isAdmin,
    currentUserId,
    availableGames,
    groupMembers,
    onInvite,
}: GroupHeroProps) {
    const data = useFragment(GroupHeroFragment, group);

    return (
        <section className="flex flex-col gap-6">
            <Breadcrumb
                segments={[
                    { label: "groups", href: "/groups" },
                    { label: data.name },
                ]}
            />

            <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-medal-gold">
                        <span aria-hidden className="mr-2">▸</span>
                        circle
                    </p>
                    <h1 className="font-heading text-4xl font-medium leading-tight tracking-[0.015em] text-foreground sm:text-5xl">
                        {data.name}
                    </h1>
                    {data.description ? (
                        <p className="max-w-2xl font-heading text-lg leading-relaxed tracking-[0.015em] text-foreground/85">
                            “{data.description}”
                        </p>
                    ) : null}
                </div>

                <dl className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <dt className="text-muted-foreground/70">founded</dt>
                        <dd
                            className="text-foreground/85"
                            title={formatAbsoluteDateTime(data.createdDate)}
                        >
                            {formatRelativeTime(data.createdDate)}
                        </dd>
                    </div>
                    <span aria-hidden className="text-border">
                        ·
                    </span>
                    <div className="flex items-center gap-2">
                        <dt className="text-muted-foreground/70">souls</dt>
                        <dd className="text-foreground/85">{memberCount}</dd>
                    </div>
                    <span aria-hidden className="text-border">
                        ·
                    </span>
                    <div className="flex items-center gap-2">
                        <dt className="text-muted-foreground/70">awards</dt>
                        <dd className="text-foreground/85">{awardCount}</dd>
                    </div>
                </dl>

                <div className="flex flex-wrap items-center gap-3">
                    <AwardTrophyButton
                        preselectedGameId={null}
                        groupId={data.id}
                        availableGames={availableGames}
                        groupMembers={groupMembers}
                        currentUserId={currentUserId}
                        variant="gold"
                        size="terminal"
                        label="Award trophy"
                    />
                    {isAdmin ? (
                        <Button
                            variant="outline"
                            size="terminal"
                            leadingIcon={<UserPlusIcon />}
                            onClick={onInvite}
                        >
                            Invite
                        </Button>
                    ) : null}
                </div>
            </div>
        </section>
    );
}
