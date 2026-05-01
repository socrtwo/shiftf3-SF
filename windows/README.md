# Shift+F3 Case Changer — Windows

The Windows release ships in three forms:

| File                              | Runtime                          | Notes |
| --------------------------------- | -------------------------------- | ----- |
| `shift-F3-case-changer.ahk`       | [AutoHotkey v2.0+](https://www.autohotkey.com/) | Modern v2 port, recommended. |
| `shift-F3-case-changer-0.52.ahk`  | AutoHotkey v1.1+                 | Original 2010 script, kept for compatibility. Lives in the repo root. |
| `shift-F3-case-changer.exe`       | None — standalone executable     | Compiled by the GitHub Actions release workflow. |

## Run from source

1. Install [AutoHotkey v2](https://www.autohotkey.com/).
2. Double-click `shift-F3-case-changer.ahk`.
3. Look for the green **H** icon in your system tray.
4. Select text in any app and press **Shift+F3**.

## Build the standalone .exe locally

If you have AutoHotkey v2 installed:

```powershell
# Compiles to shift-F3-case-changer.exe in the current directory.
& "$env:ProgramFiles\AutoHotkey\v2\Compiler\Ahk2Exe.exe" `
    /in  shift-F3-case-changer.ahk `
    /out shift-F3-case-changer.exe `
    /icon ..\32X32-shift-F3-case-changer-icon.ico
```

The release workflow does the same thing on every tagged release and
attaches `shift-F3-case-changer.exe` to the GitHub Release.

## Cycle order

`iNVERT cASE → lower case → UPPER CASE → Title Case → Sentence case → …`

If you'd prefer the v1 behavior with no clipboard preservation (works
better in some apps like Excel), use
`shift-F3-case-changer-0.52-no-clipboard-preservation.ahk` from the
repo root.
