---
name: scene-builder
description: Build or modify 3D environments (streets, houses, markets, classrooms) in Blender via the blender MCP and export GLB for Remotion. Use when the user needs a location or set.
---

# Scene Builder

## Before touching Blender
1. Confirm the `blender` MCP is connected (`get_scene_info`). If not, stop and tell the user to start the add-on server (N panel > MCP for Blender).
2. Ask the user to save the .blend (or save a copy). Never overwrite or delete without explicit approval.

## Steps
1. Plan the layout in metres: ground, key props, camera-safe zone, character marks.
2. Build in small steps; call `look` after each step to verify visually.
3. Prefer free CC0 assets (Poly Haven) when enabled; record license and source for each in `assets/environments/<id>.json`.
4. Export GLB to `assets/environments/<id>.glb` (apply modifiers, Y-up, include textures). Verify the file exists and size is sane.
5. Add the environment to `project.json` and run the validator.

## Rules
- Stay low-poly enough for real-time Three.js rendering; flag anything over ~200k triangles.
- Destructive operations (delete, purge, clear scene) require explicit user approval.
