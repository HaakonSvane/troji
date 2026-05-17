import { graphql, useFragment } from "react-relay";
import { GroupImage } from "@/components/GroupImage";
import { UserAvatarStack } from "@/components/UserAvatarStack";
import type { GroupBox_group$key } from "@/__generated__/GroupBox_group.graphql";

const GroupBoxFragment = graphql`
    fragment GroupBox_group on Group {
        id
        name
        description
        imageUrl(size: 256)
        members(first: 4) {
            totalCount
            edges {
                node {
                    id
                    ...UserAvatarStack_users
                }
            }
        }
    }
`;

interface GroupBoxProps {
    group: GroupBox_group$key;
    currentUserId?: string | null;
}

export function GroupBox({ group, currentUserId }: GroupBoxProps) {
    const data = useFragment(GroupBoxFragment, group);

    const allMembers =
        data.members?.edges
            ?.map((edge) => edge?.node)
            .filter((node): node is NonNullable<typeof node> => node != null) ?? [];
    const others = currentUserId
        ? allMembers.filter((m) => m.id !== currentUserId)
        : allMembers;
    const visibleMembers = others.slice(0, 3);
    const totalOthers = Math.max(0, (data.members?.totalCount ?? 0) - 1);
    const overflow = Math.max(0, totalOthers - visibleMembers.length);

    return (
        <div className="surface-card surface-card-interactive flex h-full items-center gap-4 p-5">
            <GroupImage name={data.name} imageUrl={data.imageUrl} size="card" />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <h3 className="font-heading text-lg font-medium tracking-[0.015em] text-foreground">
                    {data.name}
                </h3>
                {data.description ? (
                    <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {data.description}
                    </p>
                ) : null}
            </div>
            {visibleMembers.length > 0 || overflow > 0 ? (
                <UserAvatarStack users={visibleMembers} overflow={overflow} />
            ) : null}
        </div>
    );
}
