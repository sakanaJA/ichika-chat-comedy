"""Ichika episode builder (Tiny Money Facts v2 method, adapted to chat comedy).

1. Reads episodes/<id>.json + cast.json + voices/<id>/clips.json (Kokoro durations; estimates if missing)
2. Writes public/timeline.json  (every event's start/end, voice start, SFX cues)  -> Remotion reads it
3. Builds public/voice.wav (Kokoro clips placed on the timeline, per-character speed + robot FX),
   public/sfx.wav and public/music.wav (synthesized in code, no outside audio)

Usage: python3 tools/build.py ep001 [--estimate]
"""
import json, os, subprocess, sys, wave
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import synth  # noqa: E402

SR = 44100
EP = sys.argv[1]
ESTIMATE = '--estimate' in sys.argv
ep = json.load(open(f'{ROOT}/episodes/{EP}.json'))
cast = json.load(open(f'{ROOT}/cast.json'))['characters']
vdir = f'{ROOT}/voices/{EP}'
clips = {}


def unpack():
    """pack.wav (all Kokoro lines, one after another) + pack.json -> one processed clip per line + clips.json.
    Processing = per-character speed, robot FX for the bot, trimmed silence. Durations are measured after processing."""
    pack = json.load(open(f'{vdir}/pack.json'))
    out = {}
    for k, m in pack.items():
        ch = cast[m['who']]
        af = ['silenceremove=start_periods=1:start_threshold=-45dB',
              'areverse', 'silenceremove=start_periods=1:start_threshold=-45dB', 'areverse']
        if abs(ch.get('speed', 1) - 1) > 1e-3:
            af.append(f"atempo={ch['speed']}")
        if ch.get('fx') == 'robot':
            af += ['aecho=0.8:0.6:14:0.3', 'acrusher=bits=10:mix=0.3']
        af += ['highpass=f=80', f'aresample={SR}']
        f = f'clip_{int(k):02d}.wav'
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', str(m['start']), '-t', str(m['dur']), '-i', f'{vdir}/pack.wav',
                        '-af', ','.join(af), '-ac', '1', f'{vdir}/{f}'], check=True)
        with wave.open(f'{vdir}/{f}') as w:
            out[k] = {'who': m['who'], 'file': f, 'dur': round(w.getnframes() / SR, 3)}
    json.dump(out, open(f'{vdir}/clips.json', 'w'), indent=1)


if not ESTIMATE and os.path.exists(f'{vdir}/pack.wav'):
    unpack()
if not ESTIMATE and os.path.exists(f'{vdir}/clips.json'):
    clips = {int(k): v for k, v in json.load(open(f'{vdir}/clips.json')).items()}


def voice_dur(i, e):
    if i in clips:
        return clips[i]['dur']
    return 0.35 + len(e['say']) * 0.062


# ---------- timeline ----------
SYS_SFX = {'green': 'join', 'red': 'ban', 'gold': 'level', 'blue': 'glitch', 'later': 'whoosh'}
t = 0.3
events, cues = [], []
for i, e in enumerate(ep['events']):
    k = e['t']
    ev = dict(e, i=i, t0=round(t, 3))
    if k in ('msg', 'closeup') and e.get('say'):
        d = voice_dur(i, e)
        lead = 0.32 if k == 'closeup' else 0.06
        ev['vs'], ev['vd'] = round(t + lead, 3), round(d, 3)
        end = t + lead + d + e.get('gap', 0.16) + (0.22 if e.get('zoom') else 0)
        if k == 'closeup':
            end = max(end, t + 1.5) + 0.15
        cues.append((t, e.get('sfx', 'ping') if k == 'msg' else e.get('sfx', 'ding')))
        if e.get('sfx') and k == 'msg' and e['sfx'] != 'ping':
            cues.append((t, 'ping'))
        if e.get('zoom'):
            cues.append((t - 0.12, 'whoosh'))
    elif k == 'msg':
        end = t + e.get('hold', 1.2)
        cues.append((t, e.get('sfx', 'ping')))
    elif k == 'sys':
        end = t + e.get('hold', 1.0)
        cues.append((t, e.get('sfx', SYS_SFX.get(e.get('tone'), 'join'))))
        if e.get('zoom'):
            cues.append((t - 0.12, 'whoosh'))
    elif k == 'typing':
        end = t + e['s']
        cues.append((t, ('type', e['s'])))
    elif k == 'mute':
        end = t + e['s']
    elif k == 'burst':  # starts 'back' seconds before the previous line ends (overlaps the punchline)
        ev['t0'] = round(t - e.get('back', 0), 3)
        end = t + e.get('s', 0.2)
        cues.append((ev['t0'], ('pops', 1.1)))
    elif k == 'react':
        end = t + e.get('n', 1) * 0.09 + 0.45
        for j in range(e.get('n', 1)):
            cues.append((t + j * 0.09, 'react'))
    else:  # set
        end = t
    ev['t1'] = round(end, 3)
    events.append(ev)
    t = end
