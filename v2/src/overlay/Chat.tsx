// Discord-style chat window (fictional app "Yapp"; no real logos), drawn as a 2D layer over the 3D world.
import React from 'react';
import { Img, staticFile } from 'remotion';
import { AV } from '../avatars';
import { CAST, EV, Ev, TL, eBack, eOut, namesAt, prog, current } from '../state';
import castJson from '../../cast.json';

export const PANEL = { x: 22, y: 770, w: 930, h: 840 };
const F = 'Inter, "Noto Color Emoji", sans-serif';

export const Avatar: React.FC<{ who: string; size: number }> = ({ who, size }) =>
  who === 'ichika' ? (
    <Img src={staticFile('ichika_avatar.png')} style={{ width: size, height: size, borderRadius: '50%', display: 'block', border: '3px solid #111' }} />
  ) : (
    <div style={{ width: size, height: size }} dangerouslySetInnerHTML={{ __html: AV[who]().replace('<svg', `<svg width="${size}" height="${size}"`) }} />
  );

const fmt = (s: string) => s.split(/(@\w+)/g).map((p, i) => p.startsWith('@')
  ? <span key={i} style={{ background: 'rgba(88,101,242,.3)', color: '#c9cdfb', borderRadius: 6, padding: '0 6px', fontWeight: 600 }}>{p}</span> : p);

