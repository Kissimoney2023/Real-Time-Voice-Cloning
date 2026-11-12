---
name: cinematic-camera
description: Design camera shots and movement (establishing, two-shot, close-up, tracking) as keyframes in project.json. Use when planning or fixing camera work.
---

# Cinematic Camera

## Shot grammar
- Establishing: wide, high or distant, slow push-in; shows place and characters' positions.
- Two-shot: eye level, 35mm-feel (fov ~35), both faces visible, very slow drift.
- Close-up: fov 25-30, camera at eye height, subject on a third; hold still while they speak.
- Tracking: camera follows at constant offset with eased start and stop.

## Rules
- Keyframes use shot-relative frames (0 .. durationFrames-1). Use `easeInOut` for any move; never snap.
- Keep moves slow: under about 1.5 m of travel per second for a drift, no whip pans unless asked.
- Do not cut on a spoken word; cut in pauses.
- Respect the 180-degree line within a scene.
- All camera motion must be a pure function of frame number (deterministic).

After editing, run `node scripts/validate-project.mjs <project.json>`.
