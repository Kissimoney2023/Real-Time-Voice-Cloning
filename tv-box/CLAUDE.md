# TV Box Control Project

This folder controls my Xiaomi TV Box S (3rd Gen, Google TV) from this Windows PC over ADB. Read this file at the start of every session.

## About me

- I'm Saah. I'm a beginner at programming, so explain commands in plain language and keep steps short.
- I use the box to preview my YouTube channels and videos on a big screen, and later for a menu board and app testing.

## Device

- Box: Xiaomi TV Box S (3rd Gen), Google TV, 32GB, connected to a Sony TV by HDMI
- IP address: 192.168.8.149, ADB port 5555
- MAC address: c0:8b:27:90:e8:46
- Wi-Fi network: yalloHome_B818_65A6 (this PC must be on the same network)
- USB debugging is on, and this PC is already authorized on the box
- The IP can change after a restart unless it is reserved in the yallo router

## Tools and paths

- ADB: `C:\Users\admin\platform-tools\adb.exe` (may not be on PATH, so use the full path or `cd` into that folder and use `.\adb`)
- Project folder: `C:\Users\admin\tv-box`
- Control script: `tv.ps1` (extend it, never break existing commands)
- Channel list: `channels.json` (name, handle, notes; I can edit it)
- Screenshots: `C:\Users\admin\tv-box\screenshots\<date>\`
- Shell: Windows PowerShell

## Connect (do this at the start of a session)

1. `adb connect 192.168.8.149:5555`
2. `adb devices` and confirm `192.168.8.149:5555 device`
3. Send `KEYCODE_HOME` to confirm the box responds

If it shows `offline` or `unauthorized`, run `adb kill-server`, then `adb start-server`, then connect again. If it still fails, tell me to check the TV for the "Allow USB debugging?" prompt (tick "Always allow") and to confirm the box is on and on the same Wi-Fi. If the box restarted and the IP changed, ask me for the new IP (Settings, Network).

## My channels

- CreativeKingTV: https://www.youtube.com/@CreativeKingTV
- Kolokwa Soul: https://www.youtube.com/@KolokwaSoul
- Music video links: stored in `channels.json` (add with `tv add`)

## Useful commands

- Home: `adb shell input keyevent KEYCODE_HOME`
- Back: `KEYCODE_BACK`; Select: `KEYCODE_DPAD_CENTER`; Move: `KEYCODE_DPAD_UP/DOWN/LEFT/RIGHT`
- Play/pause: `KEYCODE_MEDIA_PLAY_PAUSE`; Volume: `KEYCODE_VOLUME_UP/DOWN/MUTE`
- Open a link in YouTube: `adb shell am start -a android.intent.action.VIEW -d "<url>"`
- Type text: `adb shell input text "word%sword"` (`%s` is a space)
- Screenshot: `adb exec-out screencap -p` (write the raw bytes to a PNG file, do not text-redirect)
- Info: `adb shell getprop ro.product.model`, `getprop ro.build.version.release`, `df -h /data`

## Rules

- Only run adb against `192.168.8.149:5555`.
- Key presses, opening links, screenshots and read-only commands: run without asking.
- Ask me first, and show the command, before anything that changes the box: installing or pushing files, changing settings, uninstalling or disabling apps, clearing app data.
- Never factory reset the box. Never install an APK without asking.
- Screenshots are your eyes. After an action that changes the screen, take a screenshot to check it worked instead of assuming.
- If a screenshot is black or the app does not respond, tell me and stop. Do not retry in a loop.
- When reviewing thumbnails or titles, describe only what is visible in the screenshots. Do not invent details.

## Ideas for this project (not started yet)

1. Channel preview station: open channels and take screenshots to check thumbnails and titles from couch distance
2. Menu board for my street food stand in Zürich: a simple web page shown full-screen on the box
3. A small control dashboard with buttons for play, pause, volume and open-channel
4. Testing apps I build on a real TV

## Session wrap-up

At the end of a session, tell me what changed, what is saved in this folder, and anything I should do next. Update this file if the IP, paths or channels change.

## Status (added 2026-11-01)

- New commands live in `tv-ext.ps1` (channel, videos, shorts, video, list, add, shot, preview, previewall, check). Run them as `.\tv-ext.ps1 <command>`. To use them through `tv.ps1`, add these two lines inside `tv.ps1`, near the top (not at the prompt):
  `. "$PSScriptRoot\tv-ext.ps1"` then `if (Invoke-TvExt $args) { exit }`
- `check` works: the box shows as `device` and accepts HOME.
- Previews: both channels were previewed as guest on 2026-11-01. The thumbnail reviews are in `screenshots\2026-11-01\report.md`. The 2026-10-31 screenshots show YouTube's account picker, so ignore them. Run a preview with `/preview <channel>` or `.\tv-ext.ps1 preview <channel>`.
- YouTube package used for links: `com.google.android.youtube.tv`.
- Preview fix (2026-11-01): YouTube on this box auto-plays a channel mix about 12 s after a channel page opens if nothing is pressed, and it reopens a page at the old scroll position. `tv-ext.ps1 preview` now presses Up to reach the top, Down onto the For You shelf, then walks the Videos shelf with Left/Right instead of scrolling down. The slash command `/preview` follows the same steps. Tested twice in a row on Kolokwa Soul: four clean screens, no playback.
