import { graphql, useFragment } from "react-relay";
import { TrophyAvatar } from "@/components/TrophyAvatar";
import type { TrophyStack_trophies$key } from "@/__generated__/TrophyStack_trophies.graphql";

const TrophyStackFragment = graphql`
    fragment TrophyStack_trophies on Trophy @relay(plural: true) {
        id
        ...TrophyAvatar_trophy
    }
`;

interface TrophyStackProps {
    trophies: TrophyStack_trophies$key;
    maxVisible?: number;
}

export function TrophyStack({ trophies, maxVisible = 5 }: TrophyStackProps) {
    const data = useFragment(TrophyStackFragment, trophies);
    const visible = data.slice(0, maxVisible);
    const overflow = data.length - visible.length;

    return (
        <div className="flex items-center gap-1">
            {visible.map((t) => (
                <TrophyAvatar key={t.id} trophy={t} size="sm" />
            ))}
            {overflow > 0 && (
                <span className="ml-1 text-xs text-muted-foreground">+{overflow}</span>
            )}
        </div>
    );
}
