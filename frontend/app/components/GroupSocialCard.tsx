import { graphql, useFragment } from "react-relay";
import type { GroupSocialCard_group$key } from "@/__generated__/GroupSocialCard_group.graphql";
import { PersonName } from "@/components/PersonName";

const GroupSocialCardFragment = graphql`
    fragment GroupSocialCard_group on Group {
        id
        name
        description
        admin {
            id
            firstName
            lastName
        }
        createdDate
    }
`;

interface GroupSocialCardProps {
    group: GroupSocialCard_group$key;
    memberCount?: number;
    currentUserId?: string | null;
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-3">
            <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {label}
            </dt>
            <dd className="text-sm text-foreground/90">{children}</dd>
        </div>
    );
}

export function GroupSocialCard({ group, memberCount, currentUserId }: GroupSocialCardProps) {
    const data = useFragment(GroupSocialCardFragment, group);

    return (
        <div className="surface-card flex flex-col gap-5 p-6">
            <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-medal-gold">
                    <span aria-hidden className="mr-2">▸</span>
                    circle
                </p>
                <h2 className="mt-3 font-heading text-2xl italic font-medium leading-tight tracking-[0.015em] text-foreground">
                    {data.name}
                </h2>
                {data.description ? (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {data.description}
                    </p>
                ) : null}
            </div>
            <div className="h-px bg-border" />
            <dl className="flex flex-col gap-3">
                <MetaRow label="Owner">
                    {data.admin ? (
                        <PersonName
                            firstName={data.admin.firstName}
                            lastName={data.admin.lastName}
                            isSelf={data.admin.id === currentUserId}
                        />
                    ) : (
                        "Unknown"
                    )}
                </MetaRow>
                <MetaRow label="Members">{memberCount ?? "—"}</MetaRow>
                <MetaRow label="Founded">{formatDate(data.createdDate)}</MetaRow>
            </dl>
        </div>
    );
}
