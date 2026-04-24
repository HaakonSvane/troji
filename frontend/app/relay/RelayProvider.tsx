import { useAuth } from "@clerk/react-router";
import { useMemo } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import { getOrCreateRelayEnvironment } from "./environment";

interface RelayProviderProps {
    children: React.ReactNode;
}

export function RelayProvider({ children }: RelayProviderProps) {
    const { userId, getToken } = useAuth();

    // Keep a stable environment during initial auth hydration to avoid preloaded-query mismatches.
    // The environment is still recreated for real user switches and sign-out.
    const environment = useMemo(
        () => getOrCreateRelayEnvironment(userId, () => getToken()),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [userId]
    );

    return (
        <RelayEnvironmentProvider environment={environment}>{children}</RelayEnvironmentProvider>
    );
}
