"""Original music + sound effects (synthesised, royalty-free).
Usage: python3 audio.py out.wav [reel|showcase]
  reel      — timings match reel.mjs (default)
  showcase  — timings match showcase.mjs
  problems  — timings match problems-reel.mjs
"""
import sys
import wave

import numpy as np

SR = 44100
TIMELINE = sys.argv[2] if len(sys.argv) > 2 else "reel"
DUR = {"showcase": 30.0, "problems": 29.0}.get(TIMELINE, 25.0)
N = int(SR * DUR)
BPM = 120
BEAT = 60 / BPM
rng = np.random.default_rng(7)

music = np.zeros(N)
sfx = np.zeros(N)


def t_(d):
    return np.arange(int(SR * d)) / SR


def add(buf, at, sig, gain=1.0):
    i = int(at * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i] * gain


def smooth(x, k):
    k = max(1, int(k))
    return np.convolve(x, np.ones(k) / k, mode="same")


def noise(d):
    return rng.uniform(-1, 1, int(SR * d))


def hp(x, k=8):
    return x - smooth(x, k)


def note(n):  # MIDI → Hz
    return 440 * 2 ** ((n - 69) / 12)


def tone(freq, d, harmonics=(1,), decay=6.0):
    t = t_(d)
    s = sum(np.sin(2 * np.pi * freq * h * t) / h for h in harmonics)
    return s * np.exp(-decay * t)


# ---------------- instruments ----------------
def kick():
    t = t_(0.32)
    f = 50 + 110 * np.exp(-28 * t)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-9 * t) + 0.3 * noise(0.32) * np.exp(-120 * t)


def clap():
    d = 0.22
    t = t_(d)
    env = np.exp(-22 * t) + 0.6 * np.exp(-60 * np.maximum(t - 0.012, 0)) * (t > 0.012)
    return smooth(hp(noise(d), 6), 3) * env * 0.55


def hat(open_=False):
    d = 0.18 if open_ else 0.05
    t = t_(d)
    return smooth(hp(noise(d), 2), 2) * np.exp(-(18 if open_ else 80) * t) * 0.16


def bass(freq, d):
    t = t_(d)
    s = sum(np.sin(2 * np.pi * freq * h * t) / h for h in (1, 2, 3, 4))
    env = np.minimum(1, t * 200) * np.exp(-3 * t)
    return smooth(s * env, 6) * 0.55


def pluck(freq, d=0.35):
    t = t_(d)
    vib = 1 + 0.004 * np.sin(2 * np.pi * 6 * t)
    s = sum(np.sin(2 * np.pi * freq * h * vib * t) * (0.6 ** h) for h in range(1, 6))
    return s * np.exp(-9 * t) * np.minimum(1, t * 400)


def pad(freqs, d):
    t = t_(d)
    s = sum(np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 2.003 * t) for f in freqs)
    env = np.minimum(1, t / 0.3) * np.minimum(1, (d - t) / 0.3)
    return s * env * 0.08


# ---------------- music ----------------
# I–V–vi–IV in C: C, G, Am, F (one chord per bar of 4 beats)
CHORDS = [(48, [60, 64, 67]), (43, [59, 62, 67]), (45, [60, 64, 69]), (41, [60, 65, 69])]
HOOK = [72, 0, 76, 79, 0, 76, 74, 72, 74, 0, 74, 76, 0, 74, 71, 67,
        72, 0, 76, 79, 0, 81, 79, 76, 77, 0, 76, 74, 0, 72, 74, 72]
DROP = 2.0
END = DUR - 0.8
bar = 4 * BEAT

# intro: pad + building hats + riser
add(music, 0, pad([note(n) for n in CHORDS[0][1]], DROP), 1.0)
for k in range(int(DROP / (BEAT / 2))):
    add(music, k * BEAT / 2, hat(), 0.4 + 0.4 * k / 8)
rt = t_(DROP)
riser = smooth(noise(DROP), 14) * (rt / DROP) ** 2 * 0.35 + np.sin(2 * np.pi * np.cumsum(200 + 900 * (rt / DROP) ** 2) / SR) * (rt / DROP) ** 3 * 0.12
add(music, 0, riser)

