"""Soundtrack maker: original synth music + loud meme-style sound effects.
Everything is synthesized here (no samples) so there are no copyright claims."""
import json
import sys
import wave

import numpy as np

SR = 44100
rng = np.random.default_rng(11)


def T(d):
    return np.arange(int(d * SR)) / SR


def env(n, a=0.003, r=None, hold=0.0):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4))
    if r:
        e *= np.exp(-np.maximum(0, t - hold) / r)
    return e


def osc(freq, d, kind="sine"):
    t = T(d)
    f = freq(t) if callable(freq) else np.full_like(t, freq)
    ph = 2 * np.pi * np.cumsum(f) / SR
    if kind == "sine":
        return np.sin(ph)
    if kind == "saw":
        return 2 * ((ph / (2 * np.pi)) % 1) - 1
    if kind == "square":
        return np.sign(np.sin(ph))
    if kind == "tri":
        return 2 / np.pi * np.arcsin(np.sin(ph))


def noise(d):
    return rng.standard_normal(int(d * SR))


def lp(x, k):
    k = max(1, int(k))
    return np.convolve(x, np.ones(k) / k, mode="same")


def hp(x, k):
    return x - lp(x, k)


def dist(x, drive):
    return np.tanh(x * drive) / np.tanh(drive)


def fit(*parts):
    n = max(len(p) for p in parts)
    out = np.zeros(n)
    for p in parts:
        out[: len(p)] += p
    return out


def reverb(x, d=0.8, mix=0.35):
    ir = noise(d) * np.exp(-T(d) / (d / 5))
    ir = lp(ir, 6)
    ir /= np.sqrt(np.sum(ir ** 2))
    wet = np.convolve(x, ir)[: len(x) + int(d * SR)]
    return fit(x, wet * mix)


# ---------- sound effects ----------
def sfx_ping():
    a = osc(1320, 0.07, "sine") * env(int(0.07 * SR), r=0.03)
    b = osc(1980, 0.16, "sine") * env(int(0.16 * SR), r=0.05)
    out = np.concatenate([a, b]) + 0.15 * np.concatenate([osc(2640, 0.07, "square") * env(int(0.07 * SR), r=0.01), np.zeros(len(b))])
    return out * 0.55


def sfx_boom():
    d = 1.4
    sub = osc(lambda t: 38 + 140 * np.exp(-t * 14), d) * env(int(d * SR), 0.002, 0.35)
    body = dist(osc(lambda t: 55 + 90 * np.exp(-t * 10), d, "tri") * env(int(d * SR), 0.002, 0.18), 3)
    click = lp(noise(0.03), 3) * env(int(0.03 * SR), 0.0005, 0.006)
    return reverb(dist(fit(sub * 1.0, body * 0.6, click * 0.7), 2.2), 1.2, 0.45) * 1.0


def sfx_bass():
    d = 1.1
    x = osc(lambda t: 30 + 170 * np.exp(-t * 3.5), d, "saw")
    x = lp(x, 30) * env(int(d * SR), 0.002, 0.5)
    return dist(x * 2.2, 3) * 0.95


def sfx_scratch():
    d = 0.42
    t = T(d)
    f = lambda t: 250 + 1300 * np.abs(np.sin(t * 2 * np.pi * 3.2))
    x = osc(f, d, "saw") * 0.5 + hp(noise(d), 4) * 0.4
    return lp(x, 3) * env(len(t), 0.002, 0.25, 0.15) * 0.7


def sfx_horn():
    out = []
    for blast, d in ((0, 0.16), (1, 0.16), (2, 0.55)):
        t = T(d)
        vib = lambda t: 1 + 0.012 * np.sin(2 * np.pi * 7 * t)
        x = sum(osc(lambda t, f=f: f * vib(t) * (1 - 0.03 * np.exp(-t * 30)), d, "saw") for f in (466, 470, 587, 698)) / 4
        x = dist(lp(x, 4) * 1.8, 2) * env(len(t), 0.004, None)
        x[-int(0.02 * SR):] *= np.linspace(1, 0, int(0.02 * SR))
        out += [x, np.zeros(int(0.05 * SR))]
    return np.concatenate(out) * 0.55


def sfx_sting():
    # dramatic "dun dun DUNNN"
    notes = [(98, 0.22), (98, 0.22), (82.4, 1.1)]
    out = []
    for f, d in notes:
        x = sum(osc(f * m, d, "saw") * a for m, a in ((1, 1), (2, 0.5), (1.5, 0.35), (0.5, 0.6)))
        x = lp(x, 10) * env(int(d * SR), 0.01, d * 0.8)
        out += [x, np.zeros(int(0.06 * SR))]
    return reverb(dist(np.concatenate(out) * 0.6, 2), 1.4, 0.5) * 0.7


