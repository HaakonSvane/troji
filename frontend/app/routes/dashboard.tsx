import { graphql, usePreloadedQuery, loadQuery } from "react-relay";
import { Link } from "react-router";
import type { dashboardQuery } from "@/__generated__/dashboardQuery.graphql";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PersonName } from "@/components/PersonName";
import { Button } from "@/components/ui/button";
import { getRelayEnvironment } from "@/relay/environment";
import type { Route } from "./+types/dashboard";

const DashboardQuery = graphql`
    query dashboardQuery {
        me {
            id
            firstName
        }
    }
`;

export async function clientLoader(_args: Route.ClientLoaderArgs) {
    const environment = getRelayEnvironment();
    const queryRef = loadQuery<dashboardQuery>(environment, DashboardQuery, {});
    return { queryRef };
}

export function meta() {
    return [
        { title: "Dashboard — Troji" },
        { name: "description", content: "Your home base. Pick a circle and start handing out trophies." },
    ];
}

export function HydrateFallback() {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="flex flex-col items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                <div className="size-6 animate-spin rounded-full border-2 border-medal-gold/40 border-t-medal-gold" />
                <span>loading</span>
            </div>
        </div>
    );
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
    const data = usePreloadedQuery(DashboardQuery, loaderData.queryRef);

    return (
        <main className="container mx-auto flex flex-col px-4 py-10 sm:py-14">
            <Breadcrumb segments={[{ label: "dashboard" }]} />

            <h1 className="mt-6 font-heading text-4xl italic font-medium leading-tight tracking-[0.015em] text-foreground sm:text-5xl">
                Welcome back,{" "}
                <PersonName
                    firstName={data.me?.firstName}
                    fallback="champion"
                    className="text-medal-gold"
                />
                .
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                What are we competing in today? Pick a circle and start handing out trophies.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button variant="gold" size="terminal" asChild>
                    <Link to="/groups">
                        <span aria-hidden>▸</span>
                        <span>view your circles</span>
                    </Link>
                </Button>
            </div>
        </main>
    );
}
