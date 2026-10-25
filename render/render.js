// Render an episode script (JSON) into a vertical 1080x1920 Short with hype effects.
// Usage: node render/render.js episodes/ep001.json [output/ep001.mp4]
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');

const FPS = 30;
const ROOT = path.resolve(__dirname, '..');
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const ease = (p) => 1 - Math.pow(1 - p, 3);

async function main() {
  const epPath = path.resolve(process.argv[2]);
  const ep = JSON.parse(fs.readFileSync(epPath, 'utf8'));
  const id = path.basename(epPath, '.json');
  const out = path.resolve(process.argv[3] || path.join(ROOT, 'output', `${id}.mp4`));
  const work = path.join(ROOT, 'output', '.work', id);
  fs.rmSync(work, { recursive: true, force: true });
  fs.mkdirSync(path.join(work, 'uniq'), { recursive: true });
  fs.mkdirSync(path.join(work, 'seq'), { recursive: true });

  const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'characters.json'), 'utf8'));
  const chars = {};
  for (const [k, v] of Object.entries(cfg.characters)) chars[k] = { name: v.name, color: v.color, avatar: v.avatar, crown: false, tag: v.tag || '' };

  const st = { hook: ep.hook, topic: ep.topic || 'no creeps allowed (this means you kevin)', server: ep.server || cfg.app.server, chars, items: [], typing: null, anim: null,
    shake: 0, flash: 0, fry: 0, cam: null, closeup: null, impact: null, burst: null, glitch: 0 };
  const defTime = ep.time || 'Today at 3:14 AM';

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + path.join(__dirname, 'template.html'));
  await page.evaluate(() => document.fonts.ready);

  let frame = 0, uniq = 0;
  const sfx = [];
  const S = (k, extra = {}) => sfx.push({ t: frame / FPS, k, ...extra });
  const sec = (s) => Math.max(1, Math.round(s * FPS));

  async function emit(n = 1) {
    if (n <= 0) return;
    await page.evaluate((s) => window.render(s), st);
    await page.evaluate(() => Promise.all([...document.images].filter((i) => !i.complete)
      .map((i) => new Promise((r) => { i.onload = i.onerror = r; }))));
    const f = path.join(work, 'uniq', `${String(uniq++).padStart(5, '0')}.jpg`);
    await page.screenshot({ path: f, type: 'jpeg', quality: 90 });
    for (let i = 0; i < n; i++) fs.symlinkSync(f, path.join(work, 'seq', `${String(frame++).padStart(6, '0')}.jpg`));
  }
  async function hold(s) {
    let n = sec(s);
    if (st.typing) { while (n > 0) { const k = Math.min(6, n); await emit(k); st.typing.phase++; n -= k; } }
    else await emit(n);
  }
  async function pop(idx, steps = 6) {
    for (let i = 1; i <= steps; i++) { st.anim = { idx, p: i / steps }; await emit(1); }
    st.anim = null;
  }
  async function shake(n = 12, power = 1, flash = 0.4) {
    for (let i = 0; i < n; i++) {
      st.shake = (i + 1) * power * (1 - i / n) + 0.0001;
      st.flash = i < 2 ? flash * (1 - i * 0.6) : 0;
      await emit(1);
    }
    st.shake = 0; st.flash = 0;
  }
  async function zoomTo(idx, z, frames = 6) {
    for (let i = 1; i <= frames; i++) { st.cam = { idx, z, k: ease(i / frames) }; await emit(1); }
  }
  async function zoomOut(frames = 5) {
    if (!st.cam) return;
    const { idx, z } = st.cam;
    for (let i = frames - 1; i >= 0; i--) { st.cam = { idx, z, k: ease(i / frames) }; await emit(1); }
    st.cam = null;
  }
  async function fryHold(s) {
    const n = sec(s);
    for (let i = 0; i < n; i++) { st.fry = 1; st.shake = 0.35 + (i % 3) * 0.1; await emit(1); }
    st.fry = 0; st.shake = 0;
  }
  function lastItem(who) {
    for (let i = st.items.length - 1; i >= 0; i--) {
      const it = st.items[i];
      if (it.type === 'msg' && (!who || it.who === who)) return [it, i];
    }
    return [st.items[st.items.length - 1], st.items.length - 1];
  }
  async function effects(ev, idx) {
    // shared punch effects for msg/sys events
    if (ev.zoom) { S('whoosh'); await zoomTo(idx, ev.zoom); }
    if (ev.shake) await shake(ev.shake === true ? 12 : ev.shake, 1, ev.flash ?? 0.45);
    if (ev.burst) { await burst(ev.burst, 1.2); }
    if (ev.fry) { await fryHold(ev.fry === true ? 1.2 : ev.fry); }
  }
  async function burst(emoji, s) {
    const n = sec(s);
    S('pops', { d: s });
    for (let i = 1; i <= n; i++) { st.burst = { emoji, p: i / n, seed: frame }; st.burst.seed = 7; await emit(1); }
    st.burst = null;
  }

  await hold(ep.intro ?? 0.3);
  for (const ev of ep.events) {
    switch (ev.t) {
      case 'msg': {
        const text = ev.text || '';
        const words = text ? text.split(/\s+/).length : 3;
        const typeS = ev.typing ?? clamp(0.18 + text.length * 0.009, 0.3, 0.9);
        if (typeS > 0) {
          st.typing = { names: [chars[ev.who].name], phase: 0 };
          S('type', { d: typeS });
          await hold(typeS);
          st.typing = null;
        }
        let reply = null;
        if (ev.reply) {
          const rw = typeof ev.reply === 'string' ? ev.reply : ev.reply.who;
          const [rm] = lastItem(rw);
          reply = { who: rw, text: (ev.reply.text) || (rm && rm.text) || '' };
        }
        st.items.push({ type: 'msg', who: ev.who, text, img: ev.img, big: !!ev.big, time: ev.time || defTime, reply,
          mentionsMain: /@ichika/i.test(text) });
        const idx = st.items.length - 1;
        S(ev.sfx || (ev.big ? 'boom' : 'ping'));
        await pop(idx);
        await effects(ev, idx);
        await hold(ev.hold ?? clamp(0.4 + words * 0.17, 0.65, 2.6));
        if (st.cam && !ev.keepZoom) await zoomOut();
        break;
      }
      case 'sys': {
        st.items.push({ type: 'sys', text: ev.text, icon: ev.icon, tone: ev.tone });
        const idx = st.items.length - 1;
        S(ev.sfx || ({ red: 'ban', gold: 'level', green: 'join', later: 'sting', blue: 'glitch' }[ev.tone] || 'join'));
        await pop(idx);
        await effects(ev, idx);
        await hold(ev.hold ?? 1.0);
        if (st.cam && !ev.keepZoom) await zoomOut();
        break;
      }
      case 'react': {
        const [m] = lastItem(ev.who);
        m.reacts = m.reacts || [];
        let r = m.reacts.find((x) => x.emoji === ev.emoji);
        if (!r) { r = { emoji: ev.emoji, n: 0 }; m.reacts.push(r); }
        while (r.n < (ev.n || 1)) { r.n++; S('react'); await emit(2); }
        await hold(ev.hold ?? 0.35);
        break;
      }
      case 'delete': { lastItem(ev.who)[0].deleted = true; S('whoosh'); await hold(ev.hold ?? 0.8); break; }
      case 'edit': { const [m] = lastItem(ev.who); m.text = ev.text; m.edited = true; S('pop'); await hold(ev.hold ?? 1); break; }
      case 'set': { Object.assign(chars[ev.who], ev.props); if (ev.sfx) S(ev.sfx); if (ev.hold) await hold(ev.hold); break; }
      case 'typing': {
        st.typing = { names: [].concat(ev.who).map((w) => chars[w].name), phase: 0 };
        S('type', { d: ev.s });
        await hold(ev.s);
        st.typing = null;
        if (ev.after) await hold(ev.after);
        break;
      }
      case 'pause': await hold(ev.s); break;
      case 'mute': S('mute', { d: ev.s }); if (ev.hold) await hold(ev.hold); break;
      case 'shake': S(ev.sfx || 'boom'); await shake(ev.n || 12); break;
      case 'zoom': { const [, i] = lastItem(ev.who); S('whoosh'); await zoomTo(i, ev.z || 1.8); await hold(ev.hold ?? 1); if (!ev.keep) await zoomOut(); break; }
      case 'burst': await burst(ev.emoji, ev.s || 1.2); break;
      case 'glitch': {
        S('glitch', { d: ev.s || 0.8 });
        const n = sec(ev.s || 0.8);
        for (let i = 0; i < n; i++) { st.glitch = (i % 4) + 1 + i * 0.37; st.shake = 0.4; await emit(1); }
        st.glitch = 0; st.shake = 0;
        break;
      }
      case 'impact': {
        S(ev.sfx || 'boom');
        const n = sec(ev.hold ?? 1.3);
        for (let i = 0; i < n; i++) {
          const p = Math.min(1, (i + 1) / 5);
          st.impact = { text: ev.text, color: ev.color, p, wob: Math.sin(i * 1.3) * 2 };
          st.shake = i < 10 ? (10 - i) / 10 : 0; st.fry = ev.fry ? 1 : 0; st.flash = i < 2 ? 0.5 - i * 0.25 : 0;
          await emit(1);
        }
        st.impact = null; st.shake = 0; st.fry = 0; st.flash = 0;
        break;
      }
      case 'closeup': {
        S(ev.sfx || 'boom');
        const n = sec(ev.hold ?? 1.6);
        for (let i = 0; i < n; i++) {
          const p = Math.min(1, (i + 1) / 5);
          st.closeup = { who: ev.who, text: ev.text, bg: ev.bg, p, fry: !!ev.fry, pulse: ev.fry ? Math.sin(i * 1.7) * 0.03 : 0, tilt: ev.fry ? Math.sin(i * 0.9) * 4 : 0 };
          if (ev.clip) {
            // play the character's animated clip (e.g. assets/ichika_clip/0001.jpg ...) instead of the still avatar
            const dir = path.join(ROOT, 'assets', `${ev.who}_clip`);
            const count = fs.readdirSync(dir).length;
            const k = Math.min(count, Math.round((ev.clipStart || 0) * FPS) + i + 1);
            st.closeup.img = 'file://' + path.join(dir, `${String(k).padStart(4, '0')}.jpg`);
            st.closeup.pulse = 0; st.closeup.tilt = 0;
          }
          st.shake = ev.fry ? 0.5 : (ev.clip ? 0 : (i < 8 ? (8 - i) / 8 : 0));
          await emit(1);
        }
        st.closeup = null; st.shake = 0;
        break;
      }
      default: throw new Error('unknown event ' + ev.t);
    }
  }
  await hold(ep.outro ?? 1.2);
  await browser.close();

  const dur = frame / FPS;
  fs.writeFileSync(path.join(work, 'sfx.json'), JSON.stringify({ duration: dur, events: sfx, music: ep.music || 'hype' }));
  execFileSync('python3', [path.join(__dirname, 'audio.py'), path.join(work, 'sfx.json'), path.join(work, 'audio.wav')], { stdio: 'inherit' });
  fs.mkdirSync(path.dirname(out), { recursive: true });
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(work, 'seq', '%06d.jpg'),
    '-i', path.join(work, 'audio.wav'), '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out], { stdio: 'inherit' });
  console.log(`done ${out}  ${dur.toFixed(1)}s  ${uniq} unique frames`);
}

main().catch((e) => { console.error(e); process.exit(1); });
