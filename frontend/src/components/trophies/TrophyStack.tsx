import { TrophyStackFragment$key } from "@/generated/TrophyStackFragment.graphql";
import { graphql, useFragment } from "react-relay";
import { TrophyAvatar } from "./TrophyAvatar";

const TrophyStackFragment = graphql`
    fragment TrophyStackFragment on User {
        trophies {
            id
            awardedDate
            game {
                groupId
            }
            ...TrophyAvatarFragment
        }
    }
`;

type TrophyStackProps = {
    queryReference: TrophyStackFragment$key;
    groupId?: string;
    numberShown?: number;
};

export const TrophyStack = ({ queryReference, groupId, numberShown = 3 }: TrophyStackProps) => {
    const data = useFragment(TrophyStackFragment, queryReference);
    const filteredTropies = groupId
        ? data.trophies.filter(trophy => trophy.game.groupId === groupId)
        : data.trophies;
    const topNTrophies = filteredTropies
        .sort((a, b) => new Date(b.awardedDate).getTime() - new Date(a.awardedDate).getTime())
        .slice(0, numberShown);
    return (
        <div className="flex flex-row">
            {topNTrophies.map(trophy => (
                <TrophyAvatar key={trophy.id} queryReference={trophy} />
            ))}
        </div>
    );
};
