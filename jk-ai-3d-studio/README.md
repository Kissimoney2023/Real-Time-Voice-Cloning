# JK AI 3D Storytelling Studio (scaffold)

A starting point for an AI-assisted 3D animation pipeline: Claude Code + Blender MCP + Remotion/Three.js.

**Status: scaffold only.** Nothing here renders video yet. The skills are instructions for Claude,
the schemas and validator are tested, and the Remotion/Blender pieces are built by following `STUDIO_BRIEF.md`.

## Layout
```
.claude-plugin/plugin.json   plugin manifest
skills/<name>/SKILL.md       story-director, scene-builder, cinematic-camera, remotion-composer, animation-quality-check, produce-3d-story
src/schemas.ts               typed config for characters, environments, shots, scenes, dialogue
scripts/validate-project.mjs dependency-free project validator
examples/demo-30s/           sample 30-second two-character project
STUDIO_BRIEF.md              phased build prompt to paste into Claude Code on your PC
```

## Quick check (needs Node 18+)
```bash
node scripts/validate-project.mjs examples/demo-30s/project.json
node --test scripts/validate-project.test.mjs
```

## Use it
1. Run Claude Code from this folder on the machine where Blender is installed.
2. Make sure the `blender` MCP is connected (`/mcp`) and the Blender add-on server is started (N panel).
3. Paste the prompt from `STUDIO_BRIEF.md` and work through the gates in order.

To load the skills as a plugin during development: `claude --plugin-dir .`

## Not included (you must supply)
Rigged character models, motion clips, voices, music, and their licenses. Remotion app code is created at Gate 2.
