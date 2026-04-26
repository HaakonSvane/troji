import { graphql, useFragment } from "react-relay";
import type { GroupSocialCard_group$key } from "@/__generated__/GroupSocialCard_group.graphql";
import { Separator } from "@/components/ui/separator";

const GroupSocialCardFragment = graphql`
    fragment GroupSocialCard_group on Group {
        id
        name
        description
        decisionModel
        admin {
            firstName
            lastName
        }
        createdDate
    }
`;

interface GroupSocialCardProps {
    group: GroupSocialCard_group$key;
    memberCount?: number;
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export function GroupSocialCard({ group, memberCount }: GroupSocialCardProps) {
    const data = useFragment(GroupSocialCardFragment, group);
    const adminName = data.admin ? `${data.admin.firstName} ${data.admin.lastName}` : "Unknown";

    return (
        <div className="surface-card space-y-4 p-6">
            <div>
                <h2 className="heading-card">{data.name}</h2>
                {data.description && (
                    <p className="mt-1 text-supporting">{data.description}</p>
                )}
            </div>
            <Separator />
            <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <dt className="text-label-muted">Admin</dt>
                    <dd className="font-medium">{adminName}</dd>
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
