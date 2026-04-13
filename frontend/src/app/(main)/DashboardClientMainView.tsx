"use client";

import { Header } from "@/components/Header";
import { getCurrentEnvironment } from "@/relay/environment";
import { SerializablePreloadedQuery } from "@/relay/loadSerializableQuery";
import { useSerializablePreloadedQuery } from "@/relay/useSerializablePreloadedQuery";
import { PropsWithChildren } from "react";
import HeaderQueryNode, { HeaderQuery } from "@/generated/HeaderQuery.graphql";

type DashboardClientMainViewProps = {
    preloadedHeaderQuery: SerializablePreloadedQuery<typeof HeaderQueryNode, HeaderQuery>;
};

export const DashboardClientMainView = ({
    children,
    preloadedHeaderQuery,
}: PropsWithChildren<DashboardClientMainViewProps>) => {
    const environment = getCurrentEnvironment();
    const headerQueryRef = useSerializablePreloadedQuery(environment, preloadedHeaderQuery);

    return (
        <>
            <Header queryRef={headerQueryRef} />
            <div className="max-w-(--breakpoint-2xl) mx-auto px-4 sm:px-6 lg:px-10 py-6">
                {children}
            </div>
        </>
    );
};
