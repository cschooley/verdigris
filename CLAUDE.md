# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

verdigris is the design system for the cschooley security toolkit.
Tools consume it; it knows nothing about any tool's internals.

`GUIDE.md` is the source of truth for design decisions. `tokens/tokens.json`
is the source of truth for values. `tokens/tokens.css` must stay in sync
with it (until a build step generates it, change both in the same commit).

## Rules

- **Verdigris means live.** `--vg-accent-verdigris` is for live / active /
  connected states only. Never decorative, never links, never "success".
- **No pure black.** Backgrounds come from `--vg-bg-*`.
- **Color is information.** Don't add a color without a role in GUIDE.md.
- **Contrast is checked, not eyeballed.** Any token value change reruns a
  WCAG contrast check; text tokens must stay at or above 4.5:1 on
  `bg.base` and `bg.surface`. Record results in the commit message.
- **Never color alone.** Status and method are always shown as text too.
- **Icons:** 24px grid, 1.75 stroke, round caps/joins, `currentColor`,
  at most one accent element via `var(--vg-icon-accent, currentColor)`.
- **No copied designs.** Principles from Carbon, Elektron, the TR-808,
  and Teenage Engineering are fine; their actual glyphs, layouts, logos,
  and branding are not. Carbon code, if ever copied, keeps its Apache-2.0
  notice.
- **Respect reduced motion.** Every animation has a
  `prefers-reduced-motion` fallback.

## Mockups

`mockups/` holds self-contained HTML references. They inline tokens and
icons so they open anywhere. If tokens or icons change, regenerate the
inlined copies so mockups never drift from the source.

## Next

1. A tiny build step: generate `tokens.css` (and later a Rust/TS
   constants file) from `tokens.json`.
2. Finding severity colors (with spall M3), distinct from HTTP status.
3. Light theme? Only if someone asks. Dark is the product.
4. Publish as an npm package when a second tool consumes it.

## Provenance

Built with Claude Code, human-directed and reviewed.
