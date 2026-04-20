import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import relay from "vite-plugin-relay";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), relay, reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
  // relay-runtime and react-relay are CJS-only packages. noExternal tells Vite to
  // transform them (rather than leaving them as Node externals) during SSR so that
  // named ESM exports work. Do NOT add ssr.optimizeDeps for these — pre-bundling
  // them causes a duplicate React instance because the pre-bundled chunk resolves
  // react via a different path than react-dom/server.
  ssr: {
    noExternal: [/^relay-runtime(?:\/|$)/, /^react-relay(?:\/|$)/],
  },
  optimizeDeps: {
    include: ["relay-runtime", "relay-runtime/experimental", "react-relay"],
  },
});
