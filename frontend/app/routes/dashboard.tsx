import { graphql, usePreloadedQuery, loadQuery } from "react-relay";
import type { dashboardQuery } from "@/__generated__/dashboardQuery.graphql";
import { PersonName } from "@/components/PersonName";
import { getRelayEnvironment } from "@/relay/environment";
import type { Route } from "./+types/dashboard";

// Phase 5.4: replace this with the real DashboardPageQuery and render proper content.
const DashboardQuery = graphql`
    query dashboardQuery {
        me {
            id
            firstName
        }
    }
`;

// clientLoader runs on the client before the component renders.
// It calls loadQuery() to kick off the Relay network request (render-as-you-fetch).
// All protected pages follow this pattern: loadQuery in clientLoader, usePreloadedQuery in component.
export async function clientLoader(_args: Route.ClientLoaderArgs) {
    const environment = getRelayEnvironment();
    const queryRef = loadQuery<dashboardQuery>(environment, DashboardQuery, {});
    return { queryRef };
}

export function HydrateFallback() {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
    );
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
    // usePreloadedQuery suspends until the query completes.
    // The Suspense boundary in _protected.tsx shows the spinner while loading.
    const data = usePreloadedQuery(DashboardQuery, loaderData.queryRef);
    return (
        <main className="flex flex-col container mx-auto px-4 py-8">
            <h1 className="text-3xl font-semibold">Dashboard</h1>
            <p className="mt-2 text-muted-foreground">
                Welcome back, <PersonName firstName={data.me?.firstName} fallback="there" />.
            </p>
        </main>
    );
}
