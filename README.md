# verdigris

The design system for the cschooley security toolkit: spall, Kudzu, scurf, taphttp, flux.

Rust-dark, verdigris-live. Built for eight-hour sessions and for looking like you know exactly what you're doing.

- [`GUIDE.md`](GUIDE.md): principles, color roles, type, density, icon rules
- [`tokens/`](tokens/): design tokens (`tokens.json` is the source of truth, `tokens.css` for direct use)
- [`icons/`](icons/): one SVG per tool, 24px grid, `currentColor`
- [`mockups/spall-console.html`](mockups/spall-console.html): reference mockup of the spall traffic console (self-contained, open in a browser)

## Using it

Until there's a package, copy `tokens/tokens.css` into your tool and use the `--vg-*` variables. Never hard-code a hex value that exists as a token.

## License

TBD. Intended: tokens and code under a permissive license (Apache-2.0, matching the suite), with the toolkit names and tool icons reserved as marks. Apache-2.0 does not grant trademark rights.

IBM Plex fonts are under the SIL Open Font License.

## Provenance

Built with Claude Code, human-directed and reviewed.
