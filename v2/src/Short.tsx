import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import * as THREE from 'three';
import { World, usePreload } from './world/World';
import { Chat } from './overlay/Chat';
import { Bursts, Closeups, Flash, Focus, Hook, LaterCard } from './overlay/Fx';
import { EV, FPS, shakeAt, voiceIntervals } from './state';

const VOICE = voiceIntervals();
const MUTES = EV.filter((e) => e.t === 'mute').map((e) => [e.t0, e.t1]);

// music ducks to 35% while anyone talks (same rule as Tiny Money Facts)
const musicVol = (f: number) => {
  const t = f / FPS;
  if (MUTES.some(([a, b]) => t >= a && t < b)) return 0;
  let d = 0;
  for (const [a, b] of VOICE) { if (t >= a - 0.1 && t <= b + 0.15) { d = 1; break; } }
  return 0.55 * (1 - 0.65 * d);
};

export const Short: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const ready = usePreload(); // textures first, then mount the 3D canvas
  const sh = shakeAt(t);
  const sx = sh ? Math.sin(t * 95) * 22 * sh : 0, sy = sh ? Math.cos(t * 83) * 16 * sh : 0;
  return (
    <AbsoluteFill style={{ background: '#160f2c' }}>
      <AbsoluteFill style={{ transform: `translate(${sx}px, ${sy}px) rotate(${sh * Math.sin(t * 60) * 1.2}deg)` }}>
        {ready && <ThreeCanvas width={1080} height={1920} shadows gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }} camera={{ fov: 40, position: [0, 2.3, 7.6] }}>
          <World />
        </ThreeCanvas>}
        <Chat t={t} />
        <Hook t={t} />
        <LaterCard t={t} />
        <Focus t={t} />
        <Bursts t={t} />
      </AbsoluteFill>
      <Closeups t={t} />
      <Flash t={t} />
      <Audio src={staticFile('voice.wav')} />
      <Audio src={staticFile('sfx.wav')} volume={0.5} />
      <Audio src={staticFile('music.wav')} volume={musicVol} />
    </AbsoluteFill>
  );
};
