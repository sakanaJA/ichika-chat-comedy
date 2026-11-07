// node tools/stills.mjs 3.2 9 15 ...  -> out/still_<t>.jpg (bundles once)
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'path';
const root = path.resolve(import.meta.dirname, '..');
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'public') });
const opts = { browserExecutable: '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell', chromiumOptions: { gl: 'swangle' } };
const composition = await selectComposition({ serveUrl, id: 'Short', ...opts });
for (const s of process.argv.slice(2)) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(parseFloat(s) * 30));
  await renderStill({ composition, serveUrl, frame, output: path.join(root, `out/still_${s}.jpg`), imageFormat: 'jpeg', jpegQuality: 85, ...opts });
  console.log('still', s);
}
