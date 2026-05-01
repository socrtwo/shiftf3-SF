<!--MODERNIZED:v2-->
# Shift+F3 Case Changer

> Cycle selected text through five cases — anywhere, on any device.

[![Live page](https://img.shields.io/badge/live-pwa-ff2e93?style=for-the-badge)](https://socrtwo.github.io/shiftf3-SF/)
[![Releases](https://img.shields.io/github/v/release/socrtwo/shiftf3-SF?style=for-the-badge&color=7c3aed)](https://github.com/socrtwo/shiftf3-SF/releases)
[![License](https://img.shields.io/github/license/socrtwo/shiftf3-SF?style=for-the-badge&color=22d3ee)](LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/socrtwo/shiftf3-SF/build.yml?style=for-the-badge&label=ci&color=34d399)](https://github.com/socrtwo/shiftf3-SF/actions)

The original 2010 AutoHotkey script that adds Word-style **Shift+F3**
case-cycling to every Windows app — now reborn as a multi-platform
project: a desktop daemon for Windows / macOS / Linux, a browser
extension for ChromeOS and any Chromium browser, and a PWA installable
on Android, iOS, and the web.

The cycle is:

> `iNVERT cASE` → `lower case` → `UPPER CASE` → `Title Case` → `Sentence case` → …

The selection is replaced and re-selected so successive **Shift+F3**
presses keep advancing the cycle.

![demo](case-change-animation.gif)

---

## Installation

| Platform   | What you get                                | How to install |
| ---------- | ------------------------------------------- | -------------- |
| **Windows**  | `.exe` (no AHK needed) **or** AHK v2 / v1 script | [windows/README.md](windows/README.md) |
| **macOS**    | Single-file binary, global Shift+F3 hotkey  | [desktop/README.md](desktop/README.md) |
| **Linux**    | Single-file binary, global Shift+F3 hotkey  | [desktop/README.md](desktop/README.md) |
| **ChromeOS** | Browser extension + PWA                     | [extension/README.md](extension/README.md) |
| **Android**  | Installable PWA (+ optional Tasker recipe)  | [mobile/README.md](mobile/README.md) |
| **iOS**      | Installable PWA (+ optional Shortcut)       | [mobile/ios-shortcut.md](mobile/ios-shortcut.md) |
| **Web**      | Hosted PWA at the live page                 | [https://socrtwo.github.io/shiftf3-SF/](https://socrtwo.github.io/shiftf3-SF/) |

Pre-built binaries for every platform are attached to each
[GitHub Release](https://github.com/socrtwo/shiftf3-SF/releases). The
release workflow (`.github/workflows/release.yml`) rebuilds all
artifacts whenever a `v*` tag is pushed.

## Project layout

```
.
├── web/             ← PWA (web release; covers Web/Android/iOS/ChromeOS)
├── extension/       ← Manifest V3 browser extension (Chrome/Edge/Brave/Firefox)
├── windows/         ← Modernized AutoHotkey v2 script + standalone .exe build
├── desktop/         ← Cross-platform Python daemon (Windows/macOS/Linux)
├── mobile/          ← iOS Shortcut & Android Tasker recipe
├── scripts/         ← Build helpers (icon generation, etc.)
├── shift-F3-case-changer-0.52.ahk            ← Original 2010 AHK v1 script
└── shift-F3-case-changer-0.52-no-clipboard-preservation.ahk
```

A single shared **case engine** lives in three mirrored copies — JS for
the PWA (`web/case-engine.js`), JS for the extension content script
(`extension/case-engine.js`), and Python for the desktop daemon
(`desktop/case_engine.py`) — all producing identical output.

## How it works

* **Web/PWA** — pure HTML+CSS+JS, registers a service worker for
  offline use and a Web Share Target so other apps' share sheets can
  hand text to it.
* **Browser extension** — MV3 content script intercepts **Shift+F3**
  in any input, textarea, or contentEditable region; a service worker
  forwards the matching keyboard command for pages that swallow the
  keystroke.
* **Desktop daemon** — uses `pynput` to register a global hotkey and
  `pyperclip` to read/write the system clipboard; mimics the original
  AHK behavior of saving and restoring the previous clipboard content.
* **Windows AHK** — original v1 script preserved, plus a clean v2 port
  in `windows/`. The release workflow compiles the v2 script to a
  standalone `.exe` so users don't need AutoHotkey installed.

## Development

```sh
# Run the desktop daemon from source
pip install -r desktop/requirements.txt
python -m desktop -v

# Smoke-test the case engine
python -m desktop.test_case_engine

# Serve the PWA locally
python -m http.server -d web 8080
# → http://localhost:8080/

# Regenerate icons (PWA + extension) from artwork
python scripts/make_icons.py
```

CI runs the engine tests and JS syntax checks on every push (see
`.github/workflows/build.yml`).

## Release

Push a `v*` tag — the **Release multi-platform builds** workflow
compiles `.exe`, builds PyInstaller binaries for Windows / macOS /
Linux, zips the extension and the PWA, and uploads everything to a
GitHub Release. Or run the workflow manually from the Actions tab.

## Origin

This project was originally hosted on SourceForge as a single
AutoHotkey script. The legacy entry, if still available, lives at
<https://sourceforge.net/projects/shiftf3/>. The repository at
`socrtwo/shiftf3-SF` is the canonical, actively-maintained home — all
issue tracking and releases happen here.

* **Migrated with:** [SF2GH Migrator](https://github.com/socrtwo/sf-to-github)
* **Original Windows author:** Paul D Pruitt (socrtwo), with code
  from "None" and "Lazslo" of the AutoHotkey forum.

## Contributing

Issues and pull requests are welcome — see the
[issues page](https://github.com/socrtwo/shiftf3-SF/issues). New
platform builds (e.g. a real Android APK if accessibility-based
hotkeys ever land) should reuse the shared case engine so behavior
stays consistent.

## License

[MIT](LICENSE) — original SourceForge upload was distributed under
GPL-2.0 (`gpl-2.0.txt` is preserved for historical reference).

---

*Maintained by [@socrtwo](https://github.com/socrtwo).*
