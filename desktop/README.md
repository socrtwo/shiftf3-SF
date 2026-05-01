# Shift+F3 Case Changer — desktop daemon

A small Python daemon that adds Shift+F3 case-cycling to **Windows,
macOS, and Linux**. It works on top of the system clipboard, so it
slots in alongside (or instead of) the AutoHotkey version on Windows.

## Cycle

`iNVERT cASE → lower case → UPPER CASE → Title Case → Sentence case`

## Run from source

```sh
python3 -m pip install -r desktop/requirements.txt
python3 -m desktop          # daemon stays in the foreground
```

`Ctrl+C` to stop.

### macOS permissions

macOS requires both **Accessibility** and **Input Monitoring** for any
process that captures global hotkeys. Open **System Settings →
Privacy & Security** and add Terminal (or the packaged `.app`) to both
lists. The first run will prompt you.

### Linux notes

`pynput` uses Xlib by default, which works on X11 sessions. On Wayland
sessions, global hotkeys are restricted by the compositor — use the
**browser extension** for in-browser cycling, or fall back to the **web
app**, which catches Shift+F3 inside its own window.

## Pre-built binaries

The release workflow uses **PyInstaller** to build a single-file
executable per platform and attaches them to the GitHub Release:

| Asset                           | Platform |
| ------------------------------- | -------- |
| `shiftf3-windows.exe`           | Windows 10/11 (x64) |
| `shiftf3-macos`                 | macOS 12+ (universal) |
| `shiftf3-linux`                 | Linux (x64) |

After downloading, mark the binary executable (`chmod +x`) on
macOS/Linux and run it directly.

## Build a binary locally

```sh
pip install pyinstaller pynput pyperclip
pyinstaller --onefile --name shiftf3 \
    --collect-submodules pynput \
    desktop/__main__.py
```

The result lands in `dist/shiftf3` (or `shiftf3.exe`).
