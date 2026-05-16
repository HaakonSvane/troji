import { useState } from "react";
import { graphql, useFragment } from "react-relay";
import { UserPlusIcon, Cog6ToothIcon, XMarkIcon } from "@heroicons/react/24/outline";
import type { GroupHero_group$key } from "@/__generated__/GroupHero_group.graphql";
import { AwardTrophyButton } from "@/components/AwardTrophyButton";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { formatRelativeTime, formatAbsoluteDateTime } from "@/lib/relativeTime";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";

const GroupHeroFragment = graphql`
    fragment GroupHero_group on Group {
        id
        name
        description
        createdDate
        imageUrl(size: 256)
        admin {
            id
            displayName
        }
    }
`;

interface GroupHeroProps {
    group: GroupHero_group$key;
    memberCount: number;
    awardCount: number;
    gamesTotalCount: number;
    isAdmin: boolean;
    currentUserId?: string | null;
    onInvite: () => void;
}

export function GroupHero({
    group,
    memberCount,
    awardCount,
    gamesTotalCount,
    isAdmin,
    currentUserId,
    onInvite,
}: GroupHeroProps) {
    const data = useFragment(GroupHeroFragment, group);
    const [settingsOpen, setSettingsOpen] = useState(false);

    return (
        <section className="flex flex-col gap-6">
            <Breadcrumb segments={[{ label: "groups", href: "/groups" }, { label: data.name }]} />

            <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-4">
                        {data.imageUrl ? (
                            <img
                                src={data.imageUrl}
                                alt=""
                                loading="lazy"
                                decoding="async"
                                className="size-14 shrink-0 rounded-md border border-medal-gold/30 bg-surface-muted object-cover sm:size-16"
                            />
                        ) : null}
                        <h1 className="font-heading text-4xl font-medium leading-tight tracking-[0.015em] text-foreground sm:text-5xl">
                            {data.name}
                        </h1>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Circle settings"
                            onClick={() => setSettingsOpen(true)}
                            className="text-muted-foreground/50 hover:text-foreground"
                        >
                            <Cog6ToothIcon />
                        </Button>
                    </div>
                    {data.description ? (
                        <p className="max-w-2xl font-heading text-lg leading-relaxed tracking-[0.015em] text-foreground/85">
                            &ldquo;{data.description}&rdquo;
                        </p>
                    ) : null}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <AwardTrophyButton
                        preselectedGameId={null}
                        groupId={data.id}
                        currentUserId={currentUserId}
                        otherMemberCount={Math.max(0, memberCount - 1)}
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

            <Drawer direction="right" open={settingsOpen} onOpenChange={setSettingsOpen}>
                <DrawerContent>
                    <DrawerHeader className="flex flex-row items-center justify-between">
                        <DrawerTitle>{data.name}</DrawerTitle>
                        <DrawerClose asChild>
                            <Button variant="ghost" size="icon-sm" aria-label="Close">
                                <XMarkIcon />
                            </Button>
                        </DrawerClose>
                    </DrawerHeader>
                    <div className="flex-1 overflow-y-auto p-4 pt-2">
                        <dl className="flex flex-col gap-4 font-mono text-[11px] uppercase tracking-[0.22em]">
                            <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-4">
                                <dt className="text-muted-foreground/70">founded</dt>
                                <dd
                                    className="text-foreground/85"
                                    title={formatAbsoluteDateTime(data.createdDate)}
                                >
                                    {formatRelativeTime(data.createdDate)}
                                </dd>
                            </div>
                            <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-4">
                                <dt className="text-muted-foreground/70">souls</dt>
                                <dd className="text-foreground/85">{memberCount}</dd>
                            </div>
                            <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-4">
                                <dt className="text-muted-foreground/70">awards</dt>
                                <dd className="text-foreground/85">{awardCount}</dd>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <dt className="text-muted-foreground/70">games</dt>
                                <dd className="text-foreground/85">{gamesTotalCount}</dd>
                            </div>
                        </dl>
                    </div>
                </DrawerContent>
            </Drawer>
        </section>
    );
}
