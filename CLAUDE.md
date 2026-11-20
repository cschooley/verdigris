# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

verdigris is the design system for the cschooley security toolkit.
Tools consume it; it knows nothing about any tool's internals.

`GUIDE.md` is the source of truth for design decisions. `tokens/tokens.json`
is the source of truth for values.

**Generated files. Never edit by hand:**
- `tokens/tokens.css`: run `python3 build/tokens.py` (checks contrast first,
  refuses to write on failure; `--check` for CI).
- `mockups/*.html`: edit `mockups/src/*.html`, then run
  `python3 build/mockups.py`. Templates use `/*TOKENS*/` and
  `/*ICON:name*/` markers.

After any token or icon change: `python3 build/tokens.py && python3 build/mockups.py`.

## Rules

- **Verdigris means live.** `--vg-accent-verdigris` is for live / active /
  connected states only. Never decorative, never links, never "success".
- **No pure black.** Backgrounds come from `--vg-bg-*`.
- **Color is information.** Don't add a color without a role in GUIDE.md.
- **Contrast is checked, not eyeballed.** `build/tokens.py` enforces
  4.5:1 for every text token on `bg-base` and `bg-surface` in every
  theme. Paste its PASS summary in the commit message.
- **Four themes, one set of roles.** rust (default), rust-light, blued,
  blued-light. A new token must get a value in every theme.
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

`mockups/` holds self-contained HTML references (tokens and icons
inlined so they open anywhere). Built from `mockups/src/`. Append
`?theme=blued-light` etc. to load a specific theme.

## Next

1. Emit a Rust/TS constants file from `tokens.json` alongside the CSS.
2. Finding severity colors (with spall M3), distinct from HTTP status.
3. CI: run `build/tokens.py --check` and verify generated files are
   up to date.
4. Publish as an npm package when a second tool consumes it.

## Provenance

Built with Claude Code, human-directed and reviewed.
