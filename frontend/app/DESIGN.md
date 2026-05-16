# Troji Design Language

The single source of truth for visual decisions. If you're styling a new surface and feel uncertain, the rules here resolve it. If a rule here conflicts with what you're building, that's a conversation — don't drift.

## Principles

1. **Gold is reserved for reward.** Use `--medal-gold` for the brand wordmark, the active state of primary controls, the cursor, the "ready" indicator, and rank emphasis. Nothing else gets gold. Other accents (blue, green, purple) are banned in UI surfaces; only `--destructive`, `--success`, and `--warning` exist and only fire on real status (validation, toasts).
2. **Mono is chrome and action.** Status bars, version pills, prompt prefixes, breadcrumbs, and every `<Button>` label read in Geist Mono — buttons inherit it from the component base, no opt-in needed. SHOUTY mono (uppercase + wide tracking) stays reserved for marquee command-style CTAs (`size="terminal"`). Never apply mono to body paragraphs or long copy.
3. **Flat over layered.** No gradient backgrounds. No glassmorphism. No backdrop blur. No drop shadows beyond `shadow-sm`. A 1px border is the canonical separator.
4. **Mobile is first-class.** 360px is the design floor. Tap targets ≥44×44px. Single column below `sm` (640px). Anything else is a regression.
5. **3D medals are the contrast.** When we render a medal, it's allowed to look 3D, gradient-rich, and tactile. That's the deliberate counter-beat to the flat terminal — don't extend the medal aesthetic to the rest of the UI.

## Tokens (`app/app.css`)

The design is dark-only. `:root` carries the palette and `<html class="dark">` is forced from `root.tsx` so Tailwind `dark:` variants on lingering shadcn primitives still match while we phase them out.

| Token | Value | Use |
|---|---|---|
| `--background` | `oklch(0.135 0.006 75)` | App canvas. Pair with `.terminal-grid` for atmosphere; never gradients. |
| `--foreground` | `oklch(0.97 0.005 75)` | Primary text. |
| `--muted-foreground` | `oklch(0.62 0.01 75)` | Mono chrome, supporting text, disabled labels. |
| `--surface` | `oklch(0.16 0.006 75)` | Cards, panels, table rows — one tone above background. |
| `--surface-muted` | `oklch(0.19 0.007 75)` | Hover states, secondary fills. |
| `--surface-elevated` | `oklch(0.18 0.007 75)` | Modals, popovers. |
| `--border` | `oklch(1 0 0 / 0.14)` | The canonical separator. Bumped from 10% so it actually shows. |
| `--input` | `oklch(1 0 0 / 0.10)` | Form field fills. |
| `--medal-gold` | `oklch(0.78 0.14 84)` | The only chromatic accent in UI. |
| `--medal-silver`, `--medal-bronze` | as defined | Used by the 3D `MedalBadge` only — not for general UI accents. |
| `--destructive`, `--success`, `--warning` | as defined | Reserved for real status. Don't decorate with them. |
| `--ring` | `oklch(0.78 0.14 84)` (gold) | Focus ring. |
| `--radius` | `0.375rem` | Computed scale: `--radius-sm` = 60% (`0.225rem`), `--radius-md` = 80% (`0.3rem`), `--radius-lg` = 100% (`0.375rem`). |

**Do**: `bg-background text-foreground border-border` for app surfaces. `bg-surface border-border` for panels. `text-medal-gold` to mark reward/active state.

**Don't**: hardcode hex colors. Don't reach for `bg-blue-500` / `text-purple-300` / etc. — those colors are not part of the language.

## Typography

Three families, loaded via Google Fonts in `root.tsx`. Each has one job.

| Utility | Family | Use |
|---|---|---|
| `font-heading` | IBM Plex Serif | Display: marquee headlines, italic blockquotes, group/game names in detail headers. Always `tracking-[0.025em]` (or `[0.015em]` for body-sized italic), `font-medium` (500). Italic earns `text-foreground` (not gold — gold is the wordmark only). |
| `font-sans` | Inter | Body, paragraphs, table cells, form fields, labels, dense UI. Default for everything not explicitly chrome. |
| `font-mono` | Geist Mono | System chrome AND all `<Button>` labels. Buttons inherit mono from the component base — do not opt out. Uppercase + `tracking-[0.18em]–[0.28em]` is reserved for `size="terminal"`, breadcrumbs, mono pills, role badges, and section labels. Never on body paragraphs. |

