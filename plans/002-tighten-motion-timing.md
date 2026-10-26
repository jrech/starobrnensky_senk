# 002 — Consolidate frequent UI timing

- **Status**: TODO
- **Commit**: cb5b869
- **Severity**: MEDIUM
- **Category**: Easing & duration / Cohesion
- **Estimated scope**: 1 file, 10–15 lines

## Problem

Several frequently encountered UI transitions still sit at or above the 300ms budget even though the rest of the interface has already been tightened. This makes the header, status indicator, menu toggle, and link underline feel slower than the day-tab and mobile-menu interactions.

```css
/* src/styles/global.css:67 */
.text-link::after { ... transition: transform .35s var(--ease-out); }
```

```css
/* src/styles/global.css:82 */
.site-header { ... transition: color .35s, background .35s, transform .35s var(--ease-out), border-color .35s; }
```

```css
/* src/styles/global.css:104 */
.status-dot { ... transition: background .36s var(--ease-out), box-shadow .36s var(--ease-out); }
```

```css
/* src/styles/global.css:295 */
.menu-toggle span { ... transition: transform .3s var(--ease-out); }
```

## Target

Introduce shared short-duration tokens and use them for high-frequency UI motion.

```css
/* src/styles/global.css:22 — add to :root */
--duration-press: 160ms;
--duration-ui: 200ms;
```

```css
/* target values */
.text-link::after { transition: transform var(--duration-ui) var(--ease-out); }
.site-header { transition: color var(--duration-ui), background var(--duration-ui), transform var(--duration-ui) var(--ease-out), border-color var(--duration-ui); }
.status-dot { transition: background var(--duration-ui) var(--ease-out), box-shadow var(--duration-ui) var(--ease-out); }
.menu-toggle span { transition: transform var(--duration-ui) var(--ease-out); }
```

## Repo conventions to follow

- Easing tokens already live in `:root` at `src/styles/global.css:1–24`; add duration tokens there rather than creating component-local variables.
- Use the existing strong `--ease-out: cubic-bezier(.22, 1, .36, 1)`.
- Existing lunch-panel and mobile-menu timings in `src/scripts/site.ts:129` and `src/scripts/site.ts:167` are already within the intended range; use them as the interaction-speed reference.

## Steps

1. Add `--duration-press: 160ms` and `--duration-ui: 200ms` to the root token block.
2. Replace the four transition declarations at the cited locations with the exact target declarations above.
3. Preserve all animated properties and color values; this plan changes timing and token reuse only.

## Boundaries

- Do NOT shorten marketing/editorial motion such as hero and section reveals.
- Do NOT change the reduced-motion media query.
- Do NOT use `transition: all`.

## Verification

- **Mechanical**: run `corepack pnpm build`; Astro check must report 0 errors, 0 warnings, and 0 hints.
- **Feel check**: scroll across the header threshold, open/close the mobile menu, hover a text link on desktop, and observe a status change; each should respond in roughly 160–200ms without feeling abrupt.
- Check that the menu icon still completes its two-line morph cleanly and never leaves a half-rotated state after repeated toggles.
- Toggle `prefers-reduced-motion` and confirm these transitions collapse through the existing global rule.
- **Done when**: no cited high-frequency transition is longer than 200ms and the page still feels visually consistent with the existing `--ease-out` curve.
