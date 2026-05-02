# Shift+F3 Case Changer — Windows

The Windows release ships in two flavors:

| File                              | Runtime                          | Notes |
| --------------------------------- | -------------------------------- | ----- |
| `shift-F3-case-changer.ahk`       | [AutoHotkey v2.0+](https://www.autohotkey.com/) | Modern v2 port, recommended. |
| `shift-F3-case-changer-0.52.ahk`  | AutoHotkey v1.1+                 | Original 2010 script, kept for compatibility. |

If you'd rather not install AutoHotkey at all, grab
**`shiftf3-py-windows-<version>.zip`** from the same release — that's a
standalone Python build (`shiftf3-py.exe`) with no runtime dependency.

## Run from source

1. Install [AutoHotkey v2](https://www.autohotkey.com/).
2. Double-click `shift-F3-case-changer.ahk`.
3. Look for the green **H** icon in your system tray.
4. Select text in any app and press **Shift+F3**.

## Build the standalone .exe locally

If you have AutoHotkey v2 installed, the simplest way is via the
shell extension:

1. Right-click `shift-F3-case-changer.ahk` in Explorer.
2. Select **Compile Script** (under *Show more options* on Windows 11).
3. The resulting `.exe` runs on any Windows machine without AutoHotkey
   installed.

Or from PowerShell:

```powershell
# Compiles to shift-F3-case-changer.exe in the current directory.
& "$env:ProgramFiles\AutoHotkey\Compiler\Ahk2Exe.exe" `
    /in  shift-F3-case-changer.ahk `
    /out shift-F3-case-changer.exe `
    /icon 32X32-shift-F3-case-changer-icon.ico
```

> **Note:** the GitHub Actions release workflow does *not* compile the
> `.exe` for you — `Ahk2Exe.exe` and the AHK v2 installer hang on
> hidden GUI dialogs in the non-interactive runner environment. The
> Windows zip ships only the source script. The Python build
> (`shiftf3-py-windows-*.zip`) is the no-install pre-built option.

## Cycle order

`iNVERT cASE → lower case → UPPER CASE → Title Case → Sentence case → …`

If you'd prefer the v1 behavior with no clipboard preservation (works
better in some apps like Excel), use
`shift-F3-case-changer-0.52-no-clipboard-preservation.ahk` from the
repo root.
