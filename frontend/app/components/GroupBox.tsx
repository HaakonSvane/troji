import { graphql, useFragment } from "react-relay";
import type { GroupBox_group$key } from "@/__generated__/GroupBox_group.graphql";

const GroupBoxFragment = graphql`
    fragment GroupBox_group on Group {
        id
        name
        description
    }
`;

interface GroupBoxProps {
    group: GroupBox_group$key;
}

export function GroupBox({ group }: GroupBoxProps) {
    const data = useFragment(GroupBoxFragment, group);
    return (
        <div className="surface-card surface-card-interactive flex h-full flex-col gap-2 p-5">
            <div className="flex items-baseline gap-2">
                <span
                    aria-hidden
                    className="font-mono text-[11px] tracking-[0.22em] text-medal-gold/70 transition-colors group-hover:text-medal-gold"
                >
                    ▸
                </span>
                <h3 className="font-heading text-lg font-medium tracking-[0.015em]">
                    {data.name}
                </h3>
            </div>
            {data.description ? (
                <p className="line-clamp-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                    {data.description}
                </p>
            ) : null}
        </div>
    );
}