def sfx_whoosh():
    d = 0.45
    x = noise(d)
    e = np.sin(np.linspace(0, np.pi, len(x))) ** 2
    lo = lp(x, 40) * (1 - np.linspace(0, 1, len(x)))
    hi = lp(x, 6) * np.linspace(0, 1, len(x))
    return (lo + hi) * e * 0.55


def sfx_glitch(d=0.8):
    out = np.zeros(int(d * SR))
    i = 0
    while i < len(out):
        seg = int(rng.uniform(0.02, 0.07) * SR)
        f = rng.choice([110, 220, 440, 880, 1760, 3520]) * rng.uniform(0.9, 1.1)
        x = osc(f, seg / SR, rng.choice(["square", "saw"]))
        x = np.round(x * 4) / 4
        m = min(len(x), len(out) - i)
        out[i:i + m] = x[:m] * rng.uniform(0.2, 0.6)
        i += seg
    return out * 0.5


def sfx_explode():
    d = 1.6
    x = lp(noise(d), 12) * env(int(d * SR), 0.002, 0.35) * 1.4
    s = osc(lambda t: 45 + 60 * np.exp(-t * 8), d) * env(int(d * SR), 0.002, 0.4)
    return dist(fit(x, s), 2.5) * 0.9


def sfx_ding():
    d = 1.0
    x = sum(osc(f, d) * a * env(int(d * SR), 0.001, r) for f, a, r in ((1568, 1, 0.4), (2352, 0.5, 0.25), (3920, 0.25, 0.12)))
    return x * 0.4


def sfx_buzzer():
    d = 0.6
    return dist(osc(150, d, "square") * 0.6 + osc(153, d, "saw") * 0.4, 2) * env(int(d * SR), 0.003, None) * 0.4


def sfx_ban():
    return fit(sfx_buzzer(), np.pad(sfx_boom() * 0.8, (int(0.05 * SR), 0)))


def sfx_level():
    seq = [523, 659, 784, 1047, 1319]
    x = np.concatenate([osc(f, 0.07, "square") * env(int(0.07 * SR), 0.002, 0.05) for f in seq[:-1]] +
                       [osc(seq[-1], 0.5, "square") * env(int(0.5 * SR), 0.002, 0.2)])
    return lp(x, 2) * 0.32


def sfx_join():
    return np.concatenate([osc(784, 0.08) * env(int(0.08 * SR), 0.002, 0.05),
                           osc(1175, 0.25) * env(int(0.25 * SR), 0.002, 0.08)]) * 0.5


def sfx_leave():
    return np.concatenate([osc(1175, 0.08) * env(int(0.08 * SR), 0.002, 0.05),
                           osc(587, 0.3) * env(int(0.3 * SR), 0.002, 0.1)]) * 0.5


def sfx_react():
    return osc(lambda t: 1400 + 1200 * t / 0.06, 0.06) * env(int(0.06 * SR), 0.001, 0.02) * 0.35


def sfx_pops(d=1.2):
    out = np.zeros(int((d + 0.2) * SR))
    for k in range(int(d * 14)):
        p = osc(lambda t: rng.uniform(500, 1300) * (1 + t * 30), 0.05) * env(int(0.05 * SR), 0.001, 0.012)
        i = int(rng.uniform(0, d) * SR)
        out[i:i + len(p)] += p * 0.35
    return out


