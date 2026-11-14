---
description: Install Jellyfin, Speedtest by Ookla and FX File Explorer on the TV box from the Play Store, one at a time, with my approval before each
---

Install three apps on my TV box, one at a time, with my approval before each one. Follow the rules in CLAUDE.md.

Box: 192.168.8.149:5555. ADB: C:\Users\admin\platform-tools\adb.exe
Use `adb -s 192.168.8.149:5555 ...` for every command after the connect.

FIRST
1. Connect (`adb connect 192.168.8.149:5555`, `adb devices`) and confirm it shows `device`. If not, follow the reconnect steps in CLAUDE.md and stop if it still fails.
2. Run `adb shell pm list packages -3` and keep the full list as the "before" list. Skip any app below that is already installed (match Jellyfin by the exact package name; for the other two, see the notes).
3. Take a screenshot. If the TV shows the YouTube account picker, a Google sign-in or any other prompt, stop and tell me what to do on the TV.

APPS, IN THIS ORDER (expected developer in brackets)
1. Jellyfin for Android TV (developer: Jellyfin), package org.jellyfin.androidtv
2. Speedtest by Ookla (developer: Ookla). Package not known in advance.
3. FX File Explorer (developer: NextApp, Inc.). Package not known in advance. It may not be offered for TV boxes; if so, say that and skip it.

FOR EACH APP
1. Tell me the app name and what it is for, and ask "Install this one?" Wait for my yes before doing anything. A yes for one app is not a yes for the next.
2. If I say yes, open the Play Store page. For Jellyfin use:
   `adb shell am start -a android.intent.action.VIEW -d "market://details?id=org.jellyfin.androidtv"`
   For the other two, search by name instead:
   `adb shell am start -a android.intent.action.VIEW -d "market://search?q=<app name>"`
3. Take a screenshot and check the app name and developer match the list above. For a search, pick the matching result with DPAD keys and check again. If it does not match, or the app is not available for this box, or it needs a paid plan, stop, tell me, and skip it. Do not install anything else.
4. Press Install with key presses (KEYCODE_DPAD_CENTER, moving with DPAD keys as needed), taking a screenshot after each step.
5. When the install finishes, run `adb shell pm list packages -3` again and compare with the "before" list. Tell me the new package name you found. If more than one package is new, or none, stop and tell me instead of guessing.
6. Report "installed", "failed" or "skipped" in one line, then go to the next app.

RULES
- Play Store only. No APK sideloading, no other apps, no system settings changes.
- If a sign-in, permission prompt or anything else needs me, stop and tell me what to do on the TV. Never enter credentials or payment details.
- If the screen is stuck or a screenshot is black, tell me and stop. Do not retry in a loop.
- Describe only what is visible in the screenshots. Do not invent details.

FINISH
Show a table: app, developer verified (yes/no), installed or skipped, package name. Then add the new package names to CLAUDE.md under the apps list (only the ones actually installed, with the versions from `dumpsys package <package> | findstr versionName`) and tell me exactly what you changed.
