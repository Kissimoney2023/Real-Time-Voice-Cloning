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
3. Open the channel's /videos tab in the YouTube app with an android.intent.action.VIEW intent. Wait about 4 seconds for it to load. Then press KEYCODE_DPAD_UP 8 times (250 ms apart) to get back to the top of the page, because YouTube reopens a channel page at the old scroll position. Then press KEYCODE_DPAD_DOWN 3 times (300 ms apart): that walks past the description and the "Play mix" button onto the "For You" shelf. Then press KEYCODE_DPAD_LEFT 15 times (150 ms apart), then RIGHT once and LEFT once, and wait 1 second. The Left presses bring the shelf back to its first tile (shelves remember how far right they were last time), and the Right-then-Left restarts YouTube's muted-preview timer on the focused tile so its thumbnail stays visible for the shot. Do not skip this: if the focus stays on the header, YouTube starts playing a channel mix by itself after about 12 seconds and every later screenshot is a black video frame.
4. Take screenshot 1 (top of the page: "For You" shelf and the top of the "Videos" shelf). Press KEYCODE_DPAD_DOWN once more so the focus sits on the "Videos" shelf, then do the same Left-15, Right, Left reset, wait 1 second, take screenshot 2. For screenshots 3 and 4, press KEYCODE_DPAD_RIGHT three times (300 ms apart) to walk along the Videos shelf, wait 1 second, and shoot. Do not scroll down further: the page only has For You, Videos, Shorts and Subscriptions, then two buttons, so Down runs out after two screens. Do not press Right past the last upload: at the end of the shelf, Right jumps down to the Shorts row. Keep every wait at 1 second: about 3 seconds after focus lands on a tile, YouTube starts a muted preview in it and the thumbnail goes dark in the screenshot. If a screenshot shows a video title at the top with a progress bar instead of the grid, the auto-play kicked in; tell me and stop.
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