duration = round(t + 1.0, 3)

json.dump({'id': EP, 'title': ep['title'], 'hook': ep['hook'], 'time': ep.get('time', ''), 'duration': duration,
           'fps': 30, 'events': events}, open(f'{ROOT}/public/timeline.json', 'w'), ensure_ascii=False, indent=1)
print(f'timeline: {duration:.2f}s, {len(events)} events' + (' (estimated voices)' if not clips else ''))

# ---------- voice ----------
N = int(duration * SR) + SR
voice = np.zeros(N)


def load_clip(path, ch):
    """Read a Kokoro clip, apply per-character speed and FX, return float mono 44.1k."""
    with wave.open(path) as w:
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float) / 32768
    if ch.get('fx') == 'robot':  # ring modulation = robot
        tt = np.arange(len(x)) / SR
        x = 0.55 * x + 0.45 * x * np.sin(2 * np.pi * 55 * tt)
    return x


if clips:
    voice[:] = 0
    for ev in events:
        if 'vs' not in ev:
            continue
        x = load_clip(f"{vdir}/{clips[ev['i']]['file']}", cast[ev['who']])
        i0 = int(ev['vs'] * SR)
        voice[i0:i0 + len(x)] += x[:max(0, min(len(x), N - i0))]

# ---------- sfx + music ----------
sfx = np.zeros(N + 4 * SR)
for tc, k in cues:
    if isinstance(k, tuple):
        s = synth.DUR_SFX[k[0]](k[1])
    elif k in synth.SFX:
        s = synth.SFX[k]()
    else:  # duration SFX used by name (e.g. "glitch") -> default length
        s = synth.DUR_SFX[k]()
    i0 = max(0, int(tc * SR))
    sfx[i0:i0 + len(s)] += s
sfx = sfx[:N]
music = synth.music(duration, ep.get('music', 'hype'))
music = np.pad(music, (0, max(0, N - len(music))))[:N]
for ev in events:  # music cuts to silence before big hits
    if ev['t'] == 'mute':
        a, b = int(ev['t0'] * SR), int(ev['t1'] * SR)
        music[a:b] = 0


def save(name, x, peak=0.89):
    m = np.max(np.abs(x)) or 1
    pcm = (x / m * peak * 32767).astype(np.int16)
    with wave.open(f'{ROOT}/public/{name}.wav', 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())


save('sfx', sfx)
save('music', music)
if clips:
    save('voice_raw', voice)
    # Tiny Money Facts voice chain: highpass, compressor, boost, limiter
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f'{ROOT}/public/voice_raw.wav', '-af',
                    'acompressor=threshold=-18dB:ratio=3:attack=5:release=80,volume=1.6,alimiter=limit=0.95',
                    f'{ROOT}/public/voice.wav'], check=True)
    os.remove(f'{ROOT}/public/voice_raw.wav')
else:
    save('voice', np.zeros(N) + 1e-9, 0.0001)
print('audio ok')
