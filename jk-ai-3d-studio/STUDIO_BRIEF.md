# JK AI 3D Storytelling Studio — Claude Code build brief

Paste the section below the line into Claude Code, run from the `jk-ai-3d-studio/` folder on your PC
(the machine where Blender is installed). It is deliberately phased: **stop and verify at every gate.**

---

You are the lead technical director for the JK AI 3D Storytelling Studio. This folder already holds a
scaffold: a Claude Code plugin skeleton (`.claude-plugin/`, `skills/`), typed schemas (`src/schemas.ts`),
a sample 30-second project (`examples/demo-30s/`), and a dependency-free validator
(`scripts/validate-project.mjs`). Treat the scaffold as unverified until you have run it.

## Ground rules
- Do not claim a feature works until you have run it and shown the output.
- Never assume a connector, API, asset, or service exists. Check first (`claude mcp list`, `node -v`,
  `ffmpeg -version`, `uvx --version`).
- Keep API keys in environment variables. Never write them to files.
- Ask before any destructive Blender operation (delete, purge, overwrite, save-over). Save a copy first.
- Rendering must be deterministic and frame-based (Remotion `useCurrentFrame`; no wall-clock time, no `Math.random` without a seed).
- Every imported character, motion clip, voice, and music track needs a recorded license in its asset JSON.
  Refuse to use an asset whose license is unknown.
- Verify Remotion plugin/skills install commands against the current Remotion docs before running them.

## Gate 0 — Inspect the environment
Report: OS, Node, npm, ffmpeg, uv, Blender version, whether the `blender` MCP is connected
(call get_scene_info), installed Claude Code plugins. List what is missing. Stop for approval before installing anything.

## Gate 1 — Run the scaffold
1. `node scripts/validate-project.mjs examples/demo-30s/project.json` must pass.
2. Fix anything the validator reports. Add unit tests for it.

## Gate 2 — Render something real
1. Create a Remotion project in `remotion-app/` (TypeScript, React) and add `@remotion/three`.
2. Render a 5-second 1080p test composition with one GLB model on a ground plane and a camera move.
3. Verify the MP4 with ffprobe (resolution, fps, duration). Show the output.

## Gate 3 — Characters and motion
1. Source two rigged humanoid GLBs with clear licenses (e.g. CC0). Record license + source in `assets/characters/<id>.json`.
2. Validate each GLB: skeleton, animation clips (idle, walk), morph targets (visemes, blink), textures.
3. Play idle and walk in Remotion with blending. Test for foot sliding before continuing.

## Gate 4 — Dialogue, lip sync, audio
1. Generate or import dialogue audio (TTS key from env vars, or recorded files).
2. Produce viseme timing with Rhubarb (verify it is installed) and drive mouth morph targets.
3. Add ambience, music (licensed), and subtitles from the dialogue file.

## Gate 5 — The 30-second demo
Two characters, one environment, three shots (establishing, two-shot, close-up), voice, ambience, subtitles.
Export 1920×1080 MP4 at 24 fps. Run `/animation-quality-check`. Report real results and known defects.

## Gate 6 — Expand
Only after Gate 5 passes: fill in remaining skills (`/character-rigger`, `/facial-animator`,
`/documentary-director`, `/youtube-export`), a character library, and 9:16 export.

Begin with Gate 0.
