# 001 — Move rum progress to a compositor transform

- **Status**: TODO
- **Commit**: cb5b869
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 2 files, 6–10 lines

## Problem

The rum progress indicator is updated on every horizontal/vertical scroll update by changing `width`. That property participates in layout and paint, so the progress bar can compete with the pinned horizontal track while the user scrolls.

```ts
// src/scripts/site.ts:411
onUpdate: (self) => { if (progress) progress.style.width = `${self.progress * 100}%`; },
```

```ts
// src/scripts/site.ts:425
progress.style.width = `${Math.min(1, Math.max(0, ratio)) * 100}%`;
```

```css
/* src/styles/global.css:187 */
.rum-progress i { display: block; width: 0; height: 1px; background: var(--honey-300); }
```

## Target

Keep the progress element at full width and animate only its compositor-friendly transform.

```css
/* src/styles/global.css */
.rum-progress i {
  display: block;
  width: 100%;
  height: 1px;
  background: var(--honey-300);
  transform: scaleX(0);
  transform-origin: left center;
  will-change: transform;
}
```

```ts
// src/scripts/site.ts — desktop onUpdate
onUpdate: (self) => {
  if (progress) progress.style.transform = `scaleX(${self.progress})`;
},
```

```ts
// src/scripts/site.ts — mobile updateProgress
const ratio = maxScroll > 0 ? viewport.scrollLeft / maxScroll : 0;
progress.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
```

## Repo conventions to follow

- Use the existing `--ease-out` token only for discrete UI transitions; the scroll-driven progress must remain direct and `ease: "none"`.
- Preserve the existing desktop `scrub: .2` and mobile passive scroll listener.
- The existing rum track already animates through GSAP transforms at `src/scripts/site.ts:400`.

## Steps

1. Update `src/styles/global.css:187` so `.rum-progress i` uses `width: 100%`, `transform: scaleX(0)`, `transform-origin: left center`, and `will-change: transform`.
2. Replace the desktop `progress.style.width` assignment at `src/scripts/site.ts:411` with a clamped `scaleX` transform based on `self.progress`.
3. Replace the mobile `progress.style.width` assignment at `src/scripts/site.ts:425` with a clamped `scaleX` transform based on `ratio`.
4. Do not add a CSS transition to the progress bar; it must track the user’s scroll position without lag.

## Boundaries

- Do NOT change the rum track distance, pinning, `scrub`, card layout, or mobile scroll behavior.
- Do NOT animate `width`, `left`, `right`, `margin`, or `padding` for progress updates.
- Do NOT add a dependency.

## Verification

- **Mechanical**: run `corepack pnpm build`; Astro check must report 0 errors, 0 warnings, and 0 hints.
- **Feel check**: on desktop, scroll through the pinned rum section and confirm the gold line follows the scroll continuously without visible lag; on mobile, drag the rum carousel and confirm the indicator updates immediately.
- In DevTools Performance, record one desktop rum pass and confirm the progress update does not trigger repeated layout work.
- Toggle `prefers-reduced-motion`; confirm the existing reduced-motion branch remains unchanged.
- **Done when**: `rg "progress\.style\.width" src/scripts/site.ts` returns no matches and the indicator reaches exactly 100% at the end of the rum journey.
