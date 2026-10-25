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

## 2026-10-25 (v2 — owner feedback: "more energy, like Beluga, fixed cast, less AI feel")
- New fixed cast: Nugget (main), Grandma, xX_Kevin_Xx, ServerBot 3000, Dave (ending gag), Kevin's Mom (guest).
- New effects: camera zoom on punchlines, screen shake, deep-fry close-ups, impact text, emoji bursts,
  glitch, music cut before big hits, mention highlight, image messages.
- New original SFX (all synthesized): ping, boom, bass drop, record scratch, air horn, dramatic sting,
  whoosh, explosion, glitch, level-up. Hype 145 BPM music bed. Louder mix with music ducking.
- Faster pacing (typing 0.3–0.9s, holds 0.65–2.6s).
- Rewrote ep001–ep003 (43–46s) and full001 (2:24).
- Status: **waiting for owner review (v2)**.

## 2026-10-25 (v3 — owner: anime-girl main, creepy guys, Discord-like UI)
- Main character is now **Ichika** (owner's Runway clip). Avatar = still from the clip; close-ups play the real clip.
- New cast: Kevin (simp), Sir Gerald (fedora), ServerBot, Grandma, Dave, Kevin's Mom.
- Chat UI restyled to look like Discord (server rail, header, input bar, replies, mention highlight) — no Discord logo/name.
- New ep001–ep003 (42–46s) + full001. Status: **waiting for owner review (v3)**.

## 2026-10-25 (YouTube setup)
- New YouTube channel **Ichika** (@Ichika-with-weird) created by the owner; Pip's channel left untouched.
- Channel description published. Profile picture + banner made (`branding/`), not uploaded yet.
- Uploads blocked on one owner step: selecting files in the Mac file picker (Claude cannot control it).
- Wrote `docs/DESIGN.md`: money plan, cast, Short/full video structure, effects, sound, pipeline, workflow, roadmap.

## 2026-10-25 (ep004 + first upload)
- Wrote and rendered ep004 "He said he's a famous streamer 🤡" (51.6s): Kevin's fake 10k followers, ServerBot fact check,
  Ichika's live stream, Grandma's bingo-hall raid, Dave "is this the stream".
- **Published ep004 as a public Short:** https://youtube.com/shorts/7O7RidExdHo (Comedy, not for kids, altered content No).
- Upload method that skips the Mac file picker: Chrome with its own profile + `--remote-debugging-port=9222`
  (owner logs in once), then automation sets the file and fills Studio through the DevTools protocol.
- Local tools on this Mac (no Homebrew): Node in `~/.local/node-v22.11.0-darwin-arm64`, ffmpeg/ffprobe linked in `~/.local/bin`
  (from npm `ffmpeg-static` / `@ffprobe-installer`), Playwright Chromium, numpy (pip --user).
- Note: `\n` in message text is not rendered as a line break; keep each message on one line.
- An old "ep001" draft (no metadata) is still in Studio drafts.

## 2026-10-25 (all videos published)
- Published (Public, Comedy, not for kids, altered No):
  - ep001 https://youtube.com/shorts/wI-dLYopUC4 (finished the old draft)
  - ep002 https://youtube.com/shorts/XY4ohxVT7cI
  - ep003 https://youtube.com/shorts/M5V1trLAnmc
  - full001 https://youtu.be/JIXi4UW7CsA (with chapters)
- Upload automation saved as `render/upload.js`. Gotcha fixed: wait for the "Video published" dialog before closing the tab,
  otherwise the video stays a draft.

## 2026-10-25 (ep005)
- Wrote and rendered ep005 "He wrote me a love poem 📜" (53.5s): Gerald's stolen poem, Kevin "that's MY poem",
  ServerBot plagiarism check (grandma birthday card, 1974), Ichika's "roses are red / violets are blue / @ServerBot ban these two",
  Grandma claims the poem, Dave "roses are red i am a bird".
- **Published ep005 as a public Short:** https://youtube.com/shorts/uU3fsW1kXsU (Comedy, not for kids, altered content No).
- Note: long @mentions + `big` + zoom overflow the screen; keep zoomed punchlines short.

## 2026-10-25 (ep006–ep010 + Season 1 full video — "a bit crazier")
- Wrote and rendered (same cast/rules, more chaos: impact text, glitches, deep-fry, name swaps, absurd escalations):
  - ep006 "He said he can cook 🍳" (53.8s) — cereal with water, microwaved fork, smoke alarm joins VC, Grandma's lasagna.
  - ep007 "He pretended to be me 💅" (51.2s) — Kevin renames to Ichika, Gerald falls for him, "i love you kevin" (edited), Mom's wig.
  - ep008 "He made a crypto coin about me 📉" (51.5s) — $ICHIKA crashes to -$4,000, Grandma buys it all, Kevin becomes "grandma's intern".
  - ep009 "He challenged me to a rap battle 🎤" (58.1s) — Ichika's verse makes Gerald's fedora leave the server, Grandma's BINGO bars destroy the server.
  - ep010 "Kevin's mom joined the group chat 💀" (65.3s, season finale) — baby pics, Mom vs Grandma 1998 bingo grudge (Brenda vs Margaret).
- full002 "Ichika vs The Group Chat — Season 1 (All 10 Episodes)" (8:58, chapters in `output/full002.chapters.txt`).
- Template fix: deleted image messages now hide the image.
- Published (Public, Comedy, not for kids, altered No):
  - ep006 https://youtu.be/X2oZJNf0lmU
  - ep007 https://youtube.com/shorts/-j7dVrVFLJ0
  - ep008 https://youtube.com/shorts/cBEoh3_y1xU
  - ep009 https://youtube.com/shorts/_NnwKdCqdMI
  - ep010 https://youtube.com/shorts/gqsEPcz0FeA
  - full002 https://youtu.be/dLY9at5hblk
- ep010 + full002 first hit "Daily upload limit reached"; the owner did the one-time phone verification, then both uploaded.
- Note: an unrelated draft "the quiet after full" (1:01) is in Studio Shorts drafts — not ours, left untouched.
