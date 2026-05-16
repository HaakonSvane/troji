import { graphql, useFragment } from "react-relay";
import type { GroupBox_group$key } from "@/__generated__/GroupBox_group.graphql";

const GroupBoxFragment = graphql`
    fragment GroupBox_group on Group {
        id
        name
        description
        imageUrl(size: 128)
    }
`;

interface GroupBoxProps {
    group: GroupBox_group$key;
}

export function GroupBox({ group }: GroupBoxProps) {
    const data = useFragment(GroupBoxFragment, group);
    return (
        <div className="surface-card surface-card-interactive flex h-full flex-col gap-2 p-5">
            <div className="flex items-center gap-3">
                {data.imageUrl ? (
                    <img
                        src={data.imageUrl}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="size-10 shrink-0 rounded-md border border-medal-gold/30 bg-surface-muted object-cover"
                    />
                ) : (
                    <span
                        aria-hidden
                        className="font-mono text-[11px] tracking-[0.22em] text-medal-gold/70 transition-colors group-hover:text-medal-gold"
                    >
                        ▸
                    </span>
                )}
                <h3 className="font-heading text-lg font-medium tracking-[0.015em]">
                    {data.name}
                </h3>
            </div>
            {data.description ? (
                <p
                    className={`line-clamp-2 text-sm leading-relaxed text-muted-foreground ${
                        data.imageUrl ? "pl-[3.25rem]" : "pl-5"
                    }`}
                >
                    {data.description}
                </p>
            ) : null}
        </div>
    );
}
