// Turns the timeline (built by tools/build.py) into "what is on screen at time t".
import tl from '../public/timeline.json';
import castJson from '../cast.json';

export type Ev = {
  t: string; i: number; t0: number; t1: number; who?: string; text?: string; say?: string;
  vs?: number; vd?: number; zoom?: number; shake?: boolean; sfx?: string; tone?: string; icon?: string;
  stage?: string; leave?: boolean; hammer?: boolean; reply?: string; time?: string; emoji?: string;
  n?: number; s?: number; props?: Record<string, string>; clipStart?: number; img?: { emoji: string; cap?: string; bg?: string };
  big?: boolean;
};
export const TL = tl as unknown as { id: string; title: string; hook: string; time: string; duration: number; fps: number; events: Ev[] };
export const EV = TL.events;
export const CAST = castJson.characters as Record<string, { name: string; color: string; tag: string }>;
export const FPS = 30;

export const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const prog = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const eOut = (x: number) => 1 - Math.pow(1 - x, 3);
export const eBack = (x: number) => { if (x <= 0) return 0; if (x >= 1) return 1; const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };

/** latest event that has started */
export const current = (t: number) => { let c: Ev | null = null; for (const e of EV) if (e.t0 <= t && e.t !== 'set') c = e; return c; };

/** who stands on the 3D stage, and since when */
export const stageAt = (t: number) => {
  let who = 'none', since = 0, leave = false, leaveAt = 0, prev = 'none', prevSince = 0;
  for (const e of EV) {
    if (e.t0 > t) break;
    const w = e.stage ?? ((e.t === 'msg' || e.t === 'closeup') ? e.who : undefined);
    if (e.leave) { leave = true; leaveAt = e.t0; }
    if (w && w !== who) { prev = who; prevSince = since; who = w; since = e.t0; leave = !!e.leave; if (e.leave) leaveAt = e.t0; }
  }
  return { who, since, leave, leaveAt, prev, prevSince };
};

/** is this character's voice playing? returns 0..1 mouth open */
export const talking = (who: string, t: number) => {
  for (const e of EV) if (e.who === who && e.vs !== undefined && t >= e.vs && t <= e.vs + (e.vd ?? 0)) {
    const k = t - e.vs; return 0.35 + 0.65 * Math.abs(Math.sin(k * 15.5)) * (0.6 + 0.4 * Math.sin(k * 4.1));
  }
  return 0;
};

/** display names after "set" events */
export const namesAt = (t: number) => {
  const n: Record<string, string> = Object.fromEntries(Object.entries(CAST).map(([k, v]) => [k, v.name]));
  for (const e of EV) if (e.t === 'set' && e.t0 <= t && e.props?.name && e.who) n[e.who] = e.props.name;
  return n;
};

/** shake strength 0..1 */
export const shakeAt = (t: number) => {
  let s = 0;
  for (const e of EV) if (e.shake && t >= e.t0 && t < e.t0 + 0.45) s = Math.max(s, 1 - (t - e.t0) / 0.45);
  return s;
};

/** active punch-zoom: the event and 0..1 amount */
export const zoomAt = (t: number) => {
  for (const e of EV) if (e.zoom && t >= e.t0 && t < e.t1) {
    const inn = eOut(prog(t, e.t0, e.t0 + 0.16)), out = 1 - prog(t, e.t1 - 0.12, e.t1);
    return { e, k: inn * out };
  }
  return null;
};

export const voiceIntervals = () => EV.filter((e) => e.vs !== undefined).map((e) => [e.vs!, e.vs! + e.vd!] as [number, number]);
