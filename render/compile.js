// Build a 16:9 full-length video from several rendered Shorts.
// Adds an intro card, a chapter card before each episode, a framed layout, and an outro.
// Usage: node render/compile.js "Compilation title" output/full001.mp4 ep001 ep002 ep003 ...
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const [title, outArg, ...ids] = process.argv.slice(2);
const out = path.resolve(outArg);
const work = path.join(ROOT, 'output', '.work', 'compile-' + path.basename(out, '.mp4'));

const ff = (args) => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...args], { stdio: 'inherit' });
const dur = (f) => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString());
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

async function main() {
  fs.rmSync(work, { recursive: true, force: true });
  fs.mkdirSync(work, { recursive: true });
  const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'characters.json'), 'utf8'));
  const eps = ids.map((id) => ({ id, ...JSON.parse(fs.readFileSync(path.join(ROOT, 'episodes', id + '.json'), 'utf8')) }));

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('file://' + path.join(__dirname, 'template.html'));
  const avatar = (k) => page.evaluate((k) => AV[k](''), k);
  const avs = {};
  for (const k of Object.keys(cfg.characters)) avs[k] = await avatar(k);

  const base = `<style>*{margin:0;box-sizing:border-box}body{width:1920px;height:1080px;background:#12131c;color:#e9eaf2;
    font-family:Inter,"Noto Color Emoji",sans-serif;overflow:hidden}
    .c{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:40px;text-align:center}
    .k{font-size:40px;font-weight:800;color:#ff8a3d;letter-spacing:6px}
    .t{font-size:96px;font-weight:900;max-width:1600px;line-height:1.05}
    .row{display:flex;gap:40px}.row div{display:flex;flex-direction:column;align-items:center;gap:12px;font-size:34px;font-weight:800}
    svg{width:170px;height:170px}
    .side{position:absolute;top:0;bottom:0;width:640px;display:flex;flex-direction:column;justify-content:center;padding:0 60px;gap:24px}
    </style>`;
  const cast = () => `<div class="row">${Object.entries(cfg.characters).map(([k, v]) =>
    `<div>${avs[k]}<span style="color:${v.color}">${v.name}</span></div>`).join('')}</div>`;
  async function shot(html, file) {
    const tmp = path.join(__dirname, '.card.html');
    fs.writeFileSync(tmp, '<!doctype html><meta charset="utf-8">' + base + html);
    await page.goto('file://' + tmp);
    await page.evaluate(() => Promise.all([...document.images].filter((i) => !i.complete).map((i) => new Promise((r) => { i.onload = i.onerror = r; }))));
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: file });
  }

  const parts = [];
  // intro
  await shot(`<div class="c"><div class="k">${esc(cfg.app.server.toUpperCase())}</div><div class="t">${esc(title)}</div>${cast()}</div>`, path.join(work, 'intro.png'));
  parts.push({ img: 'intro.png', s: 3, sfx: true });
  eps.forEach((ep, i) => {
    parts.push({ card: i, s: 1.6 });
    parts.push({ ep: ep.id, i });
  });
  await shot(`<div class="c"><div class="t">more chaos every week</div>${cast()}<div class="k">SUBSCRIBE SO WAFFLES DOESN'T BAN YOU</div></div>`, path.join(work, 'outro.png'));
  parts.push({ img: 'outro.png', s: 4 });

  for (let i = 0; i < eps.length; i++) {
    const ep = eps[i];
    await shot(`<div class="c"><div class="k">EPISODE ${i + 1}</div><div class="t">${esc(ep.title)}</div></div>`, path.join(work, `card${i}.png`));
    // frame for the episode: side panels + hole in the middle for the vertical video
    await shot(`<div class="side" style="left:0;align-items:flex-end;text-align:right">
        <div class="k">EPISODE ${i + 1}</div><div style="font-size:54px;font-weight:900;line-height:1.1">${esc(ep.title)}</div></div>
      <div class="side" style="right:0;align-items:flex-start">
        <div class="k">${esc(cfg.app.server.toUpperCase())}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:22px">${Object.keys(cfg.characters).map((k) => `<div style="transform:scale(.7);transform-origin:left top;height:125px">${avs[k]}</div>`).join('')}</div></div>`,
      path.join(work, `frame${i}.png`));
  }
  await browser.close();

  // encode each part to identical format, then concat
  const list = [];
  const chapters = [];
  let t = 0;
  for (const [n, p] of parts.entries()) {
    const f = path.join(work, `part${String(n).padStart(3, '0')}.mp4`);
    const common = ['-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', '30', '-c:a', 'aac', '-ar', '44100', '-ac', '2', '-b:a', '160k'];
    if (p.ep) {
      const src = path.join(ROOT, 'output', p.ep + '.mp4');
      // YouTube chapters: first must be 0:00 and each must be 10s+, so the intro/card time folds into the episode
      chapters.push({ t: p.i === 0 ? 0 : t - parts[n - 1].s, title: `Episode ${p.i + 1}: ${eps[p.i].title}` });
      ff(['-i', path.join(work, `frame${p.i}.png`), '-i', src, '-filter_complex',
        '[1:v]scale=608:1080[v];[0:v][v]overlay=656:0,format=yuv420p[o]', '-map', '[o]', '-map', '1:a', ...common, '-shortest', f]);
    } else {
      const img = p.img || `card${p.card}.png`;
      ff(['-loop', '1', '-t', String(p.s), '-i', path.join(work, img), '-f', 'lavfi', '-t', String(p.s), '-i', 'anullsrc=r=44100:cl=stereo',
        '-vf', 'fade=in:st=0:d=0.25,fade=out:st=' + (p.s - 0.25) + ':d=0.25', ...common, f]);
    }
    t += dur(f);
    list.push(`file '${f}'`);
  }
  fs.writeFileSync(path.join(work, 'list.txt'), list.join('\n'));
  ff(['-f', 'concat', '-safe', '0', '-i', path.join(work, 'list.txt'), '-c', 'copy', '-movflags', '+faststart', out]);

  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const chapterText = chapters.map((c) => `${fmt(c.t)} ${c.title}`).join('\n');
  fs.writeFileSync(out.replace(/\.mp4$/, '.chapters.txt'), chapterText + '\n');
  console.log(`done ${out} ${fmt(t)}\n${chapterText}`);
}
main().catch((e) => { console.error(e); process.exit(1); });
