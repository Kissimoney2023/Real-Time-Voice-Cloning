---
name: remotion-composer
description: Assemble shots, dialogue audio, ambience, subtitles and transitions into a deterministic Remotion composition and render an MP4. Use when building or rendering the video.
---

# Remotion Composer

## Preconditions (check, do not assume)
- Node 18+, ffmpeg, and a Remotion project in `remotion-app/` with `@remotion/three` installed. Verify Remotion install commands against current Remotion docs.
- `node scripts/validate-project.mjs <project.json> --check-files` passes with no errors.

## Steps
1. Read `project.json`; create one Remotion `<Composition>` using its width, height, fps and durationFrames.
2. One `<Sequence>` per shot; load GLBs with React Three Fiber, drive animation clips from `useCurrentFrame()`.
3. Camera keyframes interpolate from frame only. No `Date.now`, no unseeded randomness.
4. Add `<Audio>` for each dialogue line at its `startFrame`, plus ambience and licensed music at low volume.
5. Subtitles come from `dialogue[].text` and timing.
6. Render a 5-second preview first (`--frames=0-119`), inspect, then render the full MP4.
7. Verify with `ffprobe`: resolution, fps and duration match the project. Report real numbers.

## Rules
- Never claim a render succeeded without checking the output file.
- Keep output under `out/` (git-ignored).
