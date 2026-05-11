import { getAuth } from "@clerk/react-router/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { loadQuery } from "react-relay";
import { Outlet, redirect } from "react-router";
import { UserMenuQuery } from "@/components/UserMenu";
import { Header } from "@/components/Header";
import { getRelayEnvironment } from "@/relay/environment";
import type { UserMenuQuery as UserMenuQueryType } from "@/__generated__/UserMenuQuery.graphql";
import type { Route } from "./+types/_protected";

export async function loader(args: Route.LoaderArgs) {
    const { isAuthenticated } = await getAuth(args);
    if (!isAuthenticated) {
        throw redirect("/sign-in");
    }
    return {};
}

export function clientLoader(_args: Route.ClientLoaderArgs) {
    const environment = getRelayEnvironment();
    const queryRef = loadQuery<UserMenuQueryType>(environment, UserMenuQuery, {});
    return { queryRef };
}
clientLoader.hydrate = true;

function FullPageSpinner() {
    return (
        <div className="flex min-h-[50svh] w-full items-center justify-center">
            <div className="flex flex-col items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                <div className="size-6 animate-spin rounded-full border-2 border-medal-gold/40 border-t-medal-gold" />
                <span>loading</span>
            </div>
        </div>
    );
}

function RouteError({ error }: { error: unknown }) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return (
        <main className="flex min-h-[50svh] w-full flex-col items-center justify-center gap-3 p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-destructive">
                <span aria-hidden className="mr-2">!</span>
                error
            </p>
            <h1 className="font-heading text-3xl tracking-[0.015em] text-foreground">
                Something broke.
            </h1>
            <p className="max-w-md text-center text-sm text-muted-foreground">{message}</p>
        </main>
    );
}

export default function ProtectedLayout({ loaderData }: Route.ComponentProps) {
    return (
        <>
            <Header userMenuQueryRef={loaderData?.queryRef} />
            <Suspense fallback={<FullPageSpinner />}>
                <ErrorBoundary FallbackComponent={RouteError}>
                    <Outlet />
                </ErrorBoundary>
            </Suspense>
        </>
    );
}
