# Nugget's Hideout — chat-comedy YouTube channel

Short comedy stories told as a group chat, for an English-speaking audience.
Format inspired by chat-story channels, but **all characters, art, music and jokes are original**.

## Concept
- **Shorts (30–45s):** one joke story per video, strong hook text at the top, punchline at the end.
- **Full videos (16:9):** compilations of ~15–20 episodes (10–15 min) with intro, chapter cards and chapters.
  Full videos are what earn watch hours (Shorts views do not count toward watch hours).
- **Recurring cast** so viewers come back for the characters, not just one joke.

## Fixed cast (server: "nugget's hideout", app: "Yapp" — fictional)
| Character | Who they are | Running gag |
|---|---|---|
| **Nugget** (main) | Chicken nugget in sunglasses. Thinks he's cool. He's not. | Gets embarrassed every episode |
| **Grandma** | Just learned the internet. TYPES IN CAPS. | Accidentally the most powerful person. Bingo. |
| **xX_Kevin_Xx** | "Pro gamer", "basically famous". Lies. | Banned / leaves almost every episode. His mom. |
| **ServerBot 3000** | The server bot. Too self-aware. Fact-checks people. | "no." |
| **Dave** | A pigeon. Never reads the chat. | Shows up "3 DAYS LATER" at the end of EVERY episode |
| Kevin's Mom (guest) | Final boss. | "KEVIN." |

## Style rules (high energy)
- Fast pace: short typing, short holds, a hit every 3–5 seconds.
- Hype effects: zoom-in + boom on punchlines, screen shake, deep-fry close-ups, impact text,
  emoji bursts, glitch, music cut to silence right before the big hit.
- Every episode ends with Dave (recognizable ending = people watch to the end / loop).
- Chat feels human: typos, lowercase, slang, emoji, @mentions, edits — not "AI perfect" text.

## How it works
```
episodes/epXXX.json  --render/render.js-->  output/epXXX.mp4   (1080x1920 Short)
several Shorts       --render/compile.js->  output/fullXXX.mp4 (1920x1080 full video + chapters)
```
- `render/template.html` — the chat UI (drawn in HTML/CSS, avatars are inline SVG)
- `render/audio.py` — original synth music + sound effects (no outside audio = no copyright claims)
- `characters.json` — cast settings
- `docs/uploads.md` — titles, descriptions and tags ready for YouTube
- `PROGRESS.md` — work log

```bash
node render/render.js episodes/ep001.json
node render/compile.js "Title" output/full001.mp4 ep001 ep002 ep003
```

## Monetization rules we follow
- YouTube Partner Program (ads): 1,000 subs + 4,000 watch hours/12 months **or** 10M Shorts views/90 days.
  From **Feb 1, 2027** new applicants need 8,000 hours or 20M Shorts views. We plan for the new bar.
- "Inauthentic content" policy: mass-produced, template-only videos get demonetized at the channel level.
  So every episode has a new written story, recurring characters with personality, and compilations add
  new material (intro, cards, and later bonus scenes) — not just re-uploads.
