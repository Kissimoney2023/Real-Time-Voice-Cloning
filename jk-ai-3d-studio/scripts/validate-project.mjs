#!/usr/bin/env node
// Dependency-free validator for a studio project.json (see src/schemas.ts).
// Usage: node scripts/validate-project.mjs <project.json> [--strict] [--check-files]
//   errors   -> always fail (structure, timeline, cross-references)
//   warnings -> unknown licenses, missing files; fail only with --strict
import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export function validateProject(project, { baseDir = ".", checkFiles = false } = {}) {
  const errors = [];
  const warnings = [];
  const err = (m) => errors.push(m);
  const warn = (m) => warnings.push(m);

  if (!project || typeof project !== "object") return { errors: ["project is not an object"], warnings };

  if (!project.title) err("title is required");
  if (![24, 30].includes(project.fps)) err(`fps must be 24 or 30 (got ${project.fps})`);
  for (const k of ["width", "height", "durationFrames"]) {
    if (!Number.isInteger(project[k]) || project[k] <= 0) err(`${k} must be a positive integer`);
  }
  for (const k of ["characters", "environments", "shots", "dialogue"]) {
    if (!Array.isArray(project[k])) err(`${k} must be an array`);
  }
  if (errors.length) return { errors, warnings };

  const checkLicense = (kind, item) => {
    const l = item.license;
    if (!l || !l.spdx || l.spdx === "UNKNOWN") warn(`${kind} "${item.id}": license unknown - do not ship until resolved`);
    else if (l.commercialUse === false) warn(`${kind} "${item.id}": license forbids commercial use`);
  };
  const checkFile = (what, p) => {
    if (checkFiles && p && !existsSync(resolve(baseDir, p))) warn(`${what}: file not found: ${p}`);
  };

  const ids = (arr, kind) => {
    const seen = new Set();
    for (const it of arr) {
      if (!it.id) err(`${kind} without id`);
      else if (seen.has(it.id)) err(`duplicate ${kind} id "${it.id}"`);
      else seen.add(it.id);
    }
    return seen;
  };
  const charIds = ids(project.characters, "character");
  const envIds = ids(project.environments, "environment");
  ids(project.shots, "shot");
  ids(project.dialogue, "dialogue");

  for (const c of project.characters) {
    if (!c.clips || !c.clips.idle || !c.clips.walk) err(`character "${c.id}": clips.idle and clips.walk are required`);
    checkLicense("character", c);
    checkFile(`character "${c.id}" model`, c.model);
  }
  for (const e of project.environments) {
    checkLicense("environment", e);
    checkFile(`environment "${e.id}" model`, e.model);
  }

  // Shots: in order, no gaps or overlaps, exactly cover durationFrames.
  const shots = [...project.shots].sort((a, b) => a.startFrame - b.startFrame);
  let cursor = 0;
  for (const s of shots) {
    if (!Number.isInteger(s.startFrame) || !Number.isInteger(s.durationFrames) || s.durationFrames <= 0) {
      err(`shot "${s.id}": startFrame/durationFrames must be integers (duration > 0)`);
      continue;
    }
    if (s.startFrame < cursor) err(`shot "${s.id}" overlaps the previous shot`);
    if (s.startFrame > cursor) err(`gap of ${s.startFrame - cursor} frames before shot "${s.id}"`);
    cursor = s.startFrame + s.durationFrames;
    if (!envIds.has(s.environmentId)) err(`shot "${s.id}": unknown environmentId "${s.environmentId}"`);
    for (const ch of s.characters ?? []) {
      if (!charIds.has(ch.id)) err(`shot "${s.id}": unknown character "${ch.id}"`);
    }
    if (!Array.isArray(s.camera) || s.camera.length === 0) err(`shot "${s.id}": at least one camera keyframe required`);
    for (const k of s.camera ?? []) {
      if (k.frame < 0 || k.frame >= s.durationFrames) err(`shot "${s.id}": camera keyframe at ${k.frame} is outside the shot`);
    }
  }
  if (shots.length && cursor !== project.durationFrames) {
    err(`shots end at frame ${cursor} but durationFrames is ${project.durationFrames}`);
  }

  for (const d of project.dialogue) {
    if (!charIds.has(d.characterId)) err(`dialogue "${d.id}": unknown character "${d.characterId}"`);
    if (d.startFrame < 0 || d.startFrame + d.durationFrames > project.durationFrames) {
      err(`dialogue "${d.id}" falls outside the timeline`);
    }
    checkFile(`dialogue "${d.id}" audio`, d.audio);
  }
  // Two characters should not talk over each other.
  const lines = [...project.dialogue].sort((a, b) => a.startFrame - b.startFrame);
  for (let i = 1; i < lines.length; i++) {
    const prev = lines[i - 1];
    if (lines[i].startFrame < prev.startFrame + prev.durationFrames) {
      warn(`dialogue "${lines[i].id}" overlaps "${prev.id}"`);
    }
  }
  return { errors, warnings };
}

// CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const file = args.find((a) => !a.startsWith("--"));
  if (!file) {
    console.error("usage: validate-project.mjs <project.json> [--strict] [--check-files]");
    process.exit(2);
  }
  const strict = args.includes("--strict");
  let project;
  try {
    project = JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    console.error(`cannot read ${file}: ${e.message}`);
    process.exit(2);
  }
  const { errors, warnings } = validateProject(project, {
    baseDir: dirname(resolve(file)),
    checkFiles: args.includes("--check-files"),
  });
  warnings.forEach((w) => console.log(`warning: ${w}`));
  errors.forEach((e) => console.log(`error:   ${e}`));
  const failed = errors.length > 0 || (strict && warnings.length > 0);
  console.log(failed ? `FAILED (${errors.length} errors, ${warnings.length} warnings)` : `OK (${warnings.length} warnings)`);
  process.exit(failed ? 1 : 0);
}
