// The 3D cast, built from primitives in the same "bean" style as Tiny Money Facts (Sam & Mia).
// Every character: body + head + face + their signature item. Props: talk (0..1 mouth), blink, t (seconds).
import React from 'react';
import * as THREE from 'three';

const SKIN = '#ffd3b0';
type P = { talk: number; blink: number; t: number; extra?: number };

const Mat: React.FC<{ c: string; r?: number; e?: string; ei?: number; m?: number }> = ({ c, r = 0.45, e, ei = 0, m = 0 }) => (
  <meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? '#000'} emissiveIntensity={ei} />
);

const Eyes: React.FC<{ y: number; z: number; blink: number; gap?: number; s?: number; pupil?: string }> = ({ y, z, blink, gap = 0.2, s = 1, pupil = '#141019' }) => (
  <group position={[0, y, z]} scale={[s, s * (1 - 0.9 * blink), s]}>
    {[-gap, gap].map((x) => (
      <group key={x} position={[x, 0, 0]}>
        <mesh scale={[0.11, 0.13, 0.06]}><sphereGeometry args={[1, 24, 16]} /><Mat c="#ffffff" r={0.2} /></mesh>
        <mesh position={[0, -0.01, 0.045]} scale={[0.065, 0.075, 0.03]}><sphereGeometry args={[1, 20, 14]} /><Mat c={pupil} r={0.15} /></mesh>
        <mesh position={[0.025, 0.03, 0.07]} scale={0.02}><sphereGeometry args={[1, 10, 8]} /><Mat c="#fff" e="#fff" ei={0.6} /></mesh>
      </group>
    ))}
  </group>
);

const Mouth: React.FC<{ y: number; z: number; talk: number; w?: number; smile?: boolean }> = ({ y, z, talk, w = 0.12, smile = true }) => (
  talk > 0.02 ? (
    <mesh position={[0, y, z]} scale={[w, 0.03 + 0.11 * talk, 0.04]}><sphereGeometry args={[1, 20, 14]} /><Mat c="#4a1420" r={0.6} /></mesh>
  ) : (
    <mesh position={[0, y, z]} rotation={[0, 0, smile ? Math.PI : 0]}><torusGeometry args={[w * 0.8, 0.018, 8, 24, Math.PI]} /><Mat c="#4a1420" /></mesh>
  )
);

const Bean: React.FC<{ body: string; children?: React.ReactNode; legs?: string; arms?: [number, number] }> = ({ body, children, legs = '#2a2a3a', arms = [0.25, 0.25] }) => (
  <group>
    {[-0.22, 0.22].map((x) => (
      <group key={x} position={[x, 0.3, 0]}>
        <mesh castShadow><capsuleGeometry args={[0.15, 0.3, 8, 16]} /><Mat c={legs} /></mesh>
        <mesh position={[x * 0.2, -0.24, 0.08]} scale={[0.2, 0.1, 0.28]} castShadow><sphereGeometry args={[1, 16, 12]} /><Mat c="#1b1b24" /></mesh>
      </group>
    ))}
    <mesh position={[0, 1.05, 0]} castShadow><capsuleGeometry args={[0.52, 0.55, 12, 28]} /><Mat c={body} r={0.35} /></mesh>
    {[-1, 1].map((s, i) => (
      <group key={s} position={[s * 0.55, 1.35, 0]} rotation={[0, 0, s * arms[i]]}>
        <mesh position={[0, -0.32, 0]} castShadow><capsuleGeometry args={[0.13, 0.42, 8, 14]} /><Mat c={body} r={0.4} /></mesh>
        <mesh position={[0, -0.66, 0]} castShadow><sphereGeometry args={[0.15, 16, 12]} /><Mat c={SKIN} /></mesh>
      </group>
    ))}
    {children}
  </group>
);

const Head: React.FC<{ y?: number; r?: number; c?: string; children?: React.ReactNode }> = ({ y = 2.05, r = 0.56, c = SKIN, children }) => (
  <group position={[0, y, 0]}>
    <mesh castShadow><sphereGeometry args={[r, 40, 28]} /><Mat c={c} r={0.5} /></mesh>
    {[-1, 1].map((s) => (<mesh key={s} position={[s * 0.33, -0.12, r * 0.78]} scale={[0.09, 0.05, 0.02]}><sphereGeometry args={[1, 12, 8]} /><Mat c="#ff8fa3" /></mesh>))}
    {children}
  </group>
);