**Do**: `font-heading text-3xl italic tracking-[0.015em] text-foreground` for an empty-state quote. `font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground` for a section breadcrumb.

**Don't**: don't use `font-mono` for paragraphs of explanatory copy. Don't use the wordmark gold on any italic line. Don't apply `font-sans` to a `<Button>` action label — the unified mono is intentional.

## Shape and chrome

- **Radius**: `rounded-sm` (chrome and CTAs) or `rounded-md` (cards, inputs, popovers). `rounded-xl`/`rounded-2xl`+ are banned.
- **Borders**: visible 1px on every panel boundary. Replace ring-based separation (`ring-1 ring-foreground/10`) with `border border-border`.
- **Shadows**: `shadow-sm` only, on interactive cards if needed for hierarchy. No `shadow-md`+, no inset shadows (medal exception).
- **Animations**: only `animate-pulse` on status dots and the cursor bar, and `animate-ping` on the gold "ready" dot. Hover/focus get `transition-colors`. Anything fancier needs justification.

## Component recipes

### Status bar (top of marquee surfaces)

```tsx
<header className="mx-auto flex max-w-6xl items-center justify-between border-b border-border px-6 py-4">
    <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        <span className="text-foreground/85">troji</span>
        <span aria-hidden className="text-border">│</span>
        <span>v0.4.1</span>
    </div>
    <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        <span className="relative flex size-1.5" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-medal-gold/70" />
            <span className="relative inline-flex size-1.5 rounded-full bg-medal-gold" />
        </span>
        <span>ready</span>
    </div>
</header>
```

### Mono breadcrumb / section label

```tsx
<p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
    <span className="text-medal-gold">$</span>
    <span className="ml-2">groups</span>
</p>
```

For multi-level breadcrumbs use clickable `<Link>` segments and `<span aria-hidden className="mx-2 text-border">/</span>` separators.

### Marquee headline (italic serif)

```tsx
<h1 className="font-heading text-4xl italic font-medium leading-tight tracking-[0.015em] text-foreground sm:text-5xl">
    Your circles.
</h1>
```

For the `troji` wordmark specifically, use `text-medal-gold` instead of `text-foreground` — that is the one place the brand reads in gold.

### Primary CTA (gold prompt button)

Use `<Button variant="gold" size="terminal">` for marquee surfaces. The `terminal` size adds uppercase + tracking; mono is the button default across all sizes.

```tsx
<Button variant="gold" onClick={...}>
    <span aria-hidden className="text-base leading-none text-medal-gold">▸</span>
    New circle
</Button>
```

For the bigger anchor-style CTA on welcome/auth/register pages with a blinking cursor, use the bespoke pattern:

```tsx
<Link
    to="/sign-up"
    className="group inline-flex items-center justify-center gap-3 rounded-sm border border-medal-gold/70 bg-medal-gold/8 px-6 py-3 font-mono text-sm uppercase tracking-[0.18em] text-medal-gold transition-colors hover:border-medal-gold hover:bg-medal-gold/14"
>
    <span aria-hidden className="opacity-70 transition-opacity group-hover:opacity-100">▸</span>
    <span>create account</span>
    <span aria-hidden className="ml-1 inline-block h-3.5 w-1.75 -translate-y-px animate-pulse bg-medal-gold/85" />
</Link>
```

### Secondary CTA (muted outline)

```tsx
<Button variant="outline" onClick={...}>
    <span aria-hidden className="text-base leading-none text-muted-foreground">›</span>
    Join with code
</Button>
```

### Surface panel

Use the `surface-card` utility (radius + border + bg). Add `surface-card-interactive` for hover gold-border.

```tsx
<div className="surface-card surface-card-interactive flex flex-col gap-2 p-5">
    ...
</div>
```

### Stat readout (terminal-style number panel)

Mono caps label, big serif number, small muted description. Pass `accented` to make the leading metric gold.

```tsx
<div className="surface-card flex flex-col gap-2 p-5">
    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        Awards
    </p>
    <p className="font-heading text-4xl font-medium leading-none tracking-[0.015em] text-foreground">
        23
    </p>
    <p className="text-xs leading-relaxed text-muted-foreground">
        Trophies handed out.
    </p>
</div>
```

