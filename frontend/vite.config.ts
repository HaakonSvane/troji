import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import relay from "vite-plugin-relay";
import { defineConfig } from "vite";
import { relaySsrPlugin } from "./app/relay/vite-plugin-relay-ssr";
import packageJson from "./package.json";

export default defineConfig({
    plugins: [tailwindcss(), relay, relaySsrPlugin(), reactRouter()],
    resolve: {
        tsconfigPaths: true,
    },
    define: {
        __APP_VERSION__: JSON.stringify(packageJson.version),
    },
    // Tell Vite not to externalize relay packages during SSR so they go through
    // the plugin pipeline where relaySsrPlugin() intercepts them.
    ssr: {
        noExternal: [/^relay-runtime(?:\/|$)/, /^react-relay(?:\/|$)/],
    },
    // Pre-transform entry points before serving so Vite discovers all transitive
    // deps upfront. Without this, deps found lazily during SSR hydration trigger
    // mid-request re-optimization (504 "Outdated Optimize Dep"), which Safari
    // does not retry automatically (Chrome does).
    server: {
        warmup: {
            clientFiles: ["./app/root.tsx", "./app/routes/**/*.tsx"],
        },
        // Mirror prod Caddy routing in dev so signed image URLs (which are
        // path-only `/api/images/...`) resolve against the backend instead of
        // 404'ing on the frontend dev server.
        proxy: {
            "/api": "http://localhost:5063",
        },
    },
    // Client-side pre-bundling: converts relay's CJS to ESM for the browser.
    // SSR is handled by relaySsrPlugin() instead — see that file for details.
    optimizeDeps: {
        include: [
            "relay-runtime",
            "relay-runtime/experimental",
            "react-relay",
            "react",
            "react-dom",
            "react/jsx-runtime",
        ],
    },
});
