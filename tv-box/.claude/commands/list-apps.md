---
description: Read-only list of the apps I installed on the TV box, with versions and whether they show on the home screen
---

Show me the apps I installed on my TV box. Follow the rules in CLAUDE.md. This is read-only: do not install, remove, open settings or change anything.

Box: 192.168.8.149:5555. ADB: C:\Users\admin\platform-tools\adb.exe
Use `adb -s 192.168.8.149:5555 ...` for every command after the connect.

1. Connect (`adb connect 192.168.8.149:5555`, `adb devices`) and confirm it shows `device`. If not, follow the reconnect steps in CLAUDE.md.
2. List the apps I installed myself: `adb shell pm list packages -3`
3. For each package, give me the friendly app name. Use my expected list as a guide:
   - com.phlox.tvwebbrowser = TV Bro
   - org.videolan.vlc = VLC
   - com.yablio.sendfilestotv = Send Files to TV
   - com.esaba.downloader = Downloader
   For any other package, say what it most likely is, and mark it "not sure" if you are not certain. Do not guess confidently. Match package names exactly.
4. For each of my four expected apps, show whether it is installed or missing. If installed, add the version: `adb shell dumpsys package <package> | findstr versionName`
5. Press Home (KEYCODE_HOME), then open the apps row or "Apps" screen on the home screen with key presses only (no clicking into any app), and take a screenshot of it. Save it to `C:\Users\admin\tv-box\screenshots\<today's date>\apps.png`. Write real PNG bytes, not text-redirected output. If the screenshot is black (for example a streaming app is still on screen), tell me and stop. Do not retry in a loop.
6. Look at the screenshot and tell me which of the installed apps are visible on screen. Describe only what is visible.
7. Show a short table: app, package, installed (yes/no), version, visible on the home screen (yes/no).
8. End with one line on what to do next for any missing app (for example, "Say 'install VLC' and I will start the approval flow again").