export const Kevin: React.FC<P> = ({ talk, blink, t }) => (
  <Bean body="#2fbf4a" arms={[0.25, 0.35 + 0.25 * Math.sin(t * 9) * (talk > 0 ? 1 : 0)]}>
    <Head>
      <Eyes y={0.06} z={0.5} blink={blink} />
      <Mouth y={-0.2} z={0.53} talk={talk} />
      {/* red cap, turned sideways = try-hard */}
      <group rotation={[0, 0.5, 0]}>
        <mesh position={[0, 0.2, 0]} scale={[1, 0.75, 1]} castShadow><sphereGeometry args={[0.6, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><Mat c="#ff3d3d" /></mesh>
        <mesh position={[0, 0.22, 0.62]} rotation={[0.2, 0, 0]} scale={[0.42, 0.04, 0.32]}><cylinderGeometry args={[1, 1, 1, 24]} /><Mat c="#e02a2a" /></mesh>
      </group>
      {/* gamer headset */}
      <mesh position={[0, 0.05, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.62, 0.05, 10, 40, Math.PI]} /><Mat c="#1d1d26" m={0.3} /></mesh>
      {[-1, 1].map((s) => (<mesh key={s} position={[s * 0.6, -0.05, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.2, 0.2, 0.16, 24]} /><Mat c="#1d1d26" e="#57f287" ei={0.25} /></mesh>))}
      <mesh position={[0.45, -0.32, 0.38]} rotation={[0.3, -0.5, 1.1]}><cylinderGeometry args={[0.025, 0.025, 0.5, 8]} /><Mat c="#1d1d26" /></mesh>
    </Head>
  </Bean>
);

export const Gerald: React.FC<P & { tip?: number }> = ({ talk, blink, tip = 0 }) => (
  <Bean body="#5b3f24" legs="#2b2016" arms={[0.25, 0.25 + 2.3 * tip]}>
    <mesh position={[0, 1.15, 0.47]} scale={[0.12, 0.42, 0.06]}><boxGeometry /><Mat c="#e8e2d0" /></mesh>
    <Head>
      <Eyes y={0.05} z={0.5} blink={Math.max(blink, 0.45)} />
      {/* neckbeard */}
      <mesh position={[0, -0.32, 0.12]} scale={[0.62, 0.42, 0.55]}><sphereGeometry args={[1, 28, 18, 0, Math.PI * 2, Math.PI * 0.45, Math.PI * 0.55]} /><Mat c="#5a3a1a" r={0.9} /></mesh>
      <Mouth y={-0.2} z={0.55} talk={talk} w={0.1} />
      {/* fedora (lifts when he tips it) */}
      <group position={[0, 0.42 + 0.25 * tip, 0]} rotation={[-0.35 * tip, 0, 0.12]}>
        <mesh castShadow><cylinderGeometry args={[0.82, 0.82, 0.05, 40]} /><Mat c="#3a3a44" /></mesh>
        <mesh position={[0, 0.24, 0]} castShadow><cylinderGeometry args={[0.42, 0.48, 0.46, 32]} /><Mat c="#4b4b57" /></mesh>
        <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.49, 0.49, 0.1, 32]} /><Mat c="#17171c" /></mesh>
      </group>
    </Head>
  </Bean>
);

