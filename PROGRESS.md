# Progress log

## 2026-10-25
- Decided concept: original chat-comedy channel for English speakers ("The Snack Drawer"), Shorts + 16:9 compilations.
- Created cast: Mochi, Pickle, Toast, Waffles (original SVG avatars, fictional "Yapp" chat app).
- Built automatic renderer (`render/render.js`): script JSON -> 1080x1920 MP4 with typing dots,
  pop-in messages, reactions, mod/ban system messages, screen shake on punchlines.
- Built original audio (`render/audio.py`): lo-fi synth music + sound effects, no outside audio.
- Built compilation maker (`render/compile.js`): intro, chapter cards, framed layout, outro, YouTube chapters.
- Wrote and rendered episodes 1–3 (34–41s each) and demo full video (2:05).
- Status: **waiting for owner review** of ep001–ep003 and full001.

## Next
- Owner review -> fix notes.
- Write ep004–ep020 (enough for one 10–15 min full video).
- Connect YouTube upload (needs one-time login) and Runway (intro/reaction clips).
- Track results per video (views, retention) and write more of what works.
