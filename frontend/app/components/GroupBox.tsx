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
        <div className="surface-card surface-card-interactive flex flex-col gap-2 p-5">
            <div className="flex items-start justify-between gap-2">
                <h3 className="heading-card text-lg">{data.name}</h3>
                <span className="pill-muted shrink-0 capitalize">Open</span>
            </div>
            {data.description && <p className="text-supporting line-clamp-2">{data.description}</p>}
        </div>
    );
}
