# Ichika — Project & Video Design

An English-language YouTube comedy channel. Each episode is a short story told as a group chat in a fake
Discord-style app. The owner only reviews finished videos. Claude writes the stories, renders the videos and
prepares the uploads.

---

## 1. Goal and money plan

| Item | Plan |
|---|---|
| Goal | Get into the YouTube Partner Program (ad revenue) |
| Requirement now | 1,000 subs + 4,000 watch hours (12 months) **or** 10M Shorts views (90 days) |
| From **Feb 1, 2027** (new applicants) | 1,000 subs + **8,000** watch hours **or** **20M** Shorts views (90 days). We plan for this bar. |
| How the two formats work together | **Shorts** bring new viewers and subscribers. **Full videos** (16:9, 10–15 min) earn watch hours, because Shorts views do not count toward watch hours. |
| Biggest risk | The "inauthentic content" policy: channels that mass-produce near-identical, template-only videos lose monetization **for the whole channel**. Every episode needs a new story, recurring characters with real personalities, and full videos must add new material, not just re-upload Shorts. |

---

## 2. Concept and fixed cast

**Logline:** Ichika is the only girl in a group chat full of weird guys. They try. She wins. Every time.

| Character | Role | Personality | Running gag |
|---|---|---|---|
| **Ichika** | Main | 22, college student, gamer girl. Long pink hair, cat-ear headphones, aqua eyes, white blouse with pink ribbon. Cute but savage. Art comes from the owner's Runway clip (`assets/ichika_source.mp4`). | The guys bother her; she always wins. |
| **xX_Kevin_Xx** | Creep #1 | Try-hard simp. Lies about being famous or a pro. | Renames himself "ichika's bf (real)", gets banned, his mom shows up. |
| **Sir Gerald** | Creep #2 | Fedora. "m'lady". Says "I respect women", then doesn't. | `*tips fedora*` |
| **ServerBot 3000** | Bot | Moderation bot, secretly on Ichika's side. | "creep detected." / fact checks |
| **Grandma** | Wild card | Ichika's grandma. TYPES IN CAPS. Accidentally the strongest person in the chat. | Bingo |
| **Dave** | Ending gag | A pigeon. Never reads the chat. | Appears at "3 DAYS LATER" in **every** episode with a reply that makes no sense. |
| Kevin's Mom | Guest | Final boss. | "KEVIN." |