export const Grandma: React.FC<P> = ({ talk, blink, t }) => (
  <Bean body="#b066ff" legs="#5a3d7a" arms={[0.25 + (talk > 0 ? 0.6 + 0.3 * Math.sin(t * 10) : 0), 0.25]}>
    <Head>
      <mesh position={[0, 0.12, -0.08]} scale={[1.06, 0.95, 1.02]}><sphereGeometry args={[0.58, 36, 24, 0, Math.PI * 2, 0, Math.PI * 0.55]} /><Mat c="#ecebf3" r={0.9} /></mesh>
      <mesh position={[0, 0.66, -0.12]}><sphereGeometry args={[0.24, 24, 16]} /><Mat c="#ecebf3" r={0.9} /></mesh>
      <Eyes y={0.02} z={0.5} blink={blink} s={0.85} />
      {[-0.2, 0.2].map((x) => (<mesh key={x} position={[x, 0.02, 0.55]}><torusGeometry args={[0.14, 0.022, 10, 28]} /><Mat c="#c79a2b" m={0.6} r={0.3} /></mesh>))}
      <Mouth y={-0.24} z={0.52} talk={talk} />
    </Head>
  </Bean>
);

export const Bot: React.FC<P> = ({ talk, t }) => (
  <group>
    {[-0.25, 0.25].map((x) => (<mesh key={x} position={[x, 0.3, 0]} castShadow><boxGeometry args={[0.24, 0.6, 0.3]} /><Mat c="#5c6b80" m={0.5} r={0.35} /></mesh>))}
    <mesh position={[0, 1.05, 0]} castShadow><boxGeometry args={[1.05, 1.0, 0.7]} /><Mat c="#2a7fff" m={0.3} r={0.3} /></mesh>
    <mesh position={[0, 1.1, 0.36]}><boxGeometry args={[0.5, 0.3, 0.02]} /><Mat c="#0d1a2e" e="#5affc8" ei={0.2 + 0.6 * talk} /></mesh>
    <group position={[0, 2.05, 0]} rotation={[0, Math.sin(t * 1.3) * 0.12, 0]}>
      <mesh castShadow><boxGeometry args={[1.15, 0.85, 0.8]} /><Mat c="#d9e3f0" m={0.4} r={0.25} /></mesh>
      <mesh position={[0, 0.02, 0.41]}><boxGeometry args={[0.9, 0.55, 0.02]} /><Mat c="#0b0f18" /></mesh>
      {[-0.2, 0.2].map((x) => (<mesh key={x} position={[x, 0.08, 0.43]}><boxGeometry args={[0.16, 0.16, 0.02]} /><Mat c="#5affc8" e="#5affc8" ei={1.2} /></mesh>))}
      <mesh position={[0, -0.14, 0.43]} scale={[1, 0.3 + 2.2 * talk, 1]}><boxGeometry args={[0.36, 0.04, 0.02]} /><Mat c="#5affc8" e="#5affc8" ei={1.2} /></mesh>
      <mesh position={[0, 0.6, 0]}><cylinderGeometry args={[0.03, 0.03, 0.4, 8]} /><Mat c="#8a96a8" /></mesh>
      <mesh position={[0, 0.82, 0]}><sphereGeometry args={[0.09, 16, 12]} /><Mat c="#ff3d3d" e="#ff3d3d" ei={0.6 + 0.6 * Math.abs(Math.sin(t * 4))} /></mesh>
    </group>
  </group>
);

export const Dave: React.FC<P> = ({ talk, blink, t }) => (
  <group scale={1.15}>
    {[-0.15, 0.15].map((x) => (<mesh key={x} position={[x, 0.18, 0.05]}><cylinderGeometry args={[0.03, 0.03, 0.36, 8]} /><Mat c="#ff9a3c" /></mesh>))}
    <mesh position={[0, 0.85, 0]} scale={[0.75, 0.68, 0.95]} castShadow><sphereGeometry args={[1, 36, 24]} /><Mat c="#9a9aae" r={0.6} /></mesh>
    <mesh position={[0, 1.42, 0.22]} rotation={[0.3, 0, 0]}><torusGeometry args={[0.32, 0.12, 12, 32]} /><Mat c="#3fae8e" m={0.5} r={0.25} /></mesh>
    <group position={[0, 1.75, 0.3 + Math.max(0, Math.sin(t * 6)) * 0.06]}>
      <mesh castShadow><sphereGeometry args={[0.38, 32, 22]} /><Mat c="#8e8ea6" r={0.6} /></mesh>
      <Eyes y={0.06} z={0.3} blink={blink} gap={0.17} s={0.9} />
      <mesh position={[0, -0.06, 0.4 + 0.04 * talk]} rotation={[Math.PI / 2, 0, 0]}><coneGeometry args={[0.09, 0.28, 16]} /><Mat c="#ffb02e" /></mesh>
    </group>
  </group>
);

