// Make channel art: profile picture (800x800), banner (2560x1440), video watermark (150x150)
const path = require('path');
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 2560, height: 1440 } });
  await p.goto('file://' + path.join(__dirname, 'template.html'));
  const av = await p.evaluate(() => Object.fromEntries(Object.keys(AV).map(k => [k, AV[k]('')])));
  const css = `<style>*{margin:0;box-sizing:border-box}body{font-family:Inter,"Noto Color Emoji",sans-serif;overflow:hidden}svg{display:block}</style>`;
  // profile picture
  await p.setViewportSize({ width: 800, height: 800 });
  await p.setContent(css + `<div style="width:800px;height:800px;background:#ffc400;display:flex;align-items:center;justify-content:center">
    <div style="width:700px;height:700px">${av.nugget.replace('<svg', '<svg width="700" height="700"')}</div></div>`);
  await p.screenshot({ path: 'branding/profile.png' });
  // watermark
  await p.setViewportSize({ width: 150, height: 150 });
  await p.setContent(css + `<div style="width:150px;height:150px">${av.nugget.replace('<svg', '<svg width="150" height="150"')}</div>`);
  await p.screenshot({ path: 'branding/watermark.png', omitBackground: true });
  // banner: everything important inside the 1546x423 safe area in the middle
  await p.setViewportSize({ width: 2560, height: 1440 });
  const cast = ['grandma', 'kevin', 'nugget', 'bot', 'dave'].map((k, i) =>
    `<div style="width:${k === 'nugget' ? 300 : 210}px;height:${k === 'nugget' ? 300 : 210}px;transform:rotate(${[-8, 5, 0, -5, 8][i]}deg)">${av[k].replace('<svg', '<svg width="100%" height="100%"')}</div>`).join('');
  await p.setContent(css + `<div style="width:2560px;height:1440px;background:#14151f;position:relative;overflow:hidden">
    <div style="position:absolute;inset:0;background:repeating-linear-gradient(-30deg,#191b28 0 40px,#14151f 40px 80px)"></div>
    <div style="position:absolute;left:507px;top:508px;width:1546px;height:423px;display:flex;align-items:center;justify-content:space-between;gap:40px">
      <div style="display:flex;flex-direction:column;gap:14px">
        <div style="font-size:120px;font-weight:900;color:#fff;line-height:.95;-webkit-text-stroke:6px #000;paint-order:stroke fill;text-shadow:10px 10px 0 #ff3d6e">NUGGET'S<br>HIDEOUT</div>
        <div style="font-size:40px;font-weight:800;color:#ffc400">group chat chaos • new shorts every day</div>
      </div>
      <div style="display:flex;align-items:center;gap:6px">${cast}</div>
    </div></div>`);
  await p.screenshot({ path: 'branding/banner.png' });
  await b.close();
  console.log('ok');
})();
