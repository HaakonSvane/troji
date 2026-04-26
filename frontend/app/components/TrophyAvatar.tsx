import { graphql, useFragment } from "react-relay";
import type { TrophyAvatar_trophy$key } from "@/__generated__/TrophyAvatar_trophy.graphql";
import { MedalBadge } from "@/components/MedalBadge";

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

    return (
        <MedalBadge
            emoji={data.game.symbol}
            size={size}
            awarded={data.isAwarded}
            title={data.game.name}
        />
    );
}
