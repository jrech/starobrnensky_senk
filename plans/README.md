# Animation improvement plans

Audit generated from commit `cb5b869` using the `improve-animations` motion audit.

## Prioritized findings

| # | Title | Severity | Status |
| --- | --- | --- | --- |
| 001 | Move rum progress to a compositor transform | HIGH | TODO |
| 002 | Consolidate frequent UI timing | MEDIUM | TODO |
| 003 | Add restrained button press feedback | MEDIUM | TODO |

## Recommended execution order

1. **001** first: it removes layout work from a scroll-driven path and has no visual design dependency.
2. **002** second: it establishes shared timing tokens for frequent UI interactions.
3. **003** third: it adds a small physical response using the timing established by the existing button rule.

All three plans are independent and can be executed in one branch. After each plan, run the mechanical build and perform the feel check described in that plan.

## Missed opportunities noted during the audit

- The reservation success/error status at `src/scripts/site.ts:468–480` changes text immediately. A short opacity transition could soften the swap, but it should be planned separately because it requires choosing whether the status height is reserved or animated.
- The allergen dialog opens through the native `showModal()` call at `src/scripts/site.ts:153` without a spatial entrance. A 200–300ms opacity/scale transition could clarify the relationship to the trigger, but native dialog behavior needs a dedicated feel check across Chromium and Safari.
- The lunch panel content swap at `src/scripts/site.ts:167` already has a good 200ms reveal; no additional animation is recommended there.
