/**
 * Plays the physical-signal effect of the current data journey step (vessel motion, echoes,
 * pressure, ...). Effects are built on first use, fade in and out, and report a readout line that
 * the journey card shows next to the step.
 */
import * as THREE from "three";
import type { JourneyEffectKind } from "../../../config/surveyDataFormats";
import { EFFECT_BUILDERS } from "./effects";
import { EffectContext, SceneEffect } from "./effects/effectTypes";
import { applyFade, disposeGroup } from "./effects/effectUtils";

const FADE_RATE = 4;
const READOUT_INTERVAL = 0.2;
/** Clock position shown when motion is reduced: a pose near the peak of every oscillation. */
const STATIC_TIME = 1.6;

interface IEntry {
  effect: SceneEffect;
  k: number;
  t: number;
  shown: boolean;
}

export class PhenomenonController {
  private readonly entries: Partial<Record<JourneyEffectKind, IEntry>> = {};
  private active: JourneyEffectKind | null = null;
  private lastText: string | null = null;
  private sinceEmit = 0;

  constructor(
    private readonly scene: THREE.Scene,
    private readonly ctx: EffectContext,
    private readonly reducedMotion: boolean,
    private readonly onReadout: (text: string | null) => void,
  ) {}

  public setEffect(kind: JourneyEffectKind | null): void {
    if (kind === this.active) return;
    this.active = kind;
    if (kind) {
      const entry = this.entry(kind);
      entry.t = 0;
    }
    this.emit(null, true, 0);
  }

  /** World point and camera distance that frame the effect. */
  public focus(kind: JourneyEffectKind, out: THREE.Vector3): number {
    return this.entry(kind).effect.focus(out);
  }

  public update(dt: number): void {
    (Object.keys(this.entries) as JourneyEffectKind[]).forEach((kind) => {
      const entry = this.entries[kind] as IEntry;
      const goal = kind === this.active ? 1 : 0;
      entry.k = this.reducedMotion ? goal : THREE.MathUtils.damp(entry.k, goal, FADE_RATE, dt);
      if (Math.abs(entry.k - goal) < 0.004) entry.k = goal;
      if (goal === 0 && entry.k === 0) {
        if (entry.shown) {
          // One last pass with k = 0 so poses the effect owns return to rest.
          entry.effect.update(entry.t, dt, 0);
          applyFade(entry.effect.group, 0);
          entry.shown = false;
        }
        return;
      }
      entry.shown = true;
      entry.t = this.reducedMotion ? STATIC_TIME : entry.t + dt;
      const text = entry.effect.update(entry.t, dt, entry.k);
      applyFade(entry.effect.group, entry.k);
      if (kind === this.active) this.emit(text, false, dt);
    });
  }

  public dispose(): void {
    (Object.keys(this.entries) as JourneyEffectKind[]).forEach((kind) => {
      const entry = this.entries[kind] as IEntry;
      this.scene.remove(entry.effect.group);
      disposeGroup(entry.effect.group);
    });
  }

  private entry(kind: JourneyEffectKind): IEntry {
    const existing = this.entries[kind];
    if (existing) return existing;
    const effect = EFFECT_BUILDERS[kind](this.ctx);
    effect.group.visible = false;
    this.scene.add(effect.group);
    const entry: IEntry = { effect, k: 0, t: 0, shown: false };
    this.entries[kind] = entry;
    return entry;
  }

  private emit(text: string | null, force: boolean, dt: number): void {
    if (!force) {
      this.sinceEmit += dt;
      if (text === this.lastText || this.sinceEmit < READOUT_INTERVAL) return;
    }
    this.lastText = text;
    this.sinceEmit = 0;
    this.onReadout(text);
  }
}
