import { graphql, useFragment } from "react-relay";
import type { TrophyAvatar_trophy$key } from "@/__generated__/TrophyAvatar_trophy.graphql";

const TrophyAvatarFragment = graphql`
    fragment TrophyAvatar_trophy on Trophy {
        id
        isAwarded
        game {
            symbol
            name
        }
    }
`;

interface TrophyAvatarProps {
    trophy: TrophyAvatar_trophy$key;
    size?: "sm" | "md";
}

export function TrophyAvatar({ trophy, size = "md" }: TrophyAvatarProps) {
    const data = useFragment(TrophyAvatarFragment, trophy);
    const sizeClass = size === "sm" ? "h-8 w-8 text-base" : "h-10 w-10 text-xl";

    return (
        <div
            title={data.game.name}
            className={[
                sizeClass,
                "flex items-center justify-center rounded-full border border-border bg-card",
                data.isAwarded ? "" : "opacity-40 grayscale",
            ].join(" ")}
        >
            {data.game.symbol}
        </div>
    );
}
