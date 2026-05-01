"""Cross-platform Shift+F3 case-cycling daemon.

Listens for the Shift+F3 hotkey on Windows, macOS, and Linux. When
pressed, copies the current selection to the clipboard, transforms the
text with the next case in the cycle, pastes it back, and re-selects
the result. The previous clipboard contents are restored afterwards.

Dependencies: ``pynput`` (global hotkey + paste keystroke) and
``pyperclip`` (clipboard read/write).
"""

from __future__ import annotations

import argparse
import logging
import platform
import sys
import time
from typing import Callable

if __package__:
    from . import case_engine
    from .case_engine import CYCLE
else:  # Allow running as a plain script: `python shift_f3.py`
    import os
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    import case_engine  # type: ignore[no-redef]
    from case_engine import CYCLE  # type: ignore[no-redef]

try:
    import pynput
    from pynput import keyboard
except ImportError as exc:  # pragma: no cover - import guard for users
    sys.stderr.write(
        "pynput is required. Install with: pip install -r requirements.txt\n"
    )
    raise SystemExit(1) from exc

try:
    import pyperclip
except ImportError as exc:  # pragma: no cover
    sys.stderr.write(
        "pyperclip is required. Install with: pip install -r requirements.txt\n"
    )
    raise SystemExit(1) from exc

LOG = logging.getLogger("shift_f3")


def _is_macos() -> bool:
    return platform.system() == "Darwin"


def _copy_modifier() -> keyboard.Key:
    return keyboard.Key.cmd if _is_macos() else keyboard.Key.ctrl


class HotkeyDaemon:
    def __init__(self, controller: keyboard.Controller | None = None) -> None:
        self.state = 0
        self.controller = controller or keyboard.Controller()
        self._busy = False

    def cycle(self) -> None:
        if self._busy:
            return
        self._busy = True
        try:
            self._cycle_once()
        finally:
            self._busy = False

    def _send(self, key: str) -> None:
        mod = _copy_modifier()
        self.controller.press(mod)
        self.controller.press(key)
        self.controller.release(key)
        self.controller.release(mod)

    def _cycle_once(self) -> None:
        original_clip = ""
        try:
            original_clip = pyperclip.paste()
        except Exception as exc:  # pragma: no cover - depends on system
            LOG.debug("clipboard read failed: %s", exc)

        # Try to copy the current selection.
        self._send("c")
        time.sleep(0.08)
        try:
            selected = pyperclip.paste()
        except Exception as exc:  # pragma: no cover
            LOG.warning("clipboard read failed after copy: %s", exc)
            return

        if not selected or selected == original_clip:
            # Nothing was selected (or copying didn't work). Bail out.
            LOG.debug("no selection captured; aborting")
            self._restore(original_clip)
            return

        name = CYCLE[self.state]
        transformed = case_engine.apply(name, selected)
        self.state = (self.state + 1) % len(CYCLE)
        LOG.info("Shift+F3 → %s (%d chars)", name, len(transformed))

        try:
            pyperclip.copy(transformed)
        except Exception as exc:  # pragma: no cover
            LOG.warning("clipboard write failed: %s", exc)
            self._restore(original_clip)
            return

        time.sleep(0.04)
        self._send("v")
        time.sleep(0.08)

        # Re-select the pasted text (Shift+Left × len) for chaining presses.
        for _ in range(len(transformed)):
            self.controller.press(keyboard.Key.shift)
            self.controller.press(keyboard.Key.left)
            self.controller.release(keyboard.Key.left)
            self.controller.release(keyboard.Key.shift)

        time.sleep(0.04)
        self._restore(original_clip)

    @staticmethod
    def _restore(value: str) -> None:
        try:
            pyperclip.copy(value or "")
        except Exception as exc:  # pragma: no cover
            LOG.debug("clipboard restore failed: %s", exc)


def run(verbose: bool = False) -> int:
    logging.basicConfig(
        level=logging.DEBUG if verbose else logging.INFO,
        format="%(asctime)s %(levelname)s %(message)s",
    )

    daemon = HotkeyDaemon()
    LOG.info(
        "Shift+F3 case-cycler running on %s. Press Ctrl+C to stop.",
        platform.system(),
    )
    if _is_macos():
        LOG.info(
            "macOS: grant Accessibility + Input Monitoring permissions to "
            "your terminal (or to the packaged binary) in System Settings."
        )

    hotkey = keyboard.GlobalHotKeys({"<shift>+<f3>": daemon.cycle})
    try:
        hotkey.start()
        hotkey.join()
    except KeyboardInterrupt:
        LOG.info("Stopped.")
        return 0
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        prog="shift-f3",
        description="Cycle the case of selected text with Shift+F3.",
    )
    parser.add_argument(
        "--verbose", "-v", action="store_true", help="Log every transform."
    )
    args = parser.parse_args(argv)
    return run(verbose=args.verbose)


if __name__ == "__main__":  # pragma: no cover
    raise SystemExit(main())
