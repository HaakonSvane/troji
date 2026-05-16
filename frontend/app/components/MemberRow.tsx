import { graphql, useFragment } from "react-relay";
import type { MemberRow_user$key } from "@/__generated__/MemberRow_user.graphql";
import { DisplayName } from "@/components/DisplayName";
import { initialsFromDisplayName } from "@/lib/format/names";

const MemberRowFragment = graphql`
    fragment MemberRow_user on User {
        id
        displayName
        profile {
            firstName
            middleName
            lastName
        }
    }
`;

interface MemberRowProps {
    user: MemberRow_user$key;
    isAdmin?: boolean;
    isSelf?: boolean;
}

export function MemberRow({ user, isAdmin = false, isSelf = false }: MemberRowProps) {
    const data = useFragment(MemberRowFragment, user);
    const initials = initialsFromDisplayName(data.displayName);

    return (
        <div className="flex items-center gap-3 py-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-medal-gold/30 bg-surface-muted text-xs font-medium text-foreground/85">
                {initials}
            </div>
            <DisplayName
                user={data}
                isSelf={isSelf}
                showFullName
                className="flex-1 text-sm text-foreground/90"
            />
            {isAdmin ? (
                <span className="rounded-sm border border-medal-gold/40 bg-medal-gold/8 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-medal-gold">
                    Owner
                </span>
            ) : null}
        </div>
    );
}
