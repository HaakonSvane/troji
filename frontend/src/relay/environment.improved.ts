import {
    Environment,
    Network,
    RequestParameters,
    Variables,
    GraphQLResponse,
    QueryResponseCache,
    CacheConfig,
    Store,
    RecordSource,
} from "relay-runtime";
import { graphQlQuery } from "@/app/api/graphql/query/graphQlQuery";

const IS_SERVER = typeof window === "undefined";
const CACHE_TTL = 5 * 60 * 1000; // Increase to 5 minutes

export async function networkFetch(
    request: RequestParameters,
    variables: Variables,
): Promise<GraphQLResponse> {
    const body = JSON.stringify({ query: request.text, variables });
    let response: Response;
    
    if (IS_SERVER) {
        response = await graphQlQuery(body);
    } else {
        response = await fetch(`/api/graphql/query`, { 
            method: "POST", 
            body,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }
    
    if (!response.ok) {
        throw new Error(`Network fetch error: ${response.status}`);
    }
    
    const json = await response.json();
    
    if (Array.isArray(json.errors)) {
        if (process.env.NODE_ENV === 'development') {
            console.error(json.errors);
        }
        throw new Error(
            `Error fetching GraphQL query: '${request.name}' with variables '${JSON.stringify(
                variables,
            )}':\n${JSON.stringify(json.errors)}`,
        );
    }
    
    return json;
}

export const responseCache: QueryResponseCache | null = IS_SERVER
    ? null
    : new QueryResponseCache({ size: 250, ttl: CACHE_TTL }); // Increase cache size

function createNetwork() {
    async function fetchResponse(
        params: RequestParameters,
        variables: Variables,
        cacheConfig: CacheConfig,
    ) {
        const isQuery = params.operationKind === "query";
        const cacheKey = params.id ?? params.cacheID;
        const forceFetch = cacheConfig?.force;
        
        if (responseCache && isQuery && !forceFetch) {
            const fromCache = responseCache.get(cacheKey, variables);
            if (fromCache) {
                return fromCache;
            }
        }
        
        const result = await networkFetch(params, variables);
        
        // Cache successful queries
        if (responseCache && isQuery && !result.errors) {
            responseCache.set(cacheKey, variables, result);
        }
        
        return result;
    }
    
    return Network.create(fetchResponse);
}

function createEnvironment() {
    return new Environment({
        network: createNetwork(),
        store: new Store(RecordSource.create()),
        isServer: IS_SERVER,
    });
}

// Singleton environments
export const environment = createEnvironment();
let serverEnvironment: Environment | null = null;

export function getCurrentEnvironment() {
    if (IS_SERVER) {
        if (!serverEnvironment) {
            serverEnvironment = createEnvironment();
        }
        return serverEnvironment;
    }
    return environment;
}