beat_times = np.arange(DROP, END, BEAT)
for i, bt in enumerate(beat_times):
    b = i % 4
    root, triad = CHORDS[(i // 4) % 4]
    add(music, bt, kick(), 0.9)
    if b in (1, 3):
        add(music, bt, clap(), 0.7)
    add(music, bt, hat(), 0.5)
    add(music, bt + BEAT / 2, hat(open_=(b == 3)), 0.7)
    # bouncing bass: root on beat, octave on the off-beat
    add(music, bt, bass(note(root), BEAT * 0.45), 1.0)
    add(music, bt + BEAT / 2, bass(note(root + 12), BEAT * 0.4), 0.7)
    # off-beat chord stabs
    for n in triad:
        add(music, bt + BEAT / 2, pluck(note(n), 0.22), 0.08)

# hook melody in 8ths, from the first bar after the drop
step = BEAT / 2
for k, t0 in enumerate(np.arange(DROP, END, step)):
    n = HOOK[k % len(HOOK)]
    if n:
        add(music, t0, pluck(note(n), 0.4), 0.17)

# sidechain-style pump on every kick
env = np.ones(N)
for bt in beat_times:
    i = int(bt * SR)
    seg = 1 - 0.45 * np.exp(-t_(BEAT) * 14)
    j = min(N, i + len(seg))
    env[i:j] = np.minimum(env[i:j], seg[: j - i])
music *= env
# fade out
fo = int(END * SR)
music[fo:] *= np.linspace(1, 0, N - fo)


# ---------------- sound effects ----------------
def pop():
    t = t_(0.09)
    f = 300 + 900 * np.exp(-40 * t)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-35 * t)


def whoosh(d=0.45):
    t = t_(d)
    env = np.sin(np.pi * t / d) ** 2
    n = noise(d)
    return (smooth(n, 28) * 2.2 + smooth(hp(n, 6), 4) * 0.12 * (t / d)) * env


def fall_whistle(d=0.5, f0=1400, f1=350):
    t = t_(d)
    f = f0 + (f1 - f0) * (t / d)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, t * 30) * 0.5


def thud():
    t = t_(0.4)
    f = 40 + 80 * np.exp(-20 * t)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-8 * t) + smooth(noise(0.4), 10) * np.exp(-25 * t) * 0.6


def boing():
    t = t_(0.6)
    f = 160 + 260 * t + 90 * np.sin(2 * np.pi * 13 * t) * np.exp(-4 * t)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-4 * t) * 0.8


def stamp():
    t = t_(0.3)
    return thud()[: len(t)] * 0.9 + smooth(hp(noise(0.3), 5), 3) * np.exp(-45 * t) * 0.3


def ding():
    t = t_(1.4)
    return sum(np.sin(2 * np.pi * 1318 * r * t) * a * np.exp(-d * t) for r, a, d in ((1, 1, 3), (2.76, .4, 6), (5.4, .2, 9))) * 0.5


def sparkle(d=0.7):
    out = np.zeros(int(SR * d))
    for _ in range(14):
        s = tone(rng.uniform(2200, 5200), 0.12, decay=30) * 0.25
        i = int(rng.uniform(0, d - 0.12) * SR)
        out[i:i + len(s)] += s
    return out


def popper():
    t = t_(0.5)
    return smooth(hp(noise(0.5), 5), 3) * np.exp(-14 * t) * 0.4 + np.concatenate([pop(), np.zeros(len(t) - len(pop()))])


def horn():
    out = np.zeros(int(SR * 0.42))
    for at in (0, 0.22):
        t = t_(0.16)
        s = (np.sign(np.sin(2 * np.pi * 440 * t)) + np.sign(np.sin(2 * np.pi * 554 * t))) * 0.18
        s = smooth(s, 4) * np.minimum(1, (0.16 - t) * 60)
        i = int(at * SR)
        out[i:i + len(s)] += s
    return out


def hiss():
    t = t_(0.6)
    return smooth(hp(noise(0.6), 3), 2) * np.exp(-6 * t) * 0.28


def whirr(d=1.0):
    t = t_(d)
    f = 90 + 60 * np.sin(2 * np.pi * 4 * t)
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.5 + smooth(noise(d), 20) * 0.6) * np.sin(np.pi * t / d) * (0.6 + 0.4 * np.sin(2 * np.pi * 8 * t))


def tick():
    t = t_(0.05)
    return np.sin(2 * np.pi * 2200 * t) * np.exp(-90 * t) * 0.6


