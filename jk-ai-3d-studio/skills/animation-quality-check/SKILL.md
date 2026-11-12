---
name: animation-quality-check
description: Check a studio project and its render for missing assets, license gaps, timeline errors, lip-sync problems and visual defects. Use before declaring an episode done.
---

# Animation Quality Check

## Automated checks
1. `node scripts/validate-project.mjs <project.json> --check-files --strict`
2. `ffprobe` the MP4: resolution, fps, duration, audio stream present.
3. List every asset with its license; flag UNKNOWN, non-commercial, or attribution-required items.

## Visual checks (extract frames with ffmpeg and look at them)
- Frames at shot boundaries and mid-shot for each shot.
- Character present, correct model, correct scale, not clipping through floor or props.
- Feet planted during walk (no sliding); idle not frozen.
- Mouth moves during each dialogue line and rests between lines.
- Subtitles readable and matched to audio.

## Report
Give a pass/fail table with evidence (frame numbers, file paths). List defects honestly; do not mark anything passed that was not inspected.
