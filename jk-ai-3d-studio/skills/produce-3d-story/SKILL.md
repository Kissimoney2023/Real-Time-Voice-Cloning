---
name: produce-3d-story
description: Master command that coordinates the studio skills from story idea to rendered video, stopping at verification gates. Use when the user wants to produce an animated story end to end.
---

# Produce 3D Story

Run these in order. Stop at any gate that fails and report; do not skip ahead.

1. **Environment gate** - check Node, ffmpeg, Blender MCP (`get_scene_info`), and asset licenses. Ask before installing anything.
2. **/story-director** - script, dialogue, shot list into `project.json`; validator passes.
3. **/scene-builder** - environments exported as GLB (ask before destructive Blender ops).
4. **Characters** - confirm rigged GLBs with idle and walk clips and recorded licenses. If missing, ask the user to supply them; do not fabricate.
5. **/cinematic-camera** - camera keyframes.
6. **Voice and lip sync** - dialogue audio from env-var-configured TTS or user files; viseme timing via Rhubarb if installed.
7. **/remotion-composer** - preview render, then full render.
8. **/animation-quality-check** - report real results.

Never claim a step works without running it and showing the output.