REEL_EVENTS = [
    (0.15, pop(), .8), (0.6, whoosh(), .5), (1.0, sparkle(), .5),
    (1.5, fall_whistle(), .6), (2.0, thud(), 1.0), (2.0, boing(), .7), (2.2, pop(), .7),
    (3.5, stamp(), .6), (3.5, whoosh(.3), .4),
    (4.5, stamp(), .6), *[(4.6 + k * .25, tick(), .7) for k in range(4)],
    (5.5, stamp(), .9), (5.5, popper(), .8), (5.5, sparkle(1.0), .6), (5.5, whoosh(.5), .5),
    *[(5.7 + rng.uniform(0, 1.2), pop(), .35) for _ in range(9)],
    (7.5, whoosh(.6), .7), (7.75, horn(), .6),
    (8.6, pop(), .6), (8.6, whirr(1.05), .7),
    (9.7, fall_whistle(.2, 1600, 600), .5), (9.9, stamp(), .9), (9.95, hiss(), .8), (9.95, pop(), .5),
    (10.8, pop(), .5), (10.85, fall_whistle(.25, 1500, 500), .5), (11.1, thud(), .9), (11.2, pop(), .6), (11.3, ding(), .5),
    (12.0, whoosh(.4), .5), (12.4, stamp(), .75), (12.9, stamp(), .75), (13.4, stamp(), .75), (13.9, stamp(), .75), (14.0, ding(), .4),
    (14.2, pop(), .6),
    (15.5, whoosh(.3), .4), (15.75, stamp(), 1.0), (15.75, sparkle(), .5), (16.0, pop(), .7),
    (16.1, whoosh(.7), .7), (16.9, horn(), .7), (17.6, whoosh(.8), .7),
    (18.75, popper(), .9), (18.75, stamp(), .8), (18.75, sparkle(1.0), .7), (18.9, pop(), .6), (19.5, ding(), .6),
    (21.6, whoosh(.4), .5), (22.0, popper(), .6), (22.2, pop(), .7), (22.5, pop(), .7), (22.8, pop(), .7),
    (23.0, pop(), .6), (24.0, ding(), .6),
]
# showcase.mjs: post k lands at 2.5 + 1.5k (16 posts), outro from 26.5
POST_T = [2.5 + 1.5 * k for k in range(16)]
SHOWCASE_EVENTS = [
    (0.1, pop(), .8), (0.5, whoosh(), .5), (0.9, pop(), .6), (1.0, sparkle(), .4),
    (1.5, fall_whistle(), .6), (2.0, thud(), 1.0), (2.0, boing(), .7),
    *[(t - 0.12, whoosh(.32), .55) for t in POST_T],
    *[(t + 0.25, pop(), .45) for t in POST_T],
    (POST_T[4] + 0.2, popper(), .6), (POST_T[4] + 0.2, sparkle(), .5),
    (POST_T[3] + 0.3, horn(), .5), (POST_T[1] + 0.3, ding(), .3), (POST_T[15] + 0.3, ding(), .4),
    (26.4, whoosh(.4), .6), (26.7, stamp(), .9), (26.7, popper(), .7), (26.7, sparkle(1.0), .6),
    (27.3, pop(), .7), (27.6, pop(), .7), (27.9, pop(), .7), (28.6, ding(), .6),
]


def buzz():
    out = np.zeros(int(SR * 0.42))
    for at in (0, 0.2):
        t = t_(0.16)
        s = smooth(np.sign(np.sin(2 * np.pi * 150 * t)) + 0.5 * np.sign(np.sin(2 * np.pi * 157 * t)), 6) * 0.22
        i = int(at * SR)
        out[i:i + len(s)] += s * np.minimum(1, (0.16 - t) * 80)
    return out


# problems-reel.mjs: post k lands at 2.5 + 2.5k (9 posts), problem at +0.6, solution at +1.45, outro from 25
PROB_T = [2.5 + 2.5 * k for k in range(9)]
PROBLEM_EVENTS = [
    (0.1, pop(), .8), (0.5, whoosh(), .5), (0.9, pop(), .6), (1.0, sparkle(), .4),
    (1.5, fall_whistle(), .6), (2.0, thud(), 1.0), (2.0, boing(), .7),
    *[(t - 0.12, whoosh(.32), .55) for t in PROB_T],
    *[(t + 0.6, buzz(), .7) for t in PROB_T],
    *[(t + 1.45, ding(), .45) for t in PROB_T],
    *[(t + 1.45, sparkle(.6), .45) for t in PROB_T],
    (24.9, whoosh(.4), .6), (25.2, stamp(), .9), (25.2, popper(), .7), (25.2, sparkle(1.0), .6),
    (25.8, pop(), .7), (26.1, pop(), .7), (26.4, pop(), .7), (27.6, ding(), .6),
]
EVENTS = {"showcase": SHOWCASE_EVENTS, "problems": PROBLEM_EVENTS}.get(TIMELINE, REEL_EVENTS)
for at, sig, g in EVENTS:
    add(sfx, at, sig, g)

mix = music * 0.55 + sfx * 0.75
mix = np.tanh(mix * 1.1)
mix /= np.max(np.abs(mix)) + 1e-9
mix *= 0.9
# tiny stereo width: delay the right channel by 8 ms on the music bed
right = mix.copy()
d = int(0.008 * SR)
right[d:] = 0.85 * mix[d:] + 0.15 * mix[:-d]
stereo = np.stack([mix, right], axis=1)
pcm = (stereo * 32767).astype(np.int16)

with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("audio ok", sys.argv[1])
