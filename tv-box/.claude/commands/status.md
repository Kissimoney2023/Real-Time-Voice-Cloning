---
description: Check the TV box connection and report its current state
---

Check the status of my TV box. Follow the rules in CLAUDE.md. Do not change anything on the box; this command is read-only apart from one screenshot.

Use `adb -s 192.168.8.149:5555 ...` for every command after the connect, so nothing can reach another device.

Steps:

1. Run `adb connect 192.168.8.149:5555`, then `adb devices`.
   * If it shows `device`, continue.
   * If it shows `offline` or `unauthorized`, run `adb kill-server`, `adb start-server`, and connect again once.
   * If it still fails, stop and tell me exactly what to check: the box is on, the PC is on the yalloHome Wi-Fi, USB debugging is on, and the "Allow USB debugging?" prompt on the TV is accepted with "Always allow". Ask me for the box's IP if it may have changed (Settings, Network).
2. Run these and collect the results:
   * `adb shell getprop ro.product.model`
   * `adb shell getprop ro.build.version.release`
   * `adb shell df -h /data`
   * `adb shell cat /proc/meminfo` (MemTotal and MemAvailable lines)
   * `adb shell dumpsys window | findstr mCurrentFocus` (what app is on screen)
   * `adb shell dumpsys audio | findstr -i "STREAM_MUSIC"` (volume info, if available)
3. Take one screenshot and save it to `C:\Users\admin\tv-box\screenshots\<today's date>\status.png`. Write real PNG bytes, not text-redirected output.
4. Report in a short table: connection (OK or not), model, Android version, free storage, total and available RAM, app currently on screen, and what the screenshot shows. Describe only what is visible in the screenshot.
5. If anything looks wrong (low storage under 2GB free, low available RAM, app not responding), say so plainly and suggest one fix. Do not apply the fix without asking.
