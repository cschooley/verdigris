#!/usr/bin/env python3
"""Build self-contained mockups from mockups/src/*.html.

Markers, resolved in this order:
  <!--PARTIAL:name-->  or  /*PARTIAL:name*/   -> mockups/src/partials/<name>
  /*TOKENS*/                                  -> tokens/tokens.css
  /*ICON:name*/  or  /*ICON:views/name*/      -> icons/<name>.svg, inlined

Partials may contain TOKENS and ICON markers (and other partials).
Output: mockups/<page>.html. Run after build/tokens.py.
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "mockups" / "src"
PARTIAL = re.compile(r"<!--PARTIAL:([\w.-]+)-->|/\*PARTIAL:([\w.-]+)\*/")


def expand_partials(text: str, depth: int = 0) -> str:
    if depth > 5:
        raise RuntimeError("partials nested too deep (cycle?)")

    def sub(m: re.Match) -> str:
        name = m.group(1) or m.group(2)
        return expand_partials((SRC / "partials" / name).read_text(), depth + 1)

    return PARTIAL.sub(sub, text)


def inline_icon(m: re.Match) -> str:
    svg = (ROOT / "icons" / f"{m.group(1)}.svg").read_text().strip()
    svg = re.sub(r"<title>.*?</title>", "", svg)
    return svg.replace('width="24" height="24"', 'width="22" height="22" aria-hidden="true"')


def main() -> None:
    tokens = (ROOT / "tokens" / "tokens.css").read_text()
    for src in sorted(SRC.glob("*.html")):
        html = expand_partials(src.read_text())
        html = html.replace("/*TOKENS*/", tokens)
        html = re.sub(r"/\*ICON:([\w/]+)\*/", inline_icon, html)
        leftover = re.findall(r"/\*(?:TOKENS|ICON:[\w/]+|PARTIAL:[\w.-]+)\*/|<!--PARTIAL:[\w.-]+-->", html)
        if leftover:
            raise RuntimeError(f"{src.name}: unresolved markers {leftover}")
        out = ROOT / "mockups" / src.name
        out.write_text(html)
        print(f"wrote {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