export const MessageRow: React.FC<{ e: Ev; names: Record<string, string>; scale?: number; t: number; showHead?: boolean }> = ({ e, names, scale = 1, t, showHead = true }) => {
  const s = scale;
  const c = CAST[e.who!];
  const reacts = EV.filter((r) => r.t === 'react' && r.t0 <= t && lastMsgBefore(r) === e);
  const mention = /@ichika/i.test(e.text ?? '');
  return (
    <div style={{ display: 'flex', gap: 20 * s, padding: `${(showHead ? 12 : 2) * s}px ${22 * s}px ${4 * s}px ${18 * s}px`, position: 'relative', flexWrap: 'wrap',
      background: mention ? 'rgba(240,178,50,.10)' : undefined, boxShadow: mention ? 'inset 6px 0 0 #f0b232' : undefined }}>
      {e.reply && (
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10 * s, paddingLeft: 52 * s, fontSize: 24 * s, color: '#b5bac1', height: 36 * s, marginBottom: -4 * s }}>
          <div style={{ width: 48 * s, height: 18 * s, borderLeft: '4px solid #4e5058', borderTop: '4px solid #4e5058', borderTopLeftRadius: 12, marginTop: 14 * s }} />
          <Avatar who={e.reply} size={30 * s} />
          <b style={{ color: CAST[e.reply].color }}>@{names[e.reply]}</b>
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 420 * s }}>{prevText(e)}</span>
        </div>
      )}
      <div style={{ width: 84 * s, flex: 'none', visibility: showHead ? 'visible' : 'hidden', height: showHead ? 84 * s : 0 }}>{showHead && <Avatar who={e.who!} size={84 * s} />}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {showHead && (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 * s }}>
            <span style={{ fontSize: 34 * s, fontWeight: 700, color: c.color }}>{names[e.who!]}</span>
            {c.tag && <span style={{ fontSize: 20 * s, fontWeight: 800, background: '#5865f2', color: '#fff', padding: `${2 * s}px ${9 * s}px`, borderRadius: 6, position: 'relative', top: -4 * s }}>{c.tag}</span>}
            <span style={{ fontSize: 22 * s, color: '#949ba4' }}>{e.time ?? TL.time}</span>
          </div>
        )}
        {e.text && <div style={{ fontSize: (e.big ? 84 : 42) * s, fontWeight: e.big ? 900 : 400, color: '#dbdee1', lineHeight: 1.27, wordWrap: 'break-word' }}>{fmt(e.text)}</div>}
        {e.img && (
          <div style={{ margin: `${8 * s}px 0`, width: 520 * s, height: 300 * s, borderRadius: 14, background: e.img.bg ?? '#f4f1ea', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 170 * s, position: 'relative' }}>
            {e.img.emoji}
            <div style={{ position: 'absolute', bottom: 10 * s, width: '100%', textAlign: 'center', fontSize: 40 * s, fontWeight: 900, color: '#fff', WebkitTextStroke: '3px #000', paintOrder: 'stroke fill' }}>{e.img.cap}</div>
          </div>
        )}
        {reacts.length > 0 && (
          <div style={{ display: 'flex', gap: 10 * s, margin: `${6 * s}px 0` }}>
            {groupReacts(reacts, t).map(([em, n]) => (
              <span key={em} style={{ background: 'rgba(88,101,242,.15)', border: '3px solid #5865f2', borderRadius: 14, padding: `${2 * s}px ${14 * s}px`, fontSize: 32 * s, fontWeight: 700, color: '#dee0fc', display: 'flex', gap: 10 * s }}>
                {em}<span>{n}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const lastMsgBefore = (r: Ev) => { let m: Ev | null = null; for (const e of EV) { if (e === r) break; if (e.t === 'msg') m = e; } return m; };
const prevText = (e: Ev) => { let m: Ev | null = null; for (const x of EV) { if (x === e) break; if (x.t === 'msg' && x.who === e.reply) m = x; } return m?.text ?? ''; };
const groupReacts = (rs: Ev[], t: number) => {
  const g: Record<string, number> = {};
  for (const r of rs) g[r.emoji!] = (g[r.emoji!] ?? 0) + Math.min(r.n ?? 1, Math.floor((t - r.t0) / 0.09) + 1);
  return Object.entries(g);
};

export const SysRow: React.FC<{ e: Ev; scale?: number }> = ({ e, scale = 1 }) => {
  const s = scale;
  const col = { red: '#f23f43', gold: '#f0b232', blue: '#00a8fc', green: '#949ba4', later: '#ffffff' }[e.tone ?? ''] ?? '#949ba4';
  if (e.tone === 'later') return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 * s, padding: `${16 * s}px ${26 * s}px`, color: '#fff', fontSize: 40 * s, fontWeight: 900, letterSpacing: 2 }}>
      <div style={{ flex: 1, height: 3, background: '#3f4147' }} />{e.icon} {e.text}<div style={{ flex: 1, height: 3, background: '#3f4147' }} />
    </div>
  );
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18 * s, padding: `${12 * s}px ${26 * s}px ${12 * s}px ${44 * s}px`, fontSize: 32 * s, color: col, fontWeight: e.tone === 'green' ? 500 : 700 }}>
      <span style={{ fontSize: 34 * s, width: 46 * s, textAlign: 'center', color: e.tone === 'green' ? '#23a55a' : undefined }}>{e.icon}</span>
      <span>{e.text}</span>
    </div>
  );
};

const RAIL = ['🎮', '🍕', '📚', '🌙', '🐸'];

