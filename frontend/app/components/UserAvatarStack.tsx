import { graphql, useFragment } from "react-relay";
import { UserAvatar } from "@/components/UserAvatar";
import type { UserAvatarStack_users$key } from "@/__generated__/UserAvatarStack_users.graphql";

const UserAvatarStackFragment = graphql`
    fragment UserAvatarStack_users on User @relay(plural: true) {
        id
        displayName
        avatarUrl(size: 64)
    }
`;

interface UserAvatarStackProps {
    users: UserAvatarStack_users$key;
    overflow?: number;
    maxVisible?: number;
}

export function UserAvatarStack({
    users,
    overflow = 0,
    maxVisible = 3,
}: UserAvatarStackProps) {
    const data = useFragment(UserAvatarStackFragment, users);
    const visible = data.slice(0, maxVisible);
    if (visible.length === 0 && overflow === 0) return null;

    return (
        <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
                {visible.map((user) => (
                    <UserAvatar
                        key={user.id}
                        displayName={user.displayName}
                        avatarUrl={user.avatarUrl}
                        size="xs"
                        className="ring-2 ring-background"
                    />
                ))}
            </div>
            {overflow > 0 ? (
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    +{overflow}
                </span>
            ) : null}
        </div>
    );
}
