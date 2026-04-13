"use client";
import { graphql, usePreloadedQuery } from "react-relay";
import { PageDescription, PageHeader, PageTitle } from "@/components/labels/PageHeader";
import { SerializablePreloadedQuery } from "@/relay/loadSerializableQuery";
import DashboardPageQueryNode, {
    type DashboardPageQuery,
} from "@/__generated__/DashboardPageQuery.graphql";
import { useSerializablePreloadedQuery } from "@/relay/useSerializablePreloadedQuery";
import { getCurrentEnvironment } from "@/relay/environment";

const DashboardPageQuery = graphql`
    query DashboardPageQuery {
        me {
            userProfile {
                firstName
            }
        }
    }
`;

type DashboardQueryProps = {
    preloadedQuery: SerializablePreloadedQuery<typeof DashboardPageQueryNode, DashboardPageQuery>;
};

export const DashboardQuery = ({ preloadedQuery }: DashboardQueryProps) => {
    const environment = getCurrentEnvironment();
    const queryRef = useSerializablePreloadedQuery(environment, preloadedQuery);
    const data = usePreloadedQuery(DashboardPageQuery, queryRef);

    return (
        <>
            <PageHeader>
                <PageTitle>{`Welcome ${data.me.userProfile?.firstName}`}</PageTitle>
                <PageDescription>Here is a quick overview of your groups</PageDescription>
            </PageHeader>
        </>
    );
};
