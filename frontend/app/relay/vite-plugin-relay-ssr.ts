/**
 * Vite plugin that makes CJS-only relay packages work in Vite 8's ESM-only SSR
 * module runner.
 *
 * Problem: relay-runtime and react-relay ship only CommonJS (`module.exports`).
 * Vite 8's SSR module runner evaluates all code as ESM, so raw CJS fails.
 * Pre-bundling via `ssr.optimizeDeps` converts CJS→ESM but creates a separate
 * React instance (the pre-bundled relay resolves react through a different path
 * than react-dom/server), causing the "Invalid hook call" error.
 *
 * Solution: During SSR, intercept imports of relay packages and return virtual
 * ESM modules that use Node's native `createRequire()` to load the CJS
 * originals. This keeps relay in CJS-land (sharing Node's module cache with
 * react-dom/server → single React instance) while presenting proper ESM named
 * exports to Vite's module runner.
 */

import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import type { Plugin, ResolvedConfig } from "vite";

const VIRTUAL_PREFIX = "\0relay-ssr:";

interface PackageShim {
    /** The bare import specifier, e.g. "relay-runtime" */
    specifier: string;
    /** Discovered named exports (populated at config time) */
    exports: string[];
}

/**
 * Type-only exports from relay-runtime that are not present in module.exports
 * but appear in generated graphql artifact files as value imports.
 * These are TypeScript interfaces/types erased at runtime; Rolldown still
 * needs a binding for each named import, so we emit `export const X = undefined`.
 */
const RELAY_RUNTIME_TYPE_STUBS = [
    "ConcreteRequest",
    "FragmentRefs",
    "ReaderFragment",
    "ReaderInlineDataFragment",
] as const;

export function relaySsrPlugin(): Plugin {
    const packages: PackageShim[] = [
        { specifier: "relay-runtime", exports: [] },
        { specifier: "relay-runtime/experimental", exports: [] },
        { specifier: "react-relay", exports: [] },
    ];

    let projectRoot: string;

    return {
        name: "relay-ssr-compat",
        // Run before Vite's default resolution so we intercept bare specifiers.
        enforce: "pre" as const,

        configResolved(config: ResolvedConfig) {
            projectRoot = config.root;

            // Use createRequire anchored to the project root so that
            // require('relay-runtime') resolves from node_modules/.
            const require = createRequire(pathToFileURL(`${projectRoot}/`).href);

            for (const pkg of packages) {
                const mod = require(pkg.specifier);
                pkg.exports = Object.keys(mod).filter(isValidIdentifier);
            }
        },

        resolveId(id, _importer, options) {
            // In Vite 8 the ssr flag may live on options or on this.environment.
            const isSsr = options?.ssr === true || (this as any).environment?.name === "ssr";
            if (!isSsr) return null;

            const pkg = packages.find((p) => p.specifier === id);
            if (pkg) return `${VIRTUAL_PREFIX}${pkg.specifier}`;
            return null;
        },

        load(id) {
            if (!id.startsWith(VIRTUAL_PREFIX)) return null;
            const specifier = id.slice(VIRTUAL_PREFIX.length);
            const pkg = packages.find((p) => p.specifier === specifier);
            if (!pkg) return null;

            const requireAnchor = JSON.stringify(pathToFileURL(`${projectRoot}/`).href);

            const lines = [
                `import { createRequire as __cr } from "node:module";`,
                `const __require = __cr(${requireAnchor});`,
                `const __mod = __require(${JSON.stringify(specifier)});`,
                ...pkg.exports.map(
                    (name) => `export const ${name} = __mod[${JSON.stringify(name)}];`
                ),
                // Type-only stubs: TypeScript erases these at runtime but Rolldown
                // needs a binding for each named import in generated relay artifacts.
                ...(specifier === "relay-runtime"
                    ? RELAY_RUNTIME_TYPE_STUBS.filter((name) => !pkg.exports.includes(name)).map(
                          (name) => `export const ${name} = undefined;`
                      )
                    : []),
                `export default __mod;`,
            ];

            return lines.join("\n");
        },
    };
}

/** Returns true if `name` is a valid JS identifier (safe for `export const`). */
function isValidIdentifier(name: string): boolean {
    return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name);
}
