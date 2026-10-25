// Render an episode script (JSON) into a vertical 1080x1920 Short.
// Usage: node render/render.js episodes/ep001.json [output/ep001.mp4]
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');

const FPS = 30;
const ROOT = path.resolve(__dirname, '..');

function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
function clone(o) { return JSON.parse(JSON.stringify(o)); }

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
  for (const [k, v] of Object.entries(cfg.characters)) chars[k] = { name: v.name, color: v.color, avatar: v.avatar, crown: false, tag: '' };

  const st = { hook: ep.hook, server: cfg.app.server, chars, items: [], typing: null, anim: null, shake: 0, flash: 0 };
  const time = ep.time || 'Today at 3:14 AM';

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + path.join(__dirname, 'template.html'));
  await page.evaluate(() => document.fonts.ready);

  let frame = 0, uniq = 0;
  const sfx = [];
  async function emit(n) {
    if (n <= 0) return;
    await page.evaluate((s) => window.render(s), st);
    const f = path.join(work, 'uniq', `${String(uniq++).padStart(5, '0')}.jpg`);
    await page.screenshot({ path: f, type: 'jpeg', quality: 90 });
    for (let i = 0; i < n; i++) {
      fs.symlinkSync(f, path.join(work, 'seq', `${String(frame++).padStart(6, '0')}.jpg`));
    }
  }
  const sec = (s) => Math.max(1, Math.round(s * FPS));
  const now = () => frame / FPS;

  async function hold(s) {
    // keep typing dots animated during holds
    let n = sec(s);
    if (st.typing) {
      while (n > 0) { const k = Math.min(8, n); await emit(k); st.typing.phase++; n -= k; }
    } else await emit(n);
  }
  async function pop(idx) {
    const steps = 7;
    for (let i = 1; i <= steps; i++) { st.anim = { idx, p: i / steps }; await emit(1); }
    st.anim = null;
  }
  function lastMsg(who) {
    for (let i = st.items.length - 1; i >= 0; i--) {
      const it = st.items[i];
      if (it.type === 'msg' && (!who || it.who === who)) return it;
    }
  }

  await hold(ep.intro ?? 0.6);
  for (const ev of ep.events) {
    switch (ev.t) {
      case 'msg': {
        const text = ev.text;
        const words = text.split(/\s+/).length;
        const typeS = ev.typing ?? clamp(0.3 + text.length * 0.015, 0.45, 1.4);
        if (typeS > 0) {
          st.typing = { names: [chars[ev.who].name], phase: 0 };
          sfx.push({ t: now(), k: 'type', d: typeS });
          await hold(typeS);
          st.typing = null;
        }
        st.items.push({ type: 'msg', who: ev.who, text, big: !!ev.big, time: ev.time || time, newGroup: !!ev.newGroup });
        sfx.push({ t: now(), k: ev.big ? 'boom' : 'pop' });
        await pop(st.items.length - 1);
        if (ev.shake) await shake();
        await hold(ev.hold ?? clamp(0.55 + words * 0.2, 0.8, 3.2));
        break;
      }
      case 'sys': {
        st.items.push({ type: 'sys', text: ev.text, icon: ev.icon, tone: ev.tone });
        sfx.push({ t: now(), k: ev.tone === 'red' ? 'ban' : ev.tone === 'gold' ? 'level' : 'join' });
        await pop(st.items.length - 1);
        if (ev.shake) await shake();
        await hold(ev.hold ?? 1.3);
        break;
      }
      case 'react': {
        const m = lastMsg(ev.who);
        m.reacts = m.reacts || [];
        let r = m.reacts.find((x) => x.emoji === ev.emoji);
        if (!r) { r = { emoji: ev.emoji, n: 0 }; m.reacts.push(r); }
        const target = ev.n || 1;
        while (r.n < target) { r.n++; sfx.push({ t: now(), k: 'react' }); await emit(3); }
        await hold(ev.hold ?? 0.5);
        break;
      }
      case 'delete': {
        lastMsg(ev.who).deleted = true;
        sfx.push({ t: now(), k: 'whoosh' });
        await hold(ev.hold ?? 1.0);
        break;
      }
      case 'edit': {
        const m = lastMsg(ev.who); m.text = ev.text; m.edited = true;
        sfx.push({ t: now(), k: 'pop' });
        await hold(ev.hold ?? 1.2);
        break;
      }
      case 'set': {
        Object.assign(chars[ev.who], ev.props);
        if (ev.sfx) sfx.push({ t: now(), k: ev.sfx });
        if (ev.hold) await hold(ev.hold);
        break;
      }
      case 'typing': {
        st.typing = { names: (ev.who instanceof Array ? ev.who : [ev.who]).map((w) => chars[w].name), phase: 0 };
        sfx.push({ t: now(), k: 'type', d: ev.s });
        await hold(ev.s);
        st.typing = null;
        if (ev.after) await hold(ev.after);
        break;
      }
      case 'pause': await hold(ev.s); break;
      case 'shake': sfx.push({ t: now(), k: 'boom' }); await shake(); break;
      default: throw new Error('unknown event ' + ev.t);
    }
  }
  await hold(ep.outro ?? 1.6);

  async function shake() {
    const n = 12;
    for (let i = 0; i < n; i++) { st.shake = (i + 1) * (1 - i / n); st.flash = i < 2 ? 0.35 - i * 0.15 : 0; await emit(1); }
    st.shake = 0; st.flash = 0;
  }

  await browser.close();
  const dur = frame / FPS;
  fs.writeFileSync(path.join(work, 'sfx.json'), JSON.stringify({ duration: dur, events: sfx, music: ep.music || 'chill' }));
  execFileSync('python3', [path.join(__dirname, 'audio.py'), path.join(work, 'sfx.json'), path.join(work, 'audio.wav')], { stdio: 'inherit' });
  fs.mkdirSync(path.dirname(out), { recursive: true });
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(work, 'seq', '%06d.jpg'),
    '-i', path.join(work, 'audio.wav'), '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', out], { stdio: 'inherit' });
  console.log(`done ${out}  ${dur.toFixed(1)}s  ${uniq} unique frames`);
}

main().catch((e) => { console.error(e); process.exit(1); });
