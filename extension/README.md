# Shift+F3 Case Changer — browser extension

A Manifest V3 extension for Chromium-based browsers (Chrome, Edge,
Brave, Vivaldi, Opera) and Firefox. Adds Word-style **Shift+F3** case
cycling to every editable field on every page.

## Cycle

`iNVERT cASE` → `lower case` → `UPPER CASE` → `Title Case` → `Sentence case`
→ back to the start.

## Install (unpacked, for development)

1. Download or clone this repository, or grab `extension.zip` from a
   [GitHub release](https://github.com/socrtwo/shiftf3-SF/releases).
2. Open `chrome://extensions` (or `edge://extensions`).
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select the `extension/` folder.
5. Focus any text field and press **Shift+F3**.

On Firefox, use `about:debugging#/runtime/this-firefox` → **Load
Temporary Add-on** and select `extension/manifest.json`.

## How it works

* `content.js` listens for **Shift+F3** in `<input>`, `<textarea>`, and
  any `contentEditable` region and applies the next case in the cycle.
* `background.js` registers a Chrome command for **Shift+F3** so the
  combo still works on pages that capture the keystroke first.
* `popup.html` lets you apply a one-shot transform to the focused field
  if you'd rather not memorise the cycle order.

## Build a release zip

```sh
zip -r extension.zip extension -x "extension/README.md"
```

Or run the `release` GitHub Actions workflow, which builds it for you.
