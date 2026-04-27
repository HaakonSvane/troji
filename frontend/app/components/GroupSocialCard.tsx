import { graphql, useFragment } from "react-relay";
import type { GroupSocialCard_group$key } from "@/__generated__/GroupSocialCard_group.graphql";
import { PersonName } from "@/components/PersonName";
import { Separator } from "@/components/ui/separator";

const GroupSocialCardFragment = graphql`
    fragment GroupSocialCard_group on Group {
        id
        name
        description
        decisionModel
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

export function GroupSocialCard({ group, memberCount, currentUserId }: GroupSocialCardProps) {
    const data = useFragment(GroupSocialCardFragment, group);

    return (
        <div className="surface-card space-y-4 p-6">
            <div>
                <h2 className="heading-card">{data.name}</h2>
                {data.description && <p className="mt-1 text-supporting">{data.description}</p>}
            </div>
            <Separator />
            <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <dt className="text-label-muted">Owner</dt>
                    <dd className="font-medium">
                        {data.admin ? (
                            <PersonName
                                firstName={data.admin.firstName}
                                lastName={data.admin.lastName}
                                isSelf={data.admin.id === currentUserId}
                            />
                        ) : (
                            "Unknown"
                        )}
                    </dd>
                </div>
                <div className="flex justify-between">
                    <dt className="text-label-muted">Members</dt>
                    <dd className="font-medium">{memberCount ?? "—"}</dd>
                </div>
                <div className="flex justify-between">
                    <dt className="text-label-muted">Decision model</dt>
                    <dd className="font-medium capitalize">Open</dd>
                </div>
                <div className="flex justify-between">
                    <dt className="text-label-muted">Created</dt>
                    <dd className="font-medium">{formatDate(data.createdDate)}</dd>
                </div>
            </dl>
        </div>
    );
}
