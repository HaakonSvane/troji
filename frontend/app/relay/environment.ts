import { Environment, Network, RecordSource, Store } from "relay-runtime";
import type { FetchFunction, RequestParameters, Variables } from "relay-runtime";
import type { GraphQLResponse } from "relay-runtime/lib/network/RelayNetworkTypes";

async function executeGraphQLRequest(
    getToken: () => Promise<string | null>,
    request: RequestParameters,
    variables: Variables
): Promise<GraphQLResponse> {
    const token = await getToken();
    const response = await fetch(import.meta.env.VITE_GRAPHQL_URL as string, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ query: request.text, variables }),
    });

    return response.json() as Promise<GraphQLResponse>;
}

function createFetchFn(getToken: () => Promise<string | null>): FetchFunction {
    return async (request, variables) => {
        return await executeGraphQLRequest(getToken, request, variables);
    };
}

export function createRelayEnvironment(getToken: () => Promise<string | null>): Environment {
    return new Environment({
        network: Network.create(createFetchFn(getToken)),
        store: new Store(new RecordSource()),
    });
}

type RelayEnvironmentKey = string | null | "__boot__";

// Module-level refs so clientLoaders can access the same environment instance as React context.
let _currentEnvironment: Environment | null = null;
let _currentEnvironmentKey: RelayEnvironmentKey | undefined;

// During initial auth hydration, Clerk can transition from `undefined` to a real user id.
// Keep using the boot environment for that first transition to avoid query/env mismatch warnings.
export function getOrCreateRelayEnvironment(
    userId: string | null | undefined,
    getToken: () => Promise<string | null>
): Environment {
    const nextKey: RelayEnvironmentKey = userId === undefined ? "__boot__" : userId;

    if (
        _currentEnvironment &&
        _currentEnvironmentKey === "__boot__" &&
        typeof nextKey === "string"
    ) {
        _currentEnvironmentKey = nextKey;
        return _currentEnvironment;
    }

    if (!_currentEnvironment || _currentEnvironmentKey !== nextKey) {
        _currentEnvironment = createRelayEnvironment(getToken);
        _currentEnvironmentKey = nextKey;
    }

    return _currentEnvironment;
}

export function getRelayEnvironment(): Environment {
    if (!_currentEnvironment) {
        throw new Error(
            "Relay environment is not initialized. Make sure RelayProvider is mounted."
        );
    }
    return _currentEnvironment;
}
