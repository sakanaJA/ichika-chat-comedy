# Ichika — Production pipeline (same method as Tiny Money Facts v2: Three.js + Remotion)

Code: github.com/sakanaJA/ichika-chat-comedy, folder `v2/` (this project).

## 0. Setup (each new session)
- npm goes through the agent proxy: `npm i --noproxy "" --proxy "$HTTPS_PROXY" --https-proxy "$HTTPS_PROXY"` (with `NO_PROXY=`).
- Remotion uses the pre-installed headless shell (`remotion.config.ts`) and software WebGL: `--gl=swangle` (angle/egl fail in the container).
- 2 CPUs → `--concurrency 2`, ≈1.8 fps → a 45 s Short renders in ≈12 min.

## 1. Script
`episodes/epNNN.json`: `title`, `hook`, `time`, `events[]`. Event types:
`msg` (who, text, say, zoom, shake, sfx, reply, gap, img, big) · `closeup` (who=ichika, text, say, clipStart) · `sys` (text, icon, tone, sfx, stage, leave, hammer, zoom, shake, hold) ·
`typing` · `mute` · `burst` (emoji, back) · `react` (emoji, n) · `set` (who, props.name). `say` = what the voice reads (can differ from the text).

## 2. Voices (built-in browser, Kokoro page's own UI — importing scripts into the page is blocked)
Open the Kokoro page, then one `javascript_tool` call: for each line set the textarea + voice `<select>`, click **Generate**,
wait for the new `<audio>` blob, decode it (AudioContext 24 kHz), pack all clips into ONE WAV with 0.5 s gaps, download
`ichika_voices_epNNN.wav`, and return `{index: {who, start, dur}}` → save as `voices/epNNN/pack.json`.
Get the WAV: the owner's Claude Code MCP copies it `~/Downloads → ~/Movies/Ichika/`, then `device_stage_files` → `voices/epNNN/pack.wav`.

## 3. Build
`python3 tools/build.py epNNN` → splits the pack, trims silence, applies speed/robot FX, writes `public/timeline.json`
(every event's start/end and voice start), `public/voice.wav`, `public/sfx.wav`, `public/music.wav`.
(`--estimate` = placeholder voice lengths, for layout tests before voices exist.)

## 4. Check, render
- `node tools/stills.mjs 1.5 6.6 13 31 45` → `out/still_*.jpg`; look at them (hook/chat overlap, speaker framing, focus card).
- `npx remotion render src/index.ts Short out/master.mp4 --codec h264 --crf 18 --concurrency 2 --gl=swangle`
- Check 6 frames + loudness.

## 5. Upload copy + upload (Claude in Chrome)
- `ffmpeg -i master.mp4 -vf scale=720:1280 -c:v libx264 -b:v 470k -pass 1/2 ... -c:a aac -b:a 96k -movflags +faststart` ≤ 3.7 MB.
- Save master + upload copy to `~/Movies/Ichika/` (device_commit_files).
- youtube.com/channel_switcher → **Ichika** → `https://studio.youtube.com/channel/UCb0OjDwCQ5PHvX9i0UQBuPA/videos/upload?d=ud` →
  `file_upload` on the file input → title, description, Not made for kids, Show more → AI use Yes → Next ×3 → Public → Publish → copy link.

## 6. Log
Add a row to PLAYBOOK video log (project doc + repo), update PROGRESS.md, commit + push.
