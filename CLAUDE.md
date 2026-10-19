# CLAUDE.md

Adds Word-style **Shift+F3** case-cycling to every app on every device.
The cycle: `iNVERT cASE` → `lower case` → `UPPER CASE` → `Title Case` →
`Sentence case` → … Originally a 2010 AutoHotkey script, now a
multi-platform project with **four distinct implementations** that must
stay in cycle-sync. Be careful which one you're editing.

## Repo map

- `desktop/` — Python desktop daemon (Windows / macOS / Linux), built
  with PyInstaller. Provides the global hotkey when AHK isn't available.
- `extension/` — Manifest V3 browser extension (Chrome / Edge / Brave /
  Vivaldi / ChromeOS). Hooks Shift+F3 inside editable fields on web
  pages.
- `web/` — installable PWA (Web, Android, iOS, ChromeOS). Same source
  serves all four PWA targets.
- `mobile/` — mobile-specific docs: `README.md` for Android (Tasker
  recipe) and `ios-shortcut.md` for iOS.
- `windows/` — Windows-specific extras (and `README.md`).
- `shift-F3-case-changer-0.52.ahk` (+ `.ini` and the
  `no-clipboard-preservation` variant) — modernized AHK script.
- `CAPshift.ahk.ahk` — separate legacy AHK file (Caps Lock variant).
  Preserved for historical use.
- `scripts/` — release packaging helpers.
- `change-log.txt`, `case-change-animation.gif`, `*.ico` — docs / assets.
- `gpl-2.0.txt` — legacy GPL-2.0 license file (alongside `LICENSE`).
- `.github/workflows/` — `build.yml` (CI), `pages.yml` (deploy `web/` to
  Pages on push to `main`), `release.yml` (build per-platform bundles on
  `v*` tag).

## Branch policy

Work on the assigned feature branch:

1. Commit and push the feature branch.
2. **Open a PR from the feature branch to `main`** using the GitHub MCP
   tools (`mcp__github__create_pull_request`). Do not merge directly —
   the maintainer reviews and merges.
3. CI runs on the PR; Pages and Release pipelines fire from `main` only.

## Releasing

- Push a `v*` tag to `main` to produce: `shiftf3-windows-<v>.zip` (AHK),
  `shiftf3-py-windows-<v>.zip` (PyInstaller `.exe`),
  `shiftf3-macos-<v>.tar.gz`, `shiftf3-linux-<v>.tar.gz`,
  `shiftf3-extension-<v>.zip`, `shiftf3-web-<v>.zip`.

## Verifying changes

The case-cycle rules must produce identical output across all four
implementations. When you change the cycle in any one of them:

1. Manually verify in the changed implementation.
2. Confirm the cycle list matches in the others (AHK / Python /
   extension / PWA). They are hand-mirrored — there is no shared
   library.

Other checks:
- AHK: `Compile Script` in AutoHotkey v2 — AHK v1 syntax will fail.
- Python: `python -m shiftf3` (or whatever entry point lives in
  `desktop/`) and a manual Shift+F3 test in a text editor.
- Extension: load unpacked in Chrome, try Shift+F3 in a textarea.
- PWA: open the live page, paste text, click the button (no global
  hotkey from a PWA — that's expected).

## Gotchas

- Linux desktop daemon is **X11 only**. Wayland users use the extension.
  Don't add Wayland code without input from the maintainer; the layering
  is intentional.
- macOS desktop needs Accessibility + Input Monitoring permissions on
  first run. Don't add anything that prompts again on every launch.
- The "no-clipboard-preservation" AHK variant exists because clipboard
  preservation is flaky on some Windows configs. Keep both variants
  working when you touch the AHK code.
- ChromeOS uses the extension, not the PWA, for global-feeling Shift+F3.
  Don't tell ChromeOS users to install the PWA for hotkey functionality.
