import { graphql, useFragment } from "react-relay";
import type { MemberRow_user$key } from "@/__generated__/MemberRow_user.graphql";

const MemberRowFragment = graphql`
    fragment MemberRow_user on User {
        id
        firstName
        middleName
        lastName
    }
`;

interface MemberRowProps {
    user: MemberRow_user$key;
    isAdmin?: boolean;
}

export function MemberRow({ user, isAdmin = false }: MemberRowProps) {
    const data = useFragment(MemberRowFragment, user);
    const fullName = [data.firstName, data.middleName, data.lastName].filter(Boolean).join(" ");
    const initials = [data.firstName[0], data.lastName[0]].join("").toUpperCase();

    return (
        <div className="flex items-center gap-3 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
                {initials}
            </div>
            <span className="text-sm font-medium flex-1">{fullName}</span>
            {isAdmin && (
                <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                    Owner
                </span>
            )}
        </div>
    );
}
