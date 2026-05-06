import { getAuth } from "@clerk/react-router/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Outlet, redirect } from "react-router";
import { Header } from "@/components/Header";
import type { Route } from "./+types/_protected";

export async function loader(args: Route.LoaderArgs) {
    const { isAuthenticated } = await getAuth(args);
    if (!isAuthenticated) {
        throw redirect("/sign-in");
    }
    return null;
}

function FullPageSpinner() {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
    );
}

function RouteError({ error }: { error: unknown }) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return (
        <main className="flex h-screen w-full flex-col items-center justify-center gap-4 p-8">
            <h1 className="text-2xl font-semibold">Something went wrong</h1>
            <p className="text-muted-foreground">{message}</p>
        </main>
    );
}

export default function ProtectedLayout() {
    return (
        <div className="flex h-screen flex-col overflow-hidden">
            <Header />
            <div className="flex-1 overflow-y-auto">
                <Suspense fallback={<FullPageSpinner />}>
                    <ErrorBoundary FallbackComponent={RouteError}>
                        <Outlet />
                    </ErrorBoundary>
                </Suspense>
            </div>
        </div>
    );
}
