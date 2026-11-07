// 2D effects on top: hook card, punch-zoom focus card, close-ups with Ichika's real clip, emoji bursts, flash.
import React from 'react';
import { OffthreadVideo, Sequence, staticFile } from 'remotion';
import { EV, FPS, TL, Ev, eBack, eOut, prog, namesAt, zoomAt, clamp } from '../state';
import { MessageRow, SysRow, PANEL } from './Chat';

const F = 'Inter, "Noto Color Emoji", sans-serif';
const rnd = (s: number) => { const x = Math.sin(s * 9301 + 49297) * 233280; return x - Math.floor(x); };

export const Hook: React.FC<{ t: number }> = ({ t }) => {
  const k = eBack(prog(t, 0, 0.4));
  return (
    <div style={{ position: 'absolute', left: 40, right: 150, top: 52, display: 'flex', justifyContent: 'center', fontFamily: F }}>
      <div style={{ background: '#fff', color: '#111214', fontWeight: 900, fontSize: 50, lineHeight: 1.06, textAlign: 'center', padding: '16px 28px', borderRadius: 24,
        border: '6px solid #111214', boxShadow: '10px 10px 0 #ff8fc7', transform: `scale(${k}) rotate(-1.5deg)` }}>{TL.hook}</div>
    </div>
  );
};

/** The punchline "camera zoom": the line jumps out of the chat, big, over a dimmed screen. */
export const Focus: React.FC<{ t: number }> = ({ t }) => {
  const z = zoomAt(t);
  if (!z) return null;
  const { e, k } = z;
  const s = 1 + (e.zoom! - 1) * 1.1;
  const pop = eBack(prog(t, e.t0, e.t0 + 0.2));
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: `rgba(10,6,24,${0.45 * k})` }} />
      <div style={{ position: 'absolute', left: 14, width: 1052 - 120, top: PANEL.y + PANEL.h * 0.42, transform: `translateY(-50%) scale(${0.7 + 0.3 * pop})`, opacity: k, fontFamily: F,
        background: '#313338', borderRadius: 26, boxShadow: '0 0 0 4px #ff8fc7, 0 30px 90px rgba(0,0,0,.7)', padding: '14px 0', transformOrigin: 'center' }}>
        {e.t === 'sys' ? <SysRow e={e} scale={s} /> : <MessageRow e={e} names={namesAt(t)} t={t} scale={s * 0.86} />}
      </div>
    </>
  );
};

export const Closeups: React.FC<{ t: number }> = ({ t }) => (
  <>
    {EV.filter((e) => e.t === 'closeup').map((e) => {
      const from = Math.round(e.t0 * FPS), dur = Math.round((e.t1 - e.t0) * FPS);
      const active = t >= e.t0 && t < e.t1;
      return (
        <Sequence key={e.i} from={from} durationInFrames={dur} layout="none">
          {active && <CloseupCard e={e} t={t} />}
        </Sequence>
      );
    })}
  </>
);

const CloseupCard: React.FC<{ e: Ev; t: number }> = ({ e, t }) => {
  const k = eBack(prog(t, e.t0, e.t0 + 0.3));
  const out = prog(t, e.t1 - 0.15, e.t1);
  const words = (e.text ?? '').split(' ');
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 42%, #ffc2e2 0%, #b04a8c 45%, #2a0f30 85%)', opacity: 1 - out, fontFamily: F,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 46 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-conic-gradient(from 0deg at 50% 42%, rgba(255,255,255,.07) 0deg 8deg, transparent 8deg 20deg)', transform: `rotate(${t * 8}deg) scale(1.6)` }} />
      <div style={{ width: 820, height: 820, borderRadius: 60, overflow: 'hidden', border: '12px solid #fff', boxShadow: '0 30px 90px rgba(0,0,0,.5)', transform: `scale(${0.6 + 0.4 * k}) rotate(${(1 - k) * -6}deg)`, marginTop: -120 }}>
        <OffthreadVideo src={staticFile('ichika.mp4')} startFrom={Math.round((e.clipStart ?? 0) * FPS)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ fontSize: 86, fontWeight: 900, color: '#fff', WebkitTextStroke: '10px #1a0b1f', paintOrder: 'stroke fill', textAlign: 'center', maxWidth: 900, lineHeight: 1.05 }}>
        {words.map((w, i) => {
          const a = prog(t, e.t0 + 0.25 + i * 0.09, e.t0 + 0.45 + i * 0.09);
          return <span key={i} style={{ display: 'inline-block', transform: `scale(${eBack(a)})`, opacity: clamp(a * 3), marginRight: 22 }}>{w}</span>;
        })}
      </div>
    </div>
  );
};

export const Bursts: React.FC<{ t: number }> = ({ t }) => (
  <>
    {EV.filter((e) => e.t === 'burst' && t >= e.t0 && t < e.t0 + 1.4).map((e) => {
      const p = (t - e.t0) / 1.4;
      return Array.from({ length: 16 }).map((_, i) => {
        const x = rnd(i + 1) * 1000, y0 = 1950 + rnd(i * 3) * 250, sp = 1700 + rnd(i * 7) * 900;
        const y = y0 - sp * p + 1100 * p * p;
        return <span key={e.i + '-' + i} style={{ position: 'absolute', left: x, top: y, fontSize: 90 + rnd(i * 5) * 80, transform: `rotate(${(rnd(i * 11) - 0.5) * 400 * p}deg)` }}>{e.emoji}</span>;
      });
    })}
  </>
);

export const Flash: React.FC<{ t: number }> = ({ t }) => {
  let a = 0;
  for (const e of EV) if (e.shake && t >= e.t0 && t < e.t0 + 0.15) a = Math.max(a, 0.55 * (1 - (t - e.t0) / 0.15));
  return a > 0 ? <div style={{ position: 'absolute', inset: 0, background: '#fff', opacity: a }} /> : null;
};

export const LaterCard: React.FC<{ t: number }> = ({ t }) => {
  const e = EV.find((x) => x.tone === 'later' && t >= x.t0 && t < x.t1);
  if (!e) return null;
  const k = eBack(prog(t, e.t0, e.t0 + 0.3)), out = 1 - eOut(prog(t, e.t1 - 0.2, e.t1));
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 380, display: 'flex', justifyContent: 'center', fontFamily: F }}>
      <div style={{ fontSize: 110, fontWeight: 900, color: '#ffd34d', WebkitTextStroke: '12px #1a0b1f', paintOrder: 'stroke fill', transform: `scale(${k * out}) rotate(-4deg)` }}>{e.text}</div>
    </div>
  );
};
