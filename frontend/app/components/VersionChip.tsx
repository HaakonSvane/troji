import { useEffect, useState } from "react";
import { Link } from "react-router";
import { FRONTEND_VERSION } from "@/lib/version";

let cachedBackendVersion: Promise<string> | null = null;

function fetchBackendVersion(): Promise<string> {
    if (cachedBackendVersion) {
        return cachedBackendVersion;
    }

    const graphqlUrl = import.meta.env.VITE_GRAPHQL_URL as string | undefined;
    if (!graphqlUrl) {
        cachedBackendVersion = Promise.resolve("?");
        return cachedBackendVersion;
    }

    const url = new URL("/server-info", graphqlUrl).toString();
    cachedBackendVersion = fetch(url)
        .then((response) => (response.ok ? response.json() : Promise.reject(response)))
        .then((body: { version: string }) => body.version)
        .catch(() => "?");

    return cachedBackendVersion;
}

interface VersionChipProps {
    homeHref?: string;
}

export function VersionChip({ homeHref = "/" }: VersionChipProps) {
    const [backendVersion, setBackendVersion] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        fetchBackendVersion().then((version) => {
            if (!cancelled) {
                setBackendVersion(version);
            }
        });
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            <Link
                to={homeHref}
                className="text-foreground/85 transition-colors hover:text-foreground"
                aria-label="troji home"
            >
                troji
            </Link>
            <span aria-hidden className="text-border">│</span>
            <span>v{FRONTEND_VERSION}</span>
            <span aria-hidden className="hidden text-border sm:inline">│</span>
            <span className="hidden sm:inline">server {backendVersion ?? "…"}</span>
        </div>
    );
}
