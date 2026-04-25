import { graphql, useFragment } from "react-relay";
import type { GroupBox_group$key } from "@/__generated__/GroupBox_group.graphql";

const GroupBoxFragment = graphql`
    fragment GroupBox_group on Group {
        id
        name
        description
        decisionModel
    }
`;

interface GroupBoxProps {
    group: GroupBox_group$key;
}

export function GroupBox({ group }: GroupBoxProps) {
    const data = useFragment(GroupBoxFragment, group);
    return (
        <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:bg-accent/30">
            <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-semibold leading-tight">{data.name}</h3>
                <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground capitalize">
                    Open
                </span>
            </div>
            {data.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">{data.description}</p>
            )}
        </div>
    );
}
