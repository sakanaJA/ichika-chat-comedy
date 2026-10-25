# The Snack Drawer — chat-comedy YouTube channel

Short comedy stories told as a group chat, for an English-speaking audience.
Format inspired by chat-story channels, but **all characters, art, music and jokes are original**.

## Concept
- **Shorts (30–45s):** one joke story per video, strong hook text at the top, punchline at the end.
- **Full videos (16:9):** compilations of ~15–20 episodes (10–15 min) with intro, chapter cards and chapters.
  Full videos are what earn watch hours (Shorts views do not count toward watch hours).
- **Recurring cast** so viewers come back for the characters, not just one joke.

## Cast (server: "the snack drawer", app: "Yapp" — fictional)
| Character | Who they are |
|---|---|
| Mochi | Rice-cake blob. Pure chaos. Starts every problem. |
| Pickle | Frog. Deadpan one-liners. Usually delivers the punchline. |
| Toast | Bread slice. Anxious overthinker. |
| Waffles | Wants power. Mod energy. Breaks his own rules. |

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