export const Chat: React.FC<{ t: number }> = ({ t }) => {
  const names = namesAt(t);
  const items = EV.filter((e) => (e.t === 'msg' || e.t === 'sys') && e.t0 <= t);
  const cur = current(t);
  const nxt = EV.find((e) => e.t0 > t && (e.t === 'msg'));
  const typingWho = cur?.t === 'typing' ? cur.who : (nxt && nxt.who && nxt.t0 - t < 0.3 && nxt.t0 - t > 0 ? nxt.who : null);
  const appear = eBack(prog(t, 0, 0.45));
  return (
    <div style={{ position: 'absolute', left: PANEL.x, top: PANEL.y, width: PANEL.w, height: PANEL.h, display: 'flex', borderRadius: 30, overflow: 'hidden',
      boxShadow: '0 30px 80px rgba(0,0,0,.55), 0 0 0 3px rgba(255,143,199,.35)', fontFamily: F, transform: `translateY(${(1 - appear) * 300}px)`, opacity: Math.min(1, appear * 2) }}>
      <div style={{ width: 92, flex: 'none', background: '#1e1f22', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, paddingTop: 16 }}>
        <div style={{ width: 66, height: 66, borderRadius: 22, background: '#5865f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 40 40" width="38" height="38"><path d="M6 10 Q6 5 11 5 H29 Q34 5 34 10 V22 Q34 27 29 27 H17 L9 34 V27 Q6 26 6 22 Z" fill="#fff" /></svg>
        </div>
        <div style={{ width: 40, height: 3, background: '#35363c', borderRadius: 2 }} />
        {RAIL.map((r, i) => (
          <div key={r} style={{ width: 66, height: 66, borderRadius: i === 0 ? 22 : 33, background: i === 0 ? '#ff8fc7' : '#313338', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, position: 'relative' }}>
            {r}{i === 1 && <span style={{ position: 'absolute', right: -6, bottom: -6, background: '#f23f43', color: '#fff', fontSize: 18, fontWeight: 800, border: '5px solid #1e1f22', borderRadius: 16, padding: '0 6px' }}>3</span>}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, background: 'rgba(49,51,56,.97)', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{ height: 82, flex: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '0 24px', borderBottom: '3px solid #26272b', color: '#f2f3f5' }}>
          <span style={{ fontSize: 46, color: '#80848e' }}>#</span><span style={{ fontSize: 34, fontWeight: 700 }}>{castJson.app.channel}</span>
          <span style={{ width: 3, height: 30, background: '#3f4147', margin: '0 4px' }} />
          <span style={{ fontSize: 24, color: '#b5bac1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>{castJson.app.topic}</span>
        </div>
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 12 }}>
          {items.map((e, idx) => {
            const p = prog(t, e.t0, e.t0 + 0.2);
            const ez = eOut(p);
            const style: React.CSSProperties = { transform: `translateY(${(1 - ez) * 40}px) scale(${0.85 + 0.15 * eBack(p)})`, transformOrigin: 'left center', opacity: Math.min(1, p * 3) };
            const prev = items[idx - 1];
            const showHead = !(prev && prev.t === 'msg' && prev.who === e.who && !e.reply && e.t0 - prev.t0 < 20);
            return <div key={e.i} style={style}>{e.t === 'sys' ? <SysRow e={e} /> : <MessageRow e={e} names={names} t={t} showHead={showHead} />}</div>;
          })}
        </div>
        <div style={{ height: 96, flex: 'none', margin: '0 18px 6px', background: '#383a40', borderRadius: 16, display: 'flex', alignItems: 'center', padding: '0 22px', gap: 18, fontSize: 32, color: '#6d6f78' }}>
          <span style={{ width: 44, height: 44, borderRadius: '50%', background: '#b5bac1', color: '#383a40', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 700 }}>+</span>
          <span style={{ flex: 1 }}>Message #{castJson.app.channel}</span>
          <span style={{ border: '3px solid #b5bac1', color: '#b5bac1', fontSize: 18, fontWeight: 900, borderRadius: 6, padding: '1px 5px' }}>GIF</span>
        </div>
        <div style={{ height: 44, flex: 'none', padding: '0 26px', fontSize: 24, color: '#dbdee1', display: 'flex', alignItems: 'center', gap: 10 }}>
          {typingWho && (<>
            <span style={{ display: 'flex', gap: 5 }}>{[0, 1, 2].map((k) => <span key={k} style={{ width: 10, height: 10, borderRadius: 5, background: '#dbdee1', opacity: Math.floor(t * 6) % 3 === k ? 1 : 0.3 }} />)}</span>
            <span><b>{names[typingWho]}</b> is typing...</span>
          </>)}
        </div>
      </div>
    </div>
  );
};
