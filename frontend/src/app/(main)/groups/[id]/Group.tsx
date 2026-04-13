"use client";

import { SerializablePreloadedQuery } from "@/relay/loadSerializableQuery";
import { graphql, usePreloadedQuery } from "react-relay";
import GroupPageQueryNode, { type GroupPageQuery } from "@/__generated__/GroupPageQuery.graphql";
import { getCurrentEnvironment } from "@/relay/environment";
import { useSerializablePreloadedQuery } from "@/relay/useSerializablePreloadedQuery";
import { PageHeader, PageTitle } from "@/components/labels/PageHeader";
import { GroupSocialCard } from "./components/GroupSocialCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupGamesPanel } from "./components/games/GroupGamesPanel";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const GroupPageQuery = graphql`
    query GroupPageQuery($groupId: ID!) {
        groupById(id: $groupId) {
            id
            name
            adminId
            ...GroupSocialCardFragment
            ...GroupGamesPanelFragment
        }
    }
`;

type GroupQueryProps = {
    preloadedQuery: SerializablePreloadedQuery<typeof GroupPageQueryNode, GroupPageQuery>;
};

export const GroupQuery = ({ preloadedQuery }: GroupQueryProps) => {
    const environment = getCurrentEnvironment();
    const queryRef = useSerializablePreloadedQuery(environment, preloadedQuery);
    const data = usePreloadedQuery(GroupPageQuery, queryRef);

    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const createTabBarString = useCallback(
        (tabName: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("tab", tabName);
            return params.toString();
        },
        [searchParams],
    );

    if (!data.groupById) return null;
    return (
        <div className="flex flex-col gap-8">
            <PageHeader>
                <PageTitle>{data.groupById?.name}</PageTitle>
            </PageHeader>
            <div className="flex flex-col sm:flex-row lg:gap-10 xl:gap-16">
                <aside className="flex sm:order-last sm:w-48 md:w-56 lg:w-72 xl:w-96">
                    <div className="sm:fixed sm:w-48 md:w-56 lg:w-72 xl:w-96">
                        <GroupSocialCard fragmentKey={data.groupById} />
                    </div>
                </aside>
                <div className="flex flex-col flex-1">
                    <Tabs
                        defaultValue={searchParams.get("tab") ?? "home"}
                        onValueChange={tab => router.push(pathname + "?" + createTabBarString(tab))}
                    >
                        <TabsList>
                            <TabsTrigger value="home">Home</TabsTrigger>
                            <TabsTrigger value="games">Games</TabsTrigger>
                            <TabsTrigger value="members">Members</TabsTrigger>
                        </TabsList>
                        <TabsContent value="home">
                            A cool group dashboard will arrive shortly!
                        </TabsContent>
                        <TabsContent value="games">
                            <GroupGamesPanel fragmentKey={data.groupById} />
                        </TabsContent>
                        <TabsContent value="members">Change your password here.</TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};
