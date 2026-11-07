// The 3D world: a neon gamer room, a stage spot, the current speaker, camera moves.
import React, { useLayoutEffect, useMemo, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { continueRender, delayRender, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { EV, FPS, eBack, eOut, prog, stageAt, talking, zoomAt, clamp } from '../state';
import { Bot, Dave, Gerald, Grandma, Hammer, IchikaScreen, Kevin, Mom } from './Cast';

const blinkAt = (t: number, o: number) => { const m = (t + o) % 3.4; return m < 0.13 ? Math.sin((m / 0.13) * Math.PI) : 0; };

// All Ichika textures (her avatar + every frame of her Runway clip) are loaded once, before the first frame is drawn.
const CACHE = new Map<string, THREE.Texture>();
const CLIP_FRAMES = 151;
const clipSrc = (n: number) => staticFile(`ichika_clip/${String(Math.min(CLIP_FRAMES, Math.max(1, n))).padStart(4, '0')}.jpg`);
const ALL = [staticFile('ichika_avatar.png'), ...Array.from({ length: CLIP_FRAMES }, (_, i) => clipSrc(i + 1))];
export const usePreload = () => {
  const [ready, setReady] = useState(ALL.every((s) => CACHE.has(s)));
  useLayoutEffect(() => {
    if (ready) return;
    const handle = delayRender('ichika textures');
    const loader = new THREE.TextureLoader();
    Promise.all(ALL.map((src) => new Promise<void>((res) => loader.load(src, (t) => { t.colorSpace = THREE.SRGBColorSpace; CACHE.set(src, t); res(); }, undefined, () => res()))))
      .then(() => { setReady(true); continueRender(handle); });
  }, [ready]);
  return ready;
};
const tex = (src: string) => CACHE.get(src) ?? null;

const Room: React.FC<{ t: number }> = ({ t }) => {
  const grid = useMemo(() => { const g = new THREE.GridHelper(40, 40, '#ff5fb0', '#4a3a80'); (g.material as THREE.Material).transparent = true; (g.material as THREE.Material).opacity = 0.55; return g; }, []);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[40, 40]} /><meshStandardMaterial color="#1f1838" roughness={0.55} metalness={0.2} /></mesh>
      <primitive object={grid} position={[0, 0.005, 0]} />
      <mesh position={[0, 5, -5]}><planeGeometry args={[40, 12]} /><meshStandardMaterial color="#2a2052" roughness={0.9} /></mesh>
      {/* neon strips on the back wall */}
      {[[0, 3.6, '#ff5fb0', 14], [0, 0.6, '#3be0ff', 14]].map(([x, y, c, w], i) => (
        <mesh key={i} position={[x as number, y as number, -4.95]}><boxGeometry args={[w as number, 0.08, 0.05]} /><meshStandardMaterial color={c as string} emissive={c as string} emissiveIntensity={2.2} toneMapped={false} /></mesh>
      ))}
      {[-4.2, 4.2].map((x, i) => (
        <mesh key={x} position={[x, 2.1, -4.95]}><boxGeometry args={[0.08, 3.0, 0.05]} /><meshStandardMaterial color={i ? '#3be0ff' : '#ff5fb0'} emissive={i ? '#3be0ff' : '#ff5fb0'} emissiveIntensity={2} toneMapped={false} /></mesh>
      ))}
      {/* floating props */}
      {[[-3.3, 3.0, -2.5, '#ff5fb0'], [3.4, 3.4, -2.8, '#3be0ff'], [-3.8, 1.2, -1.5, '#ffd34d'], [3.6, 1.0, -1.2, '#b066ff']].map(([x, y, z, c], i) => (
        <mesh key={i} position={[x as number, (y as number) + Math.sin(t * 1.2 + i) * 0.15, z as number]} rotation={[t * 0.4 + i, t * 0.6 + i, 0]} castShadow>
          {i % 2 ? <octahedronGeometry args={[0.32]} /> : <boxGeometry args={[0.42, 0.42, 0.42]} />}
          <meshStandardMaterial color={c as string} emissive={c as string} emissiveIntensity={0.5} roughness={0.3} />
        </mesh>
      ))}
      {/* stage disc */}
      <mesh position={[0, 0.03, 0]} receiveShadow><cylinderGeometry args={[1.6, 1.7, 0.06, 48]} /><meshStandardMaterial color="#2c2350" roughness={0.4} metalness={0.3} /></mesh>
      <mesh position={[0, 0.065, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[1.55, 1.62, 64]} /><meshBasicMaterial color="#ff8fc7" toneMapped={false} /></mesh>
    </group>
  );
};

const CameraRig: React.FC<{ t: number }> = ({ t }) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const z = zoomAt(t);
  const k = z ? z.k * clamp((z.e.zoom! - 1) / 0.5) : 0;
  useLayoutEffect(() => {
    const fov = 34, d = 13.4 - 4.0 * k;            // punch-zoom = dolly in
    const H = 2 * d * Math.tan((fov / 2) * Math.PI / 180); // world height visible at the stage
    const cy = 1.55, lookY = cy - 0.205 * H;          // speaker's chest lands at ~y=565px (between hook and chat)
    const sway = Math.sin(t * 0.35) * 0.6;
    camera.fov = fov;
    camera.position.set(sway, 2.4, d);
    camera.lookAt(sway * 0.4, lookY, 0);
    camera.updateProjectionMatrix();
  }, [camera, t, k]);
  return null;
};

