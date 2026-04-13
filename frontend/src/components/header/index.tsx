import { UserButton } from "@/components/buttons/UserButton";
import { type HeaderQuery } from "@/__generated__/HeaderQuery.graphql";
import { PreloadedQuery, graphql, usePreloadedQuery } from "react-relay";
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { Navigator } from "./Navigator";
import { UserMenuContent } from "./UserMenuContent";

const HeaderQuery = graphql`
    query HeaderQuery {
        me {
            ...UserMenuContentFragment
        }
    }
`;

type HeaderProps = { queryRef: PreloadedQuery<HeaderQuery> };

export const Header = ({ queryRef }: HeaderProps) => {
    const data = usePreloadedQuery(HeaderQuery, queryRef);

    return (
        <Container logo={<Logo />}>
            <div className="flex flex-1">
                <Navigator />
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <UserButton />
                </DropdownMenuTrigger>
                <UserMenuContent fragmentKey={data.me} />
            </DropdownMenu>
        </Container>
    );
};
