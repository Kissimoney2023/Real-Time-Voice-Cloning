// Typed configuration for the JK AI 3D Storytelling Studio.
// Keep in sync with scripts/validate-project.mjs (the dependency-free runtime validator).

export type Fps = 24 | 30;

export interface AssetLicense {
  spdx: string; // e.g. "CC0-1.0", "CC-BY-4.0", "proprietary"
  source: string; // URL or purchase reference
  attribution?: string; // required text when the license demands credit
  commercialUse: boolean;
}

export interface Character {
  id: string; // stable, e.g. "johnny"
  displayName: string;
  model: string; // path to rigged GLB, relative to project root
  license: AssetLicense;
  clips: { idle: string; walk: string; [clip: string]: string }; // clip name inside the GLB
  visemeMorphs?: Record<string, string>; // viseme id (A..H, X) -> morph target name
  voiceId?: string;
}

export interface Environment {
  id: string;
  displayName: string;
  model: string; // GLB or scene file
  license: AssetLicense;
}

export type ShotType = "establishing" | "two-shot" | "close-up" | "tracking" | "over-shoulder";

export interface CameraKeyframe {
  frame: number; // frame within the shot
  position: [number, number, number];
  lookAt: [number, number, number];
  fov: number;
  ease?: "linear" | "easeInOut";
}

export interface Shot {
  id: string;
  type: ShotType;
  startFrame: number; // absolute, in the project timeline
  durationFrames: number;
  environmentId: string;
  characters: { id: string; position: [number, number, number]; clip: string }[];
  camera: CameraKeyframe[];
}

export interface DialogueLine {
  id: string;
  characterId: string;
  text: string;
  audio: string; // path to audio file
  startFrame: number;
  durationFrames: number;
  visemes?: string; // path to viseme timing JSON (Rhubarb output)
}

export interface Project {
  title: string;
  fps: Fps;
  width: number;
  height: number;
  durationFrames: number;
  characters: Character[];
  environments: Environment[];
  shots: Shot[];
  dialogue: DialogueLine[];
  audio?: { ambience?: string; music?: string };
}