const IchikaClip: React.FC<{ t: number; talk: number; n: number }> = ({ t, talk, n }) => <IchikaScreen tex={tex(clipSrc(n))} t={t} talk={talk} />;

const Speaker: React.FC<{ who: string; t: number; still: THREE.Texture | null }> = ({ who, t, still }) => {
  const talk = talking(who, t);
  const p = { talk, blink: blinkAt(t, who.length * 0.37), t };
  if (who === 'kevin') return <Kevin {...p} />;
  if (who === 'gerald') {
    const tip = EV.filter((e) => e.who === 'gerald' && e.say?.startsWith('tips fedora') && e.vs !== undefined)
      .reduce((m, e) => Math.max(m, Math.sin(Math.PI * prog(t, e.vs!, e.vs! + 1.1))), 0);
    return <Gerald {...p} tip={tip} />;
  }
  if (who === 'grandma') return <Grandma {...p} />;
  if (who === 'bot') return <Bot {...p} />;
  if (who === 'dave') return <Dave {...p} />;
  if (who === 'mom') return <Mom {...p} />;
  if (who === 'ichika') {
    // play the real clip while she talks, still picture otherwise
    const line = EV.find((e) => e.who === 'ichika' && e.vs !== undefined && t >= e.t0 && t <= e.t1 + 0.4);
    if (line) {
      const n = Math.round(((line.clipStart ?? 0.6) + (t - line.t0)) * FPS) + 1;
      return <IchikaClip t={t} talk={talk} n={n} />;
    }
    return <IchikaScreen tex={still} t={t} talk={talk} />;
  }
  return null;
};

export const World: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const still = tex(staticFile('ichika_avatar.png'));
  const st = stageAt(t);
  const enter = eBack(prog(t, st.since, st.since + 0.35));
  const exitPrev = 1 - eOut(prog(t, st.since, st.since + 0.22));
  const bob = Math.sin(t * 2.4) * 0.04;
  // ban hammer
  const ban = EV.find((e) => e.hammer && t >= e.t0 && t < e.t0 + 1.1);
  const banK = ban ? t - ban.t0 : -1;
  const squash = banK >= 0.18 && banK < 0.9 ? 0.55 + 0.45 * eOut(prog(banK, 0.5, 0.9)) : 1;
  // leaving (rockets away)
  const lk = st.leave ? prog(t, st.leaveAt + 0.15, st.leaveAt + 0.75) : 0;
  return (
    <>
      <color attach="background" args={['#160f2c']} />
      <fog attach="fog" args={['#160f2c', 9, 22]} />
      <CameraRig t={t} />
      <ambientLight intensity={0.9} />
      <hemisphereLight args={['#ffe6f5', '#2a1a55', 0.9]} />
      <directionalLight position={[0, 3, 12]} intensity={1.3} color="#fff4fb" />
      <directionalLight position={[3, 7, 5]} intensity={2.1} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={5} shadow-camera-bottom={-2} />
      <pointLight position={[-3, 3, 3]} color="#ff5fb0" intensity={30} distance={0} decay={1.6} />
      <pointLight position={[3, 3, 3]} color="#3be0ff" intensity={26} distance={0} decay={1.6} />
      <spotLight position={[0, 6, 3]} angle={0.45} penumbra={0.6} intensity={30} color="#fff2fa" />
      <Room t={t} />
      {st.prev !== 'none' && exitPrev > 0.01 && (
        <group position={[0, -2.6 * (1 - exitPrev), 0]} scale={Math.max(0.01, exitPrev)}>
          <Speaker who={st.prev} t={t} still={still} />
        </group>
      )}
      {st.who !== 'none' && (
        <group
          position={[lk * 6, 0.07 + bob + lk * lk * 7, lk * -2]}
          rotation={[0, Math.sin(t * 0.8) * 0.12 + lk * 8, lk * 2]}
          scale={[Math.max(0.01, enter) * (2 - squash), Math.max(0.01, enter) * squash, Math.max(0.01, enter)]}
        >
          <Speaker who={st.who} t={t} still={still} />
        </group>
      )}
      {ban && <Hammer k={banK} />}
    </>
  );
};
