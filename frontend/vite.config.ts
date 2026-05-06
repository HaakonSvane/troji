import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import relay from "vite-plugin-relay";
import { defineConfig } from "vite";
import { relaySsrPlugin } from "./app/relay/vite-plugin-relay-ssr";

export default defineConfig({
    plugins: [tailwindcss(), relay, relaySsrPlugin(), reactRouter()],
    resolve: {
        tsconfigPaths: true,
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
            "next-themes",
        ],
    },
});
