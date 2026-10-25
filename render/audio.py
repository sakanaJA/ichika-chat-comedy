"""Make the soundtrack: an original synth music bed + sound effects. No outside audio is used."""
import json
import sys
import wave

import numpy as np

SR = 44100
rng = np.random.default_rng(7)


def env(n, a=0.005, r=None):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4))
    if r:
        e *= np.exp(-t / r)
    return e


def tone(freq, dur, wave_="sine", r=None, a=0.005):
    n = int(dur * SR)
    t = np.arange(n) / SR
    if callable(freq):
        ph = 2 * np.pi * np.cumsum(freq(t)) / SR
    else:
        ph = 2 * np.pi * freq * t
    if wave_ == "sine":
        s = np.sin(ph)
    elif wave_ == "tri":
        s = 2 / np.pi * np.arcsin(np.sin(ph))
    else:
        s = np.sign(np.sin(ph)) * 0.5
    return s * env(n, a, r)


def noise(dur, r=0.05):
    n = int(dur * SR)
    return rng.standard_normal(n) * env(n, 0.002, r)


def lowpass(x, k=8):
    return np.convolve(x, np.ones(k) / k, mode="same")


SFX = {
    "pop": lambda: tone(lambda t: 700 + 900 * np.minimum(1, t / 0.05), 0.12, r=0.035) * 0.5,
    "react": lambda: tone(1600, 0.06, r=0.02) * 0.25,
    "join": lambda: np.concatenate([tone(660, 0.09, r=0.05), tone(990, 0.2, r=0.08)]) * 0.35,
    "level": lambda: np.concatenate([tone(f, 0.09, "tri", r=0.06) for f in (523, 659, 784)] + [tone(1047, 0.4, "tri", r=0.15)]) * 0.4,
    "ban": lambda: np.concatenate([tone(330, 0.18, "square", r=0.2), tone(220, 0.35, "square", r=0.25)]) * 0.22,
    "whoosh": lambda: lowpass(noise(0.35, r=0.12), 20) * 0.6,
    "boom": lambda: (tone(lambda t: 120 * np.exp(-t * 6) + 40, 0.8, r=0.3) * 0.9
                     + np.pad(lowpass(noise(0.3, r=0.06), 6) * 0.35, (0, int(0.5 * SR)))),
}


def typing(d):
    out = np.zeros(int(d * SR) + SR // 10)
    t = 0.0
    while t < d:
        i = int(t * SR)
        c = lowpass(noise(0.015, r=0.004), 3) * 0.06
        out[i:i + len(c)] += c
        t += rng.uniform(0.07, 0.14)
    return out


def music(dur, style):
    """Lo-fi loop: soft chords, bass, gentle kick/hat. 88 BPM."""
    bpm = 88
    beat = 60 / bpm
    n = int(dur * SR) + SR
    out = np.zeros(n)
    # I - vi - IV - V in F major (with 7ths)
    prog = [[53, 57, 60, 64], [50, 53, 57, 60], [46, 50, 53, 57], [48, 52, 55, 58]]
    if style == "tense":
        prog = [[50, 53, 57, 60], [46, 50, 53, 58], [48, 51, 55, 58], [45, 49, 52, 55]]
    hz = lambda m: 440 * 2 ** ((m - 69) / 12)
    bar = beat * 4
    b = 0
    while b * bar < dur + bar:
        ch = prog[b % len(prog)]
        start = int(b * bar * SR)
        for m in ch:
            s = tone(hz(m + 12), bar, "tri", r=1.6, a=0.03) * 0.045
            out[start:start + len(s)] += s[: max(0, n - start)]
        s = tone(hz(ch[0] - 12), bar * 0.9, "sine", r=0.9, a=0.01) * 0.12
        out[start:start + len(s)] += s[: max(0, n - start)]
        for k in range(4):
            i = int((b * bar + k * beat) * SR)
            if k in (0, 2):
                kick = tone(lambda t: 90 * np.exp(-t * 18) + 45, 0.25, r=0.08) * 0.18
                out[i:i + len(kick)] += kick[: max(0, n - i)]
            for h in (0, 0.5):
                j = int((b * bar + (k + h) * beat) * SR)
                hat = np.diff(noise(0.04, r=0.008), prepend=0) * 0.03
                out[j:j + len(hat)] += hat[: max(0, n - j)]
        b += 1
    out = lowpass(out, 4)
    # fade in/out
    f = int(0.4 * SR)
    out[:f] *= np.linspace(0, 1, f)
    e = int(dur * SR)
    out[e - int(0.8 * SR):e] *= np.linspace(1, 0, int(0.8 * SR))
    return out[:e]


def main(cfg_path, out_path):
    cfg = json.load(open(cfg_path))
    dur = cfg["duration"]
    n = int(dur * SR)
    mix = music(dur, cfg.get("music", "chill"))
    mix = np.pad(mix, (0, max(0, n - len(mix))))[:n]
    for ev in cfg["events"]:
        s = typing(ev["d"]) if ev["k"] == "type" else SFX[ev["k"]]()
        i = int(ev["t"] * SR)
        if i >= n:
            continue
        seg = s[: n - i]
        mix[i:i + len(seg)] += seg
        if ev["k"] == "boom":  # duck the music a little under the punchline
            pass
    peak = np.max(np.abs(mix)) or 1
    mix = mix / peak * 0.89
    pcm = (mix * 32767).astype(np.int16)
    stereo = np.column_stack([pcm, pcm]).ravel()
    with wave.open(out_path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(stereo.tobytes())


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