export const Mom: React.FC<P> = ({ talk, blink }) => (
  <Bean body="#ed4245">
    <Head>
      <mesh position={[0, 0.08, -0.1]} scale={[1.08, 1.05, 1.05]}><sphereGeometry args={[0.58, 36, 24, 0, Math.PI * 2, 0, Math.PI * 0.62]} /><Mat c="#5a3216" r={0.9} /></mesh>
      <Eyes y={0.04} z={0.5} blink={blink} />
      <Mouth y={-0.22} z={0.53} talk={talk} smile={false} />
    </Head>
  </Bean>
);

/** Ichika's 3D monitor: her Runway art/clip on a glowing screen with cat ears. */
export const IchikaScreen: React.FC<{ tex: THREE.Texture | null; t: number; talk: number }> = ({ tex, t, talk }) => (
  <group position={[0, 1.45, 0]} scale={0.88 * (1 + 0.03 * talk)}>
    <mesh castShadow><boxGeometry args={[2.5, 2.5, 0.22]} /><Mat c="#1b1c26" m={0.4} r={0.3} /></mesh>
    <mesh position={[0, 0, 0.12]}>
      <planeGeometry args={[2.25, 2.25]} />
      {tex ? <meshBasicMaterial map={tex} toneMapped={false} /> : <meshBasicMaterial color="#ffd1e8" />}
    </mesh>
    {/* neon frame */}
    {[[0, 1.27, 2.6, 0.06], [0, -1.27, 2.6, 0.06], [1.27, 0, 0.06, 2.6], [-1.27, 0, 0.06, 2.6]].map(([x, y, w, h], i) => (
      <mesh key={i} position={[x, y, 0.13]}><boxGeometry args={[w, h, 0.04]} /><meshStandardMaterial color="#ff8fc7" emissive="#ff5fb0" emissiveIntensity={1.4 + 0.4 * Math.sin(t * 3)} toneMapped={false} /></mesh>
    ))}
    {/* cat ears */}
    {[-1, 1].map((s) => (
      <group key={s} position={[s * 0.85, 1.42, 0]} rotation={[0, 0, -s * 0.3]}>
        <mesh castShadow><coneGeometry args={[0.36, 0.6, 4]} /><Mat c="#ffffff" r={0.4} /></mesh>
        <mesh position={[0, -0.04, 0.1]} scale={0.6}><coneGeometry args={[0.36, 0.6, 4]} /><Mat c="#ffb3d1" /></mesh>
      </group>
    ))}
    <mesh position={[0, -1.6, -0.1]}><cylinderGeometry args={[0.1, 0.1, 0.7, 16]} /><Mat c="#2a2b36" m={0.5} /></mesh>
    <mesh position={[0, -1.95, 0]}><cylinderGeometry args={[0.6, 0.7, 0.08, 32]} /><Mat c="#2a2b36" m={0.5} /></mesh>
  </group>
);

/** Ban hammer: swings down at t=0, holds, then lifts. */
export const Hammer: React.FC<{ k: number }> = ({ k }) => {
  // k = seconds since the ban
  const swing = k < 0.18 ? 1 - k / 0.18 : 0;
  const lift = Math.max(0, (k - 0.75) / 0.3);
  const a = -0.25 + 1.6 * swing + 1.6 * lift;
  return (
    <group position={[1.15, 2.2, 0.4]} rotation={[0, 0, a]}>
      <mesh position={[0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.08, 0.08, 1.8, 12]} /><Mat c="#8a5a2b" /></mesh>
      <mesh position={[0, 0, 0]} castShadow><cylinderGeometry args={[0.38, 0.38, 0.95, 28]} /><Mat c="#6b7280" m={0.7} r={0.25} /></mesh>
      <mesh position={[0, 0, 0]}><cylinderGeometry args={[0.4, 0.4, 0.2, 28]} /><Mat c="#ff3d3d" e="#ff3d3d" ei={0.4} /></mesh>
    </group>
  );
};
