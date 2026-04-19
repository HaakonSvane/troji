import { Environment, Network, RecordSource, Store } from "relay-runtime";
import type { FetchFunction } from "relay-runtime";

function createFetchFn(getToken: () => Promise<string | null>): FetchFunction {
    return async (request, variables) => {
        const token = await getToken();
        const response = await fetch(import.meta.env.VITE_GRAPHQL_URL as string, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ query: request.text, variables }),
        });
        return response.json();
    };
}

export function createRelayEnvironment(getToken: () => Promise<string | null>): Environment {
    return new Environment({
        network: Network.create(createFetchFn(getToken)),
        store: new Store(new RecordSource()),
    });
}

// Module-level ref so clientLoaders can access the environment outside React rendering.
// RelayProvider keeps this in sync whenever the environment is recreated (e.g. user changes).
let _currentEnvironment: Environment | null = null;

export function setCurrentEnvironment(env: Environment): void {
    _currentEnvironment = env;
}

export function getRelayEnvironment(): Environment {
    if (!_currentEnvironment) {
        throw new Error(
            "Relay environment is not initialized. Make sure RelayProvider is mounted."
        );
    }
    return _currentEnvironment;
}
