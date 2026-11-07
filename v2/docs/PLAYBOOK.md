# Ichika — Channel Bible & Production Playbook

Channel: **Ichika** (@Ichika-with-weird) — Studio channel ID `UCb0OjDwCQ5PHvX9i0UQBuPA`
Owner works in Japanese; answer in simple English (TOEIC ~600) with Japanese glosses.
Goal: ad revenue (YouTube Partner Program). Production method = **the same as Tiny Money Facts v2** (see PIPELINE.md).
Concept source of truth: `docs/DESIGN.md` in github.com/sakanaJA/ichika-chat-comedy.

---

## 1. Concept (DO NOT drift)

- **What:** 35–55 s vertical (9:16) chat-comedy Shorts for an English-speaking audience. Full 16:9 compilations later (15–20 episodes).
- **Logline:** Ichika is the only girl in a group chat full of weird guys. They try. She wins. Every time.
- **Fixed cast:**
  - **Ichika** (main) — 22, gamer girl, long pink hair, cat-ear headphones. Cute but savage. Art = owner's Runway clip (`public/ichika.mp4`, frames in `public/ichika_clip/`). Shown on a 3D cat-ear monitor and in full-screen close-ups.
  - **xX_Kevin_Xx** — try-hard simp, lies. Green bean, red cap sideways, gamer headset. Renames himself "ichika's bf (real)", gets banned, his mom shows up.
  - **Sir Gerald** — fedora, neckbeard, "m'lady", "I respect women" then doesn't. Tips his 3D fedora.
  - **ServerBot 3000** — blue robot, fact checks the guys, "creep detected." Robot voice.
  - **Grandma** — purple, white bun, gold glasses, TYPES IN CAPS, accidentally the strongest.
  - **Dave** — a pigeon. Ends EVERY episode at "3 DAYS LATER" with a useless line.
  - Kevin's Mom (guest) — final boss, "KEVIN."
- **Rules:** Ichika is an adult and always wins. Light PG-13 hints only. No real people, brands, logos (fictional app "Yapp", Discord-*style* look only).

## 2. Fixed visual style (ep001 = reference look)

- 1080x1920, 30 fps. Three.js 3D neon gamer room (purple floor + pink grid, pink/cyan neon strips, floating cubes) + Remotion 2D overlay.
- Layout: hook card y≈50–220 (white, black border, pink shadow) · 3D speaker on the stage y≈250–760 · Discord-style chat panel x 22–952, y 770–1610 · bottom ~300 px and right ~130 px kept clear for Shorts UI.
- The current speaker pops onto the 3D stage (spring), talks (mouth synced to their voice line), others drop away.
- Punchline = "zoom": 3D camera dolly-in + the line jumps out of the chat as a big focus card over a dimmed screen.
- Other effects: screen shake + white flash, 💀 bursts, 3D ban hammer, rocket exit when someone leaves, "3 DAYS LATER" yellow title, Ichika full-screen close-up with her clip + word pop-in caption.

## 3. Story structure (every episode)

1. Hook (0–2 s): hook card + Ichika close-up ("hi everyone!")
2. Setup: the guys start bothering her
3. Escalation: a punch every 3–5 s (zoom + boom)
4. Turn: Ichika / Grandma / the bot wins; music cuts to silence before the big hit
5. Ichika reaction close-up
6. "3 DAYS LATER" → Dave

## 4. Audio

- **Voices:** Kokoro (free, Apache-2.0). One voice per character, generated with the Kokoro web page's own controls
  (`https://webml-community-kokoro-web.static.hf.space/index.html`): Ichika `af_bella`, Kevin `am_adam` (×1.12), Gerald `bm_george`,
  Bot `am_michael` (×1.04 + robot FX), Grandma `bf_isabella`, Dave `bm_lewis` (×0.92), Mom `af_nicole`.
- **SFX + music:** synthesized in code (`tools/synth.py`): ping, boom, scratch, horn, sting, ban, buzzer, level, join, whoosh, pops; 145 BPM trap loop.
- **Mix (inside Remotion):** voice compressed + boosted; SFX 0.5; music 0.55 ducked to 35% under voices, 0 during `mute`.

## 5. Upload settings (every video)

- Title: `<hook line> <emoji> #shorts`. Description: 1–2 joke lines + subscribe line + `#shorts #groupchat #funny #anime #comedy #chatstory`.
- Audience: **No, it's not made for kids**. Advanced: **AI use = Yes** (AI voices). Visibility: **Public**.
- Upload file: 720x1280 two-pass x264 (≈470 kbps), AAC 96k, ≤ 3.7 MB (Chrome file_upload limit). 1080p master in `~/Movies/Ichika/`.

## 6. Video log (never repeat a story)

| # | Date | Title | Story | Link |
|---|------|-------|-------|------|
| 1 | 2026-11-07 | Being the only girl in the gamer chat 💀 | Ichika joins; Kevin/Gerald spam; bot counts 47 DMs; Kevin renames to "ichika's bf (real)"; Gerald timed out (ban hammer); Grandma scares Kevin away; Dave ending | https://youtube.com/shorts/r3uNKa4Ojrs |

### Story ideas (not used yet)
- "send pics 😏" → she sends a potato; Kevin's mom joins
- "girls can't game" → 1v1, 15-0; Grandma also wins 15-0
- The bot becomes self-aware and bans everyone except Ichika
- Gerald writes Ichika a poem (it's terrible, the bot grades it)
- Kevin buys a "verified" badge; it's a sticker
