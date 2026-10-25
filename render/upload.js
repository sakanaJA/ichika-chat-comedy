// Upload/publish a video on the Ichika channel through YouTube Studio (no file picker needed).
// Needs Chrome running with: --user-data-dir=~/.local/ichika-chrome --remote-debugging-port=9222 (logged in once).
// Usage: node render/upload.js upload <file> <title> <desc>
//        [TAB=upload] node render/upload.js draft <text in draft title> <title> <desc>   (finish an existing draft)
// Sets: not made for kids, altered content No, category Comedy, Public.
const fs = require('fs');
const [mode, src, title, desc] = process.argv.slice(2);
const CH = 'https://studio.youtube.com/channel/UCb0OjDwCQ5PHvX9i0UQBuPA';
const LIB = [
  "window.$$d = (sel, root = document) => { const out = []; const walk = (r) => { out.push(...r.querySelectorAll(sel)); for (const el of r.querySelectorAll('*')) if (el.shadowRoot) walk(el.shadowRoot); }; walk(root); return out; };",
  "window.$byText = (sel, re) => $$d(sel).find(e => re.test((e.textContent || '').trim()) && e.offsetParent !== null);",
  "window.sleep = (ms) => new Promise(r => setTimeout(r, ms));",
].join('\n') + '\n';
setTimeout(() => { console.log('GLOBAL TIMEOUT'); process.exit(2); }, 15 * 60000);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
(async () => {
  const url = mode === 'draft' ? CH + '/videos/' + (process.env.TAB || 'short') : CH;
  const t = await (await fetch('http://localhost:9222/json/new?' + url, { method: 'PUT' })).json();
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  let id = 0; const pend = {};
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (pend[d.id]) { pend[d.id](d); delete pend[d.id]; } };
  await new Promise(r => ws.onopen = r);
  const send = (method, params = {}) => new Promise((r, j) => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); setTimeout(() => j(new Error('timeout ' + method)), 60000); });
  const ev = async (js, byValue = true) => { const r = await send('Runtime.evaluate', { expression: LIB + js, awaitPromise: true, returnByValue: byValue, userGesture: true }); if (r.result.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 300)); return byValue ? r.result.result.value : r.result.result; };
  const until = async (js, ms = 60000) => { for (let i = 0; i < ms / 1000; i++) { try { if (await ev(js)) return; } catch {} await sleep(1000); } throw new Error('until: ' + js.slice(0, 80)); };
  const shot = async (n) => { const s = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(require('path').join(__dirname, '..', 'output', '.work', n), Buffer.from(s.result.data, 'base64')); };
  const typeInto = async (sel, text) => {
    await ev(`(() => { const e = $$d('${sel}').find(e => e.offsetParent !== null); e.focus(); document.execCommand('selectAll'); document.execCommand('delete'); return 1; })()`);
    await send('Input.insertText', { text }); await sleep(500);
  };
  try {
    await sleep(3000);
    if (mode === 'draft') {
      await until(`!!$byText('button, ytcp-button', /^Edit draft$/)`);
      const ok = await ev(`(() => { const rows = $$d('ytcp-video-row'); const row = rows.find(r => (r.textContent||'').includes(${JSON.stringify(src)}) && /Edit draft/.test(r.textContent)); if (!row) return false; $$d('ytcp-button, button', row).find(b => /^Edit draft$/.test((b.textContent||'').trim())).click(); return true; })()`);
      if (!ok) throw new Error('draft row not found');
    } else {
      const UP = `$$d('[aria-label]').find(e => /^upload videos?$/i.test(e.getAttribute('aria-label')) && e.offsetParent !== null)`;
      await until('!!' + UP);
      await ev(UP + '.click()');
      await until(`!!$$d('input[type=file]')[0]`);
      const obj = await ev(`$$d('input[type=file]')[0]`, false);
      await send('DOM.enable');
      const r = await send('DOM.setFileInputFiles', { files: [src], objectId: obj.objectId });
      if (r.error) throw new Error(JSON.stringify(r.error));
    }
    await until(`!!$$d('#title-textarea #textbox').find(e => e.offsetParent !== null)`, 120000);
    await sleep(2000);
    await typeInto('#title-textarea #textbox', title);
    await typeInto('#description-textarea #textbox', desc);
    await ev(`$$d('#title-textarea #textbox')[0].focus()`); await sleep(500);
    console.log(await ev(`(async () => {
      const r = [];
      $$d('tp-yt-paper-radio-button[name="VIDEO_MADE_FOR_KIDS_NOT_MFK"]')[0].click(); await sleep(500);
      const tg = $$d('#toggle-button').find(e => e.offsetParent !== null && !/less/i.test(e.textContent)); if (tg) { tg.click(); await sleep(1500); }
      $$d('tp-yt-paper-radio-button[name="VIDEO_HAS_ALTERED_CONTENT_NO"]')[0].click(); await sleep(400);
      const sel = $$d('ytcp-form-select#category')[0];
      if (!/Comedy/.test(sel.textContent)) { ($$d('ytcp-dropdown-trigger', sel)[0] || sel).click();
        for (let i = 0; i < 10; i++) { await sleep(500); const it = $$d('tp-yt-paper-item[role=option]').find(e => (e.textContent||'').trim() === 'Comedy' && e.offsetParent !== null); if (it) { it.click(); break; } } await sleep(800); }
      r.push('kids=' + $$d('tp-yt-paper-radio-button[name="VIDEO_MADE_FOR_KIDS_NOT_MFK"]')[0].getAttribute('aria-checked'));
      r.push('altered=' + $$d('tp-yt-paper-radio-button[name="VIDEO_HAS_ALTERED_CONTENT_NO"]')[0].getAttribute('aria-checked'));
      r.push('cat=' + sel.textContent.trim().replace(/\\s+/g, ' ').slice(0, 30));
      r.push('title=' + $$d('#title-textarea #textbox')[0].textContent.trim());
      return r.join(' | ');
    })()`));
    for (let i = 0; i < 3; i++) { await ev(`$$d('#next-button').find(e => e.offsetParent !== null).click()`); await sleep(2500); }
    await until(`!!$$d('tp-yt-paper-radio-button[name="PUBLIC"]').find(e => e.offsetParent !== null)`);
    await ev(`$$d('tp-yt-paper-radio-button[name="PUBLIC"]')[0].click()`); await sleep(800);
    // wait until upload finished (Done can be pressed while processing, but not while uploading)
    await until(`(() => { const s = ($$d('ytcp-video-upload-progress')[0]?.textContent || ''); return /upload complete|Processing|Checks complete|Copyright check/i.test(s) && !/Uploading/i.test(s); })()`, 600000);
    console.log('progress:', await ev(`($$d('ytcp-video-upload-progress')[0]?.textContent||'').trim().replace(/\\s+/g,' ').slice(0,150)`));
    console.log('public=' + await ev(`$$d('tp-yt-paper-radio-button[name="PUBLIC"]')[0].getAttribute('aria-checked')`));
    await ev(`$$d('#done-button').find(e => e.offsetParent !== null).click()`);
    await until(`$$d('ytcp-video-share-dialog, ytcp-uploads-still-processing-dialog, ytcp-prechecks-warning-dialog').some(e => e.offsetParent !== null && /published|processing|publish anyway/i.test(e.textContent))`, 90000);
    console.log('dialog:', await ev(`$$d('ytcp-video-share-dialog, ytcp-uploads-still-processing-dialog, ytcp-prechecks-warning-dialog').filter(e => e.offsetParent !== null).map(e => e.innerText.replace(/\\s+/g, ' ').slice(0, 80)).join(' || ')`));
    // "We're still checking your content" warning: without "Publish anyway" the video stays a draft
    const pre = `$$d('ytcp-prechecks-warning-dialog').find(e => e.offsetParent !== null)`;
    if (await ev('!!' + pre)) {
      await ev(`$$d('ytcp-button, button', ${pre}).find(b => /publish anyway/i.test(b.textContent)).click()`);
      await until(`$$d('ytcp-video-share-dialog, ytcp-uploads-still-processing-dialog').some(e => e.offsetParent !== null && /published|processing/i.test(e.textContent))`, 90000);
      console.log('dialog after publish anyway:', await ev(`$$d('ytcp-video-share-dialog, ytcp-uploads-still-processing-dialog').filter(e => e.offsetParent !== null).map(e => e.innerText.replace(/\\s+/g, ' ').slice(0, 80)).join(' || ')`));
    }
    await sleep(4000);
    const link = await ev(`(() => { const t = $$d('ytcp-video-share-dialog, ytcp-uploads-still-processing-dialog, tp-yt-paper-dialog').map(e => e.textContent).join(' '); const m = t.match(/https:\\/\\/(youtube\\.com\\/shorts|youtu\\.be)\\/[\\w-]+/); return m ? m[0] : ''; })()`);
    console.log('LINK', link);
    await shot('last.png');
    await fetch('http://localhost:9222/json/close/' + t.id);
    process.exit(0);
  } catch (e) { console.log('FAIL', e.message); await shot('fail.png').catch(() => {}); process.exit(1); }
})();