### Content rules
- Ichika is an adult and **always wins**. The guys are the joke, never her.
- Light PG-13 hints only ("send pics 😏" → she sends a potato). Strong sexual jokes cut ad revenue.
- Discord-*style* UI, but no Discord logo or name. The app is the fictional "Yapp".
- All art (except Ichika's clip, which the owner made), music and sound effects are original and made in code.
  No outside audio means no copyright claims.
- AI disclosure label: **No** (anime cartoon, nothing realistic).

---

## 3. Video structure

### 3.1 Short (1080×1920, 35–50 s)

Screen zones:

```
y=0     ┌──────────────────────────────┐
        │  HOOK CARD (white, pink shadow)│  episode hook, always visible
y=300   ├──┬───────────────────────────┤
        │  │ # general | topic   🔔📌👥 │  Discord-style header
        │R │                           │
        │A │  CHAT FEED                 │  messages pop in from the bottom
        │I │  avatar · name · time      │
        │L │  message text (46 px)      │
        │  │                           │
        │  │ [+] Message #general  GIF 🙂│  input bar
        │  │ ••• Kevin is typing...     │
y=1630  ├──┴───────────────────────────┤
        │  (empty: YouTube Shorts UI    │
y=1920  │   covers this area)           │
        └──────────────────────────────┘
```

Beat sheet (every episode follows it):

| Time | Beat | Example (ep001) |
|---|---|---|
| 0–2 s | **Hook**: hook card + Ichika's animated clip full-screen | "hi everyone! 👋" |
| 2–10 s | **Setup**: the guys start bothering her | hi / hiii / *tips fedora* m'lady |
| 10–30 s | **Escalation**: a punch every 3–5 s (zoom + boom) | "DMs received: 47", name change to "ichika's bf (real)" |
| 30–40 s | **Turn**: Ichika, Grandma or the bot wins; the music stops right before the big hit | Grandma joins → Kevin leaves |
| ~40 s | **Ichika reaction**: her real clip plays full-screen | "ok maybe i'll stay 😌" |
| last 3 s | **Ending**: "3 DAYS LATER" → Dave says something useless | "hi new girl" + 💀 reactions |

The Dave ending makes every episode recognizable and makes people watch to the end. It also loops well.

### 3.2 Effects

| Effect | Script key | Use |
|---|---|---|
| Message pop-in | (every message) | scale + slide, with a "ping" sound |
| Typing indicator | `typing` | "X is typing..." builds tension; a long one means a big reply is coming |
| Camera zoom | `zoom: 1.4–1.7` | on every punchline; fits the whole line on screen |
| Screen shake + white flash | `shake: true` | bans, big reveals |
| Deep-fry | `fry: true` | red, oversaturated look for "too much" moments |
| Close-up | `closeup` | full-screen character + caption; `clip: true` plays Ichika's real animation |
| Impact text | `impact` | huge tilted text ("*unplugs router*") |
| Emoji burst | `burst` | 💀 / 😭 rain after a big joke |
| Glitch | `glitch` | the bot acting up |
| Music cut | `mute` | silence 0.5–3 s before the biggest hit |
| Reply / mention | `reply`, `@ichika` | real chat feel; a mention of Ichika gets the yellow highlight |
| Image message | `img` | fake photos (🥔 "me rn") |
| Reactions | `react` | counters going up (💀 5) |

### 3.3 Sound

All synthesized in `render/audio.py`:

- **Music:** 145 BPM bouncy trap loop (808 bass, claps, hi-hat rolls, pluck melody). It ducks under big hits.
- **SFX:** ping, boom (deep hit with reverb), bass drop, record scratch, air horn, dramatic "dun dun DUN",
  whoosh, explosion, glitch, level-up, ban buzzer, join/leave chimes, typing clicks, pop bursts.
- **Mix:** soft limiter for a loud, punchy sound. YouTube normalizes loudness anyway.

### 3.4 Full video (1920×1080, target 10–15 min)

- Intro card: title + cast (3 s)
- For each episode: a chapter card ("EPISODE n" + title, 1.6 s), then the Short in the middle of a 16:9 frame,
  with the episode title on the left and the cast on the right
- Outro card: "more chaos every week" + subscribe line (4 s)
- YouTube chapters are generated automatically: the first is at 0:00 and each is at least 10 s
- Target: 15–20 episodes per full video. **Extra value:** add bonus scenes or "director's cut" lines that are not in the Shorts.

---

## 4. Pipeline

```
episodes/epXXX.json ──► render/render.js ──► frames (Playwright screenshots of template.html)
                              │                     │
                              ▼                     ▼
                       sfx.json (timings) ──► render/audio.py ──► audio.wav
                                                    │
                                     ffmpeg (H.264 + AAC) ──► output/epXXX.mp4

output/ep*.mp4 ──► render/compile.js ──► output/fullXXX.mp4 + fullXXX.chapters.txt
```

| File | Job |
|---|---|
| `characters.json` | Cast: names, colors, avatars, bios |
| `episodes/epXXX.json` | One episode script: `title`, `hook`, `time`, `music`, `events[]` |
| `render/template.html` | The chat UI and all visual effects (HTML/CSS) |
| `render/avatars.js` | Character avatars (SVG; Ichika is an image from her clip) |
| `render/render.js` | Runs the script event by event, takes frames, writes SFX timings, encodes the MP4 |
| `render/audio.py` | Music + SFX → WAV |
| `render/compile.js` | Builds the 16:9 full video and its chapters |
| `render/banner.html` | Channel banner (2560×1440) |
| `assets/` | Ichika's source clip, avatar, and clip frames used in close-ups |
| `branding/` | Channel picture and banner |
| `docs/uploads.md` | Titles, descriptions, tags and settings for each upload |
| `PROGRESS.md` | Work log |

Only frames that change are captured; still moments are reused. One Short renders in about 1 minute.

### Event schema (short form)

```json
{ "t": "msg", "who": "kevin", "text": "@ichika send pics 😏",
  "zoom": 1.6, "sfx": "boom", "shake": true, "fry": true, "burst": "💀",
  "reply": "ichika", "img": {"emoji": "🥔", "cap": "me rn"}, "big": true, "typing": 0.5, "hold": 1.0 }
{ "t": "sys", "text": "Sir Gerald was timed out", "icon": "⏳", "tone": "red|green|gold|blue|later" }
{ "t": "typing", "who": ["kevin", "gerald"], "s": 0.8 }
{ "t": "react", "emoji": "💀", "n": 5 }
{ "t": "set", "who": "kevin", "props": {"name": "ichika's bf (real)"} }
{ "t": "closeup", "who": "ichika", "text": "gg ez 😌", "clip": true, "clipStart": 2.5, "fry": true }
{ "t": "impact", "text": "*unplugs router*", "sfx": "explode" }
{ "t": "burst" | "glitch" | "mute" | "pause" | "shake" | "zoom" | "delete" | "edit" }
```

---

## 5. Workflow

1. **Write**: Claude writes episode scripts using the beat sheet. The cast and rules stay fixed.
2. **Render**: `node render/render.js episodes/epXXX.json`.
3. **Check**: Claude checks frames (zoom fits, no cut text, audio level) before sending.
4. **Review**: the owner watches the video and only says OK or what to change.
5. **Upload**: YouTube Studio in the app browser; metadata from `docs/uploads.md`.
   *Limit:* Claude cannot operate the Mac file picker, so the owner selects the files (one step).
6. **Log**: commit + `PROGRESS.md` entry.

Posting plan: 1 Short per day. A full video every 15–20 episodes.

### Upload settings
Category: Comedy · Not made for kids · Altered content: No · Visibility: Public · `#shorts` in Short titles.

---

## 6. Roadmap

- [ ] Upload ep001–ep003 + full001 (waiting on the owner's file selection)
- [ ] Channel picture + banner (`branding/`)
- [ ] Episodes 4–20 → first real 10–15 min full video
- [ ] More Ichika clips from Runway (angry, laughing, shocked) for more reaction types
- [ ] Track views and retention per video; write more of what works
