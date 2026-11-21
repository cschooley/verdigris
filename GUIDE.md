# verdigris: design guide

The design system for the cschooley security toolkit (spall, Kudzu, scurf, taphttp, flux, sarifview).

## The feeling

Gear you want to carry. The Elektron box, the good knife. Software that makes the person using it look like they know exactly what they're doing, and that you can stare at for eight hours without a headache.

Two halves, both required:

- **Easy on the eyes.** Long sessions, low fatigue.
- **Desirable.** Precise, confident, fast. A professional instrument, not a dashboard.

## Principles

1. **Dark, warm, not black.** Backgrounds are oxidized iron (`--vg-bg-base`), never `#000`. Neutrals are rust-tinted, never cold blue-grey.
2. **Quiet structure, loud data.** Borders and chrome sit near the background. Full-brightness text is reserved for content: URLs, codes, values.
3. **Color is information.** Most of the screen is neutral. A color appears only when it means something, and it means the same thing in every tool.
4. **One signature.** Verdigris (`--vg-accent-verdigris`) means *live / active / connected* and nothing else. The pulsing verdigris dot on a live stream is the identity of the suite. Never use it for decoration, links, or success states.
5. **Precision you can feel.** Monospace for data, tabular figures, 1px rules, strict 4px-based spacing, 2px radii. Hardware edges, not bubbles.
6. **Speed is a feature.** Streams over spinners. Keyboard first. Nothing animates longer than `--vg-motion-base` except the live pulse.
7. **Terse copy.** No exclamation points, no cheerful empty states, no "Oops!". Say what is true and what to do: `No traffic. Point a client at 127.0.0.1:8080.`
8. **Hardware metaphors, lightly.** Status LEDs, a level meter for request rate. A nod to gear, not a skeuomorphic toy.

## Themes

Two metals, each in dark and light. Same roles, same meanings, different alloy.

| Theme | `data-theme` | Feel |
|---|---|---|
| **Rust** (default) | none, or `rust` | Warm. Oxidized iron. |
| Rust Light | `rust-light` | Warm paper, iron ink. |
| **Blued** | `blued` | Cool. Gun-blued steel. |
| Blued Light | `blued-light` | Cool paper, steel ink. |

Set the attribute on `<html>`. Rules that hold in every theme:

- **Rust stays the brand.** `--vg-accent-rust` is the identity color in all four themes, including Blued (orange on steel is the complementary pairing).
- **Verdigris stays live-only.** Light themes use a darker verdigris for contrast; the meaning doesn't change.
- **Status and method colors keep their hue family** across themes, darkened for light backgrounds, so a 4xx is always amber.
- **Dark is the default.** Light themes exist for bright rooms and screenshots in docs, not as the primary experience.

## Color roles

| Role | Token | Use |
|---|---|---|
| Live / active | `--vg-accent-verdigris` | Live stream dot, connected tool LED, active capture |
| Brand / action / focus | `--vg-accent-rust` | Primary button, focus ring, wordmark |
| Needs your action | `--vg-accent-rust` | Approval requests, triage badges, candidate state |
| Stop / halted | `--vg-control-stop` | Agent e-stop and halted state ONLY. Not for errors or 5xx |
| Boost / quad | `--vg-boost`, `--vg-boost-glow` | A time-boxed burst mode is active (quad). Screen-edge glow, countdown chip, meter. Nothing else |
| HTTP status class | `--vg-status-*` | Status code text in traffic views |
| HTTP method | `--vg-method-*` | Method label (808-style category color) |
| Severity | TBD (spall M3) | Do not reuse status colors |

Attribution uses glyphs, not color: `◆ agent`, `● you`, `◇ scurf`. Every agent-originated exchange, candidate and message carries the ◆.

Color-blind safety: never rely on color alone. Status codes are always shown as numbers; methods always as text. Color reinforces, it does not replace.

## Type

- **IBM Plex Mono** for all data (SIL Open Font License, bundle freely).
- **IBM Plex Sans** for UI chrome and prose.
- Default size for dense views is 13px. Use `font-variant-numeric: tabular-nums` anywhere numbers line up.

## Density

Default table row height is 26px (`--vg-row-dense`). These are expert tools; density is respect, not clutter. Offer `relaxed` (32px) as a user setting, not the default.

## Contrast

All text tokens meet WCAG AA (4.5:1) on `bg-base` and `bg-surface` in every theme. This is enforced: `build/tokens.py` refuses to write `tokens.css` if any required pair fails. On `bg-raised` a few tokens dip just under 4.5 (reported as `(low)`); don't use `text-tertiary` or `status-none` for body text on raised surfaces.

## The console

Every suite app gets the same drop-down console, Quake-style.

- **Toggle:** the backtick key (`` ` ``; `~` also works). Configurable, because backtick is a dead key on many non-US layouts. Never opens while typing in an input. `Esc` or backtick closes it.
- **Look:** drops from under the top bar to ~42% of the viewport, `bg-sunken` with faint scanlines, `]` prompt in rust, monospace throughout. Opaque: the page behind must not bleed through.
- **Behavior:** command history (↑/↓), tab completion, scrollback. System events land here too (agent messages, late OOB callbacks, warnings).
- **Output is text only.** Console lines are never rendered as HTML.
- **One command registry.** The console, the ⌘K palette and the MCP server expose the same commands with the same names and arguments.
- Respects reduced motion: no slide, just appears.

Aesthetic nods to Quake are welcome (the drop-down, the `]` prompt, a little grit). id Software's fonts, textures, logos and sounds are not.

## Icons

See `icons/`. Rules:

- 24px grid, 1.75px stroke, round caps and joins, `currentColor` stroke.
- One simple geometric idea per tool, drawn from the corrosion theme.
- At most one accent element per icon, using `var(--vg-icon-accent, currentColor)`.
- Each tool serves its own icon from its suite manifest; Kudzu bundles nothing.

| Tool | Glyph idea |
|---|---|
| spall | A block with a chip breaking off the corner |
| scurf | Flakes lifting off a surface |
| taphttp | A pipe junction with a tap point |
| flux | Converging flow lines |
| kudzu | A vine curl with a leaf |
| verdigris | A patina drop |

## Borrowed, credited

Structure (token roles, spacing logic, dense-table patterns) is informed by IBM's Carbon Design System (Apache 2.0). No Carbon code or IBM branding is used. Personality inspired by Elektron (density, restraint), the Roland TR-808 (color as category), and Teenage Engineering (geometric icon families). Principles only, no copied designs.
