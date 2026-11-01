---
description: Preview a YouTube channel on the TV box and review its thumbnails and titles
argument-hint: [channel name or "all"]
---

Run a channel preview on my TV box. Follow the rules in CLAUDE.md.

Channel to preview: $ARGUMENTS
(If no argument is given, ask me which channel from channels.json, or "all".)

Steps:

1. Connect to the box: `adb connect 192.168.8.149:5555`, then `adb devices`. Confirm it shows `device`. If not, follow the reconnect steps in CLAUDE.md and stop if it still fails.
2. Look up the channel in channels.json. If "all", do every channel one after the other.
3. Open the channel's /videos tab in the YouTube app with an android.intent.action.VIEW intent. Wait about 5 seconds for it to load.
4. Take a screenshot. Press KEYCODE_DPAD_DOWN to scroll, wait 2 seconds, take another. Repeat until you have 4 screens.
5. Save the screenshots to `C:\Users\admin\tv-box\screenshots\<today's date>\` named `<channel>_<screen number>.png`. Write real PNG bytes, not text-redirected output.
6. If a screenshot is black or the app does not respond, tell me and stop. Do not retry in a loop.
7. Look at the first screenshot before continuing. If it shows the YouTube "Who's watching?" account picker, a sign-in screen, a popup, or an error instead of the channel's videos, tell me what you see and stop. Do not pick an account yourself.
8. Read the screenshots and review, per channel:
   * Which thumbnails are easy to read from about 3 meters away, and which are not (small text, low contrast, too busy)
   * Which titles are cut off or unclear on the TV layout
   * Whether the thumbnails look consistent as a set
   * 3 concrete fixes, ranked by impact

   Only describe what is visible in the screenshots. Do not invent details.
9. Save a short `report.md` in that day's screenshots folder with the file list and the review.
10. Finish with a 3-line summary: what you previewed, the biggest problem, and the first fix to try.
