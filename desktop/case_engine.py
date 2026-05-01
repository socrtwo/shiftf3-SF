"""Pure-Python implementation of the Shift+F3 case cycle.

Mirrors the JS engine in ``web/case-engine.js`` and the AHK behavior so
the desktop daemon, the browser extension, and the web app all produce
the same output for a given input.
"""

from __future__ import annotations

import re

CYCLE = ("invert", "lower", "upper", "title", "sentence")

_SMALL_WORDS = {
    "a", "an", "and", "as", "at", "but", "by", "for", "if", "in",
    "nor", "of", "on", "or", "so", "the", "to", "up", "yet", "via",
}
_KEEP_VERBATIM = {"i": "I", "ahk": "AHK", "autohotkey": "AutoHotkey"}


def invert(s: str) -> str:
    return "".join(
        c.upper() if c.islower() else c.lower() if c.isupper() else c
        for c in s
    )


def lower(s: str) -> str:
    return s.lower()


def upper(s: str) -> str:
    return s.upper()


_WORD_RE = re.compile(r"\S+")
_LETTER_RE = re.compile(r"[a-zà-ÿ]", re.IGNORECASE)


def title(s: str) -> str:
    def repl(match: re.Match[str]) -> str:
        word = match.group(0)
        offset = match.start()
        lc = word.lower()
        stripped = re.sub(r"[^a-z']", "", lc, flags=re.IGNORECASE)
        before = s[:offset]
        at_start = offset == 0 or bool(re.search(r"[\.\!\?]\s*$", before))
        if not at_start and stripped in _SMALL_WORDS:
            piece = lc
        else:
            piece = _LETTER_RE.sub(lambda m: m.group(0).upper(), lc, count=1)
        if stripped in _KEEP_VERBATIM:
            piece = re.sub(
                rf"\b{re.escape(stripped)}\b",
                _KEEP_VERBATIM[stripped],
                piece,
                flags=re.IGNORECASE,
            )
        return piece

    return _WORD_RE.sub(repl, s)


_SENTENCE_RE = re.compile(r"(^|[\.\!\?]\s+|[\r\n]+)(\S)")


def sentence(s: str) -> str:
    lc = s.lower()
    return _SENTENCE_RE.sub(lambda m: m.group(1) + m.group(2).upper(), lc)


_TRANSFORMS = {
    "invert": invert,
    "lower": lower,
    "upper": upper,
    "title": title,
    "sentence": sentence,
}


def apply(name: str, text: str) -> str:
    return _TRANSFORMS[name](text)


def next_state(text: str, state: int) -> tuple[str, str, int]:
    """Apply ``CYCLE[state]`` to ``text`` and return ``(text, name, next)``."""
    name = CYCLE[state]
    return apply(name, text), name, (state + 1) % len(CYCLE)
