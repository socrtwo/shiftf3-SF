# iOS Shortcut — Shift+F3 Case Cycle

Add a system-wide share-sheet action that opens selected text in the
Shift+F3 case-cycler PWA, pre-filled and ready to transform.

## Build it in 30 seconds

1. Open the **Shortcuts** app on iPhone / iPad.
2. Tap **+** (top right) → **New Shortcut**.
3. **Add Action → Receive input from Share Sheet**:
   - Accepts: **Text**
4. **Add Action → Open URLs**:
   - URL: `https://socrtwo.github.io/shiftf3-SF/?text=` followed by
     the **URL-Encoded Text** of the *Shortcut Input*. Use the
     **URL Encode** action between *Shortcut Input* and *Open URLs* to
     get the encoded value.
5. Rename the shortcut to **Shift+F3 Case Cycle**.
6. Tap **(i)** at the bottom → **Show in Share Sheet** ✅.

You can now select any text in any iOS app, tap **Share →
Shift+F3 Case Cycle**, and the PWA will open with that text loaded.
Pressing the case buttons (or a Bluetooth keyboard's **Shift+F3**)
cycles it.

## Why a Shortcut instead of a native app?

iOS does not let third-party apps intercept hardware Shift+F3 system-
wide. A Shortcut + the PWA gets you the same effect (one-tap from any
share sheet, Shift+F3 working inside the app on iPad with a hardware
keyboard) with zero install friction.
