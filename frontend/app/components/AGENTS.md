# AGENTS.md — frontend/app/components/

The component directory contains all reusable components. See `frontend/AGENTS.md` for stack-wide rules and `app/DESIGN.md` for the design language.

## Where Things Live

- Generic components that assume no domain are stored in `./ui` (customized shadcn primitives).
- Reusable domain components are stored directly under this directory, grouped by feature in filenames (`Group*`, `Trophy*`, `New*Form`, etc.).

## UI Primitives Use Design Tokens

`ui/` components are shadcn primitives, customized to reference CSS variables from `app.css` (`--medal-gold`, `--surface-*`, etc.). Never hardcode hex/rgb/oklch values in a primitive or in code that wraps one. If you need a new colour, add a token in `app.css` first.

## DrawerDialog: The Responsive Container

`DrawerDialog.tsx` is the canonical responsive shell — `Dialog` at `>= 640px`, `Drawer` below. Any new modal-style surface (forms, confirmations, side sheets that aren't sidebars) should compose `DrawerDialog`, not pick `Dialog` or `Drawer` directly. It accepts `open`, `onOpenChange`, `title`, `description`, `footer`, and `children`.

## Form Pattern

The repeating form recipe is:

1. `DrawerDialog` shell, controlled via `open` / `onOpenChange` from the parent route.
2. Zod schema from `app/lib/validation/forms.ts` for input validation (returns `{ success: true; data } | { success: false; error }`).
3. Relay mutation via `useMutation` with `onCompleted` calling `getMutationErrorMessage(payload.errors, fallback)` from `app/lib/relay/mutationErrors.ts` to surface the first error message.
4. Mutations that affect connections take a `connections: string[]` prop (built with `ConnectionHandler.getConnectionID(parentId, "Key")` in the route).

Reference exemplar: `NewGameForm.tsx`. Follow this rather than inventing a parallel form pattern.

## MedalBadge: The 3D Exception

`MedalBadge.tsx` (+ `.css` + `.config.ts`) is the **only** intentionally 3D component — scroll-aware lighting, carved-emoji depth. It's the contrast piece against the otherwise flat design language (see `DESIGN.md`). Do not generalize the technique to other components, and do not flatten this one to "match the rest."

## AuthShell: Brand Chrome For Auth/Register

`AuthShell.tsx` is the reusable chrome (status bar + dot grid + footer) for sign-in, sign-up, and register routes. Don't redefine the brand chrome per route — extend `AuthShell` if a new auth-adjacent surface needs it.
