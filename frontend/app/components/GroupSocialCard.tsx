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
    const adminName = data.admin
        ? `${data.admin.firstName} ${data.admin.lastName}`
        : "Unknown";

    return (
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div>
                <h2 className="text-xl font-semibold leading-tight">{data.name}</h2>
                {data.description && (
                    <p className="mt-1 text-sm text-muted-foreground">{data.description}</p>
                )}
            </div>
            <Separator />
            <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <dt className="text-muted-foreground">Admin</dt>
                    <dd className="font-medium">{adminName}</dd>
                </div>
                <div className="flex justify-between">
                    <dt className="text-muted-foreground">Members</dt>
                    <dd className="font-medium">{memberCount ?? "—"}</dd>
                </div>
                <div className="flex justify-between">
                    <dt className="text-muted-foreground">Decision model</dt>
                    <dd className="font-medium capitalize">
                        {data.decisionModel === "DEMOCRACY" ? "Democracy" : "Dictatorship"}
                    </dd>
                </div>
                <div className="flex justify-between">
                    <dt className="text-muted-foreground">Created</dt>
                    <dd className="font-medium">{formatDate(data.createdDate)}</dd>
                </div>
            </dl>
        </div>
    );
}
