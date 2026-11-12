import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validateProject } from "./validate-project.mjs";

const sample = () => JSON.parse(readFileSync(new URL("../examples/demo-30s/project.json", import.meta.url), "utf8"));

test("sample project has no errors, but warns about unknown licenses", () => {
  const { errors, warnings } = validateProject(sample());
  assert.deepEqual(errors, []);
  assert.ok(warnings.some((w) => w.includes("license unknown")));
});

test("gap between shots is an error", () => {
  const p = sample();
  p.shots[1].startFrame += 10;
  const { errors } = validateProject(p);
  assert.ok(errors.some((e) => e.includes("gap of 10 frames")));
});

test("shots that do not fill the timeline are an error", () => {
  const p = sample();
  p.durationFrames = 800;
  const { errors } = validateProject(p);
  assert.ok(errors.some((e) => e.includes("durationFrames")));
});

test("unknown character in a shot is an error", () => {
  const p = sample();
  p.shots[0].characters[0].id = "ghost";
  const { errors } = validateProject(p);
  assert.ok(errors.some((e) => e.includes('unknown character "ghost"')));
});

test("dialogue outside the timeline is an error", () => {
  const p = sample();
  p.dialogue[2].startFrame = 700;
  const { errors } = validateProject(p);
  assert.ok(errors.some((e) => e.includes("outside the timeline")));
});

test("fps must be 24 or 30", () => {
  const p = sample();
  p.fps = 25;
  assert.ok(validateProject(p).errors.some((e) => e.includes("fps")));
});

test("overlapping dialogue is a warning", () => {
  const p = sample();
  p.dialogue[1].startFrame = 300;
  assert.ok(validateProject(p).warnings.some((w) => w.includes("overlaps")));
});
