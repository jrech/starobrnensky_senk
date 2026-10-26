# 003 — Add restrained button press feedback

- **Status**: TODO
- **Commit**: cb5b869
- **Severity**: MEDIUM
- **Category**: Missed opportunity / Physicality
- **Estimated scope**: 1 file, 3–5 lines

## Problem

Buttons have hover movement but no press state. On touch and keyboard activation, the user gets no immediate physical acknowledgement before the action completes.

```css
/* src/styles/global.css:60–61 */
.button { ... transition: color .18s, background .18s, transform .16s var(--ease-out); cursor: pointer; }
/* No .button:active rule exists. */
```

## Target

Add a subtle, interruptible press response that compresses the button to 97% and returns through the existing transform transition.

```css
/* src/styles/global.css */
.button:active { transform: scale(.97) translateY(0); }
```

The existing `.button` transition must include `transform 160ms var(--ease-out)`, which it already does through the current `.16s` declaration. Do not add a second transition or a keyframe animation.

## Repo conventions to follow

- The button already uses the shared `--ease-out` token and a 160ms transform transition at `src/styles/global.css:60`.
- Keep hover behavior inside the existing `@media (hover: hover) and (pointer: fine)` block at `src/styles/global.css:403`.
- `:active` is intentionally not hover-gated because it is the direct press feedback needed on touch devices too.

## Steps

1. Add `.button:active { transform: scale(.97) translateY(0); }` immediately after the base `.button` declaration in `src/styles/global.css`.
2. Confirm the active rule wins over the pointer-only hover translate while the pointer is pressed.
3. Leave `.button span` arrow motion unchanged.

## Boundaries

- Do NOT add bounce, keyframes, or scale below `.97`.
- Do NOT add press feedback to text links, navigation items, or form inputs in this plan.
- Do NOT change button markup or interaction logic.

## Verification

- **Mechanical**: run `corepack pnpm build`; Astro check must report 0 errors, 0 warnings, and 0 hints.
- **Feel check**: click and hold the reservation CTA on desktop and tap it on mobile; confirm the button compresses subtly and returns immediately on release.
- Repeat activation rapidly and confirm the transform retargets from the current state rather than restarting a keyframe.
- Toggle `prefers-reduced-motion`; confirm the global reduced-motion rule keeps the press response effectively instantaneous.
- **Done when**: every `.button` gives a visible but restrained press acknowledgement without shifting surrounding layout.
