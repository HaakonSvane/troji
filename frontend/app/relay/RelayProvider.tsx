import { useAuth } from "@clerk/react-router";
import { useEffect, useMemo } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import { createRelayEnvironment, setCurrentEnvironment } from "./environment";

interface RelayProviderProps {
    children: React.ReactNode;
}

export function RelayProvider({ children }: RelayProviderProps) {
    const { userId, getToken } = useAuth();

    // Recreate the Relay environment when the signed-in user changes.
    // This prevents data leaks between users on sign-in / sign-out.
    const environment = useMemo(
        () => createRelayEnvironment(() => getToken()),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [userId]
    );

    // Keep the module-level ref in sync so clientLoaders can call getRelayEnvironment().
    useEffect(() => {
        setCurrentEnvironment(environment);
    }, [environment]);

    return <RelayEnvironmentProvider environment={environment}>{children}</RelayEnvironmentProvider>;
}