### Empty state (marquee)

```tsx
<div className="surface-card flex flex-col items-start gap-3 p-6 sm:p-8">
    <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-medal-gold">
        <span aria-hidden className="mr-2">▸</span>
        ledger empty
    </p>
    <p className="font-heading text-2xl italic tracking-[0.015em] text-foreground sm:text-3xl">
        No circles yet — go assemble one.
    </p>
    <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
        ...
    </p>
</div>
```

### Mono role pill

```tsx
<span className="rounded-sm border border-medal-gold/40 bg-medal-gold/8 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-medal-gold">
    Owner
</span>
```

For neutral pills (counts, statuses) use the `pill-muted` utility.

## Voice

The user has signed off on a marquee/utility split. Stick to it.

| Surface type | Voice | Examples |
|---|---|---|
| **Marquee** | Attitudinal, witty, slightly arrogant. | "To the victor, the data." · "no circles yet — go assemble one" · "Stake your name in the ledger." · "Settle a rivalry. Crown a champion." · "the ledger is empty" |
| **Utility** | Neutral, functional, brief. | "First name" · "Could not save your changes." · "Members" · "v0.4.1" · "ready" |

Marquee surfaces:
- Welcome (full landing page)
- The headline + sub-headline at the top of every protected route
- Empty states
- Primary CTAs on landing/auth/register/dashboard
- The `READY` indicator and mono prompts (which get attitude through the `$` and `▸` markers, not the words)

Utility surfaces:
- Form labels and validation errors
- Tab labels and tab counts
- Table cells and column headers
- In-row action buttons ("New game", "Invite", "Save changes")
- Modal dialog titles for utility actions ("Create a circle" — neutral framing of a marquee word)

Mono prompts and their meaning:
- `$` — section label or breadcrumb root.
- `▸` — primary affordance, active selection, marquee accent.
- `›` — secondary affordance, "more" indicator.
- `▮` — blinking cursor. Reserved for the primary CTA on marquee surfaces. One per page max.
- `‹` — back navigation in mono breadcrumbs.

Naming conventions: user-facing copy says **circle**, never **group**. The URL slug, GraphQL type, and any internal API stays **Group** for technical consistency.

## Mobile playbook

Non-negotiables:

- Design floor: 360px viewport.
- Tap targets: 44×44px minimum on touch surfaces. The shadcn `Button` defaults to `h-9` (36px) — fine for desktop, but for primary CTAs on auth/register/dashboard use the bespoke prompt pattern with `px-6 py-3` (≈48px tall).
- Single column below `sm` (640px). Multi-column starts at `sm`.
- Display serif scales down responsively: `text-7xl sm:text-[8.5rem]` for the wordmark; `text-4xl sm:text-5xl` for marquee H1s.
- Status bar version pill and `READY` chip drop out below `md:` to leave room.
- Auth/register: test at 360px portrait first, desktop second.

## Anti-patterns (banned)

- Gradient backgrounds (`bg-gradient-*`, `from-* / to-*`).
- Glassmorphism (`backdrop-blur-*`, `bg-white/10` over busy backgrounds).
- Drop shadows beyond `shadow-sm`.
- Oversized rounding (`rounded-xl`, `rounded-2xl`, `rounded-3xl`).
- Mono on body paragraphs (button labels are not body — they get mono by default).
- Italic gold (gold is the wordmark; italic serif is the marquee headline tone).
- Light-mode fallbacks. The app is dark-only.
- Inventing new accent colors. Add a token to this file before reaching for one.
- Animations beyond pulse/ping on status indicators and `transition-colors` on hover/focus.
- "Group" in user-facing copy. Always "circle" on the surface; "Group" only as a technical term.

## When you're stuck

- Cross-reference the welcome page and the dashboard/groups landing — they're the canonical examples.
- If a primitive doesn't have a recipe here, restyle it to use `border border-border`, `rounded-md` or `rounded-sm`, no shadow, no blur, and pick up tokens via `bg-surface`/`bg-popover`/`bg-card`.
- If you're tempted to add a new utility class, ask whether it's used 3+ times. If yes, add it to `app.css` under `@layer utilities`. If no, inline it.
