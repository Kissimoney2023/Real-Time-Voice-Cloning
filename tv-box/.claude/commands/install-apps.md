---
description: Install TV Bro, VLC, Send Files to TV and Downloader on the TV box from the Play Store, one at a time, with my approval before each
---

Install a few apps on my TV box, one at a time, with my approval before each one. Follow the rules in CLAUDE.md.

Box: 192.168.8.149:5555 (Xiaomi TV Box S, Google TV). ADB: C:\Users\admin\platform-tools\adb.exe
Use `adb -s 192.168.8.149:5555 ...` for every command after the connect.

FIRST
1. Run `adb connect 192.168.8.149:5555` and `adb devices`. Confirm it shows `device`. If not, follow the reconnect steps in CLAUDE.md and stop if it still fails.
2. Run `adb shell pm list packages -3`. Match each package name below EXACTLY (for example search for `org.videolan.vlc`, not just "vlc"). Tell me which apps are already installed, and skip those.
3. Take a screenshot. If the TV shows the YouTube account picker, a Google sign-in, or any other prompt that needs me, stop and tell me what to do on the TV.

APPS, IN THIS ORDER
1. TV Bro (web browser, needed for my menu board), package com.phlox.tvwebbrowser
2. VLC (media player), package org.videolan.vlc
3. Send Files to TV (move files from my phone or PC), package com.yablio.sendfilestotv
4. Downloader (fetch files by URL), package com.esaba.downloader

FOR EACH APP
1. Tell me the app name and what it is for, and ask "Install this one?" Wait for my yes. Do not move on or install anything without it. A yes for one app is not a yes for the next.
2. If I say yes, open its Play Store page:
   `adb shell am start -a android.intent.action.VIEW -d "market://details?id=<package>"`
3. Take a screenshot and check it is the right app (correct name and developer). If it is not, or the page says it is not found, not compatible with this device, or needs a paid plan, stop and tell me instead of installing, and skip the app.
4. Press the Install button with key presses (KEYCODE_DPAD_CENTER, moving with DPAD keys as needed). Take a screenshot after each step to check it worked.
5. Wait for the install to finish, then verify with `adb shell pm list packages | findstr <package>`.
6. Report "installed" or "failed" in one line, then ask about the next app.

RULES
- Play Store only. Do not sideload any APK, do not touch any app other than the four listed, and do not change any system settings.
- If the screen is stuck or a screenshot is black, tell me and stop. Do not retry in a loop.
- If a Google sign-in, payment or other prompt appears that needs me, stop and tell me what to do on the TV. Never enter credentials or payment details.
- Describe only what is visible in the screenshots. Do not invent details.

FINISH
Give me a short table: app, installed or skipped, and the next step for my menu board (open the board in TV Bro). Then update the Status section of CLAUDE.md with what is now installed.
