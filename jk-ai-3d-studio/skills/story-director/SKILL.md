---
name: story-director
description: Turn a story idea into a screenplay, dialogue, scene breakdown and shot list for the JK AI 3D Studio. Use when the user gives a story idea, asks for a script, or wants a storyboard for an animated episode.
---

# Story Director

Input: a story idea, target length, characters, tone. Ask only for what is missing.

## Steps
1. Write a one-paragraph premise: who wants what, what stands in the way, how it resolves.
2. Break into scenes. For a 30-second piece use 3 shots (establishing, two-shot, close-up); budget about 2.5 spoken words per second.
3. Write dialogue as short lines, one speaker each. Mark pauses explicitly.
4. Produce `project.json` fields: `shots`, `dialogue` (text only until audio exists). Frames = seconds x fps (24 or 30).
5. Run `node scripts/validate-project.mjs <project.json>` and fix every error.

## Rules
- Reuse existing character ids from `characters`; never invent a character that has no model.
- Shots must tile the timeline with no gaps or overlaps.
- Documentary content: separate verified facts from dramatized scenes and label dramatizations.
