# Shift+F3 Case Changer — Android & iOS

Mobile platforms don't permit a third-party app to grab a Shift+F3
keystroke globally. Instead, the mobile release ships **two**
ergonomic ways to use the same case engine:

1. **Install the PWA** — a full-featured case-cycling app that lives on
   your home screen and works offline.
2. **Use the share-sheet recipe** for the platform — a one-tap action
   that takes selected text and returns the cycled version.

Both options share the exact same transform logic as the desktop
release.

---

## Install the PWA

The same web build at <https://socrtwo.github.io/shiftf3-SF/> is an
installable Progressive Web App. It registers as a Web Share Target,
so any app's share sheet can hand text to it.

### iPhone / iPad (iOS 16.4+)

1. Open <https://socrtwo.github.io/shiftf3-SF/> in **Safari**.
2. Tap the share button → **Add to Home Screen**.
3. Launch *Shift+F3* from the home screen.
4. Paste or type, then tap a case button to transform.

### Android

1. Open the link in **Chrome** or **Edge**.
2. Tap the address-bar menu → **Install app** (or **Add to Home Screen**).
3. The app behaves like a native app and appears as a share target
   when you hit **Share → Shift+F3** in any other app.

### ChromeOS

The same install flow as Android in Chrome — installs as an SWA
(System Web App) and is launchable from the Launcher.

---

## iOS Shortcut

`shiftf3.shortcut` (in this folder) is an Apple Shortcuts file that
exposes the cycle inside the iOS share sheet. Tap a piece of selected
text, choose **Share → Shift+F3 Case Cycle**, and pick the case to
apply. The shortcut returns the transformed text and copies it to the
clipboard.

Install:

1. Download `shiftf3.shortcut` to your iPhone / iPad.
2. Open it; iOS will offer to add it to your Shortcuts library.
3. Run from anywhere via Share Sheet → **Shift+F3 Case Cycle**.

The shortcut is a thin wrapper around the public API of the PWA — it
opens the PWA URL with a `?text=` parameter so the converter loads with
the shared text pre-filled.

---

## Android share intent

Any Android browser supporting installable PWAs registers the app as a
share target automatically (see `web/manifest.webmanifest` →
`share_target`). After installing, you'll see **Shift+F3** in the
system share sheet anywhere text can be shared.

For **Tasker** users, `tasker-recipe.md` documents an equivalent
profile that takes the clipboard contents, runs the cycle, and writes
back to the clipboard without leaving the source app. It uses the same
case engine via a tiny WebView snippet so the behavior matches the
desktop and web builds bit-for-bit.

---

## Why no native app?

The original Shift+F3 trick relies on system-wide keyboard hooks. iOS
and Android both deny that capability to non-system processes, so a
"native" build wouldn't be more functional than the PWA — it would just
be heavier. The PWA, packaged via the standard install flow, is the
canonical mobile release. If a future Android version exposes
accessibility-based hotkeys to apps, a native APK can be added without
changing the case engine.
