#!/usr/bin/env python3
"""Build self-contained mockups from mockups/src/*.html.

Replaces /*TOKENS*/ with tokens/tokens.css and /*ICON:name*/ with the inlined
icons/name.svg, writing mockups/<name>.html. Run after build/tokens.py.
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent


def inline_icon(m: re.Match) -> str:
    svg = (ROOT / "icons" / f"{m.group(1)}.svg").read_text().strip()
    svg = re.sub(r"<title>.*?</title>", "", svg)
    return svg.replace('width="24" height="24"', 'width="22" height="22" aria-hidden="true"')


def main() -> None:
    tokens = (ROOT / "tokens" / "tokens.css").read_text()
    for src in sorted((ROOT / "mockups" / "src").glob("*.html")):
        html = src.read_text().replace("/*TOKENS*/", tokens)
        html = re.sub(r"/\*ICON:(\w+)\*/", inline_icon, html)
        out = ROOT / "mockups" / src.name
        out.write_text(html)
        print(f"wrote {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