def sfx_type(d):
    out = np.zeros(int(d * SR) + SR // 10)
    t = 0.0
    while t < d:
        i = int(t * SR)
        c = hp(noise(0.012), 3) * env(int(0.012 * SR), 0.0005, 0.003) * 0.12
        out[i:i + len(c)] += c
        t += rng.uniform(0.05, 0.11)
    return out


SFX = {"ping": sfx_ping, "boom": sfx_boom, "bass": sfx_bass, "scratch": sfx_scratch, "horn": sfx_horn,
       "sting": sfx_sting, "whoosh": sfx_whoosh, "explode": sfx_explode, "ding": sfx_ding, "buzzer": sfx_buzzer,
       "ban": sfx_ban, "level": sfx_level, "join": sfx_join, "leave": sfx_leave, "react": sfx_react, "pop": sfx_ping}
DUR_SFX = {"type": sfx_type, "glitch": sfx_glitch, "pops": sfx_pops}
DUCK = {"boom", "bass", "explode", "sting", "ban", "horn", "scratch"}


# ---------- music ----------
def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


def music(dur, style):
    n = int(dur * SR) + 2 * SR
    out = np.zeros(n)

    def put(x, t, g=1.0):
        i = int(t * SR)
        if i >= n:
            return
        seg = x[: n - i]
        out[i:i + len(seg)] += seg * g

    if style == "chill":
        bpm, root, prog = 88, 53, [0, -3, -7, -5]
    else:
        bpm, root, prog = 145, 45, [0, 0, -4, -2]  # A minor-ish, bouncy
    beat = 60 / bpm
    bar = 4 * beat
    kick = dist(osc(lambda t: 48 + 150 * np.exp(-t * 30), 0.3) * env(int(0.3 * SR), 0.001, 0.09), 2)
    clap = hp(noise(0.18), 5) * env(int(0.18 * SR), 0.001, 0.04)
    hat = hp(noise(0.03), 2) * env(int(0.03 * SR), 0.0005, 0.007)
    b = 0
    while b * bar < dur + bar:
        t0 = b * bar
        r = root + prog[b % len(prog)]
        if style == "chill":
            for m in (r + 12, r + 16, r + 19, r + 23):
                put(osc(hz(m), bar, "tri") * env(int(bar * SR), 0.03, 1.6), t0, 0.05)
            put(osc(hz(r - 12), bar * 0.9) * env(int(bar * 0.9 * SR), 0.01, 0.9), t0, 0.14)
            for k in (0, 2):
                put(kick, t0 + k * beat, 0.25)
            for k in range(8):
                put(hat, t0 + k * beat / 2, 0.06)
        else:
            # 808 bass pattern
            for st_, ln in ((0, 1.5), (1.5, 1.0), (2.75, 1.25)):
                d = ln * beat
                bass = osc(lambda t, f=hz(r - 12): f * (1 + 0.5 * np.exp(-t * 40)), d) * env(int(d * SR), 0.002, d * 0.9)
                put(dist(bass * 1.5, 2), t0 + st_ * beat, 0.32)
            for k in (0, 1.5, 2.75):
                put(kick, t0 + k * beat, 0.42)
            put(clap, t0 + 1 * beat, 0.32)
            put(clap, t0 + 3 * beat, 0.32)
            steps = 16 if b % 4 == 3 else 8
            for k in range(steps):
                put(hat, t0 + k * bar / steps, 0.1 if k % 2 == 0 else 0.07)
            # pluck melody (minor pentatonic), new pattern every 2 bars
            pent = [0, 3, 5, 7, 10, 12, 15]
            mrng = np.random.default_rng(b // 2 + 3)
            for k in range(8):
                if mrng.random() < 0.6:
                    m = r + 24 + pent[mrng.integers(0, len(pent))]
                    d = beat / 2
                    pl = (osc(hz(m), d, "square") * 0.4 + osc(hz(m) * 1.005, d, "saw") * 0.4) * env(int(d * SR), 0.002, 0.07)
                    put(lp(pl, 3), t0 + k * beat / 2, 0.09)
        b += 1
    return out


def main(cfg_path, out_path):
    cfg = json.load(open(cfg_path))
    dur = cfg["duration"]
    n = int(dur * SR)
    mus = music(dur, cfg.get("music", "hype"))[:n]
    mus = np.pad(mus, (0, n - len(mus)))
    gain = np.ones(n)
    fx = np.zeros(n + 4 * SR)
    for ev in cfg["events"]:
        i = int(ev["t"] * SR)
        k = ev["k"]
        if k == "mute":
            j = int((ev["t"] + ev["d"]) * SR)
            gain[i:j] = 0.0
            continue
        s = DUR_SFX[k](ev.get("d", 0.8)) if k in DUR_SFX else SFX[k]()
        fx[i:i + len(s)] += s
        if k in DUCK:  # duck music under big hits
            dd = int(0.9 * SR)
            seg = gain[i:i + dd]
            gain[i:i + dd] = np.minimum(seg, np.linspace(0.15, 1, len(seg)))
    gain = lp(gain, int(0.02 * SR))
    f = int(0.25 * SR)
    mus[:f] *= np.linspace(0, 1, f)
    mus[-int(0.6 * SR):] *= np.linspace(1, 0, int(0.6 * SR))
    mix = mus * gain * 0.75 + fx[:n]
    mix = np.tanh(mix * 1.3) / np.tanh(1.3)  # soft limiter = loud & punchy
    mix = mix / (np.max(np.abs(mix)) or 1) * 0.95
    pcm = (mix * 32767).astype(np.int16)
    with wave.open(out_path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(np.column_stack([pcm, pcm]).ravel().tobytes())


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
