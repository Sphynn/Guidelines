#!/usr/bin/env python3
"""Generate an original upbeat 28s instrumental (120 BPM, C major, tropical-house feel) as WAV.
Hits line up with the Celebration video: drop + confetti at 4.0s, confetti at 15.5s and 22.0s,
fade out into the end card. Usage: make_music.py out.wav"""
import sys
import numpy as np

SR = 44100
DUR = 28.0
BEAT = 0.5  # 120 BPM
N = int(SR * (DUR + 2))
L = np.zeros(N)
R = np.zeros(N)
rng = np.random.default_rng(7)


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def put(sig, t0, gain=1.0, pan=0.0):
    i = int(t0 * SR)
    if i >= N:
        return
    s = sig[: N - i] * gain
    L[i : i + len(s)] += s * (1 - max(0, pan))
    R[i : i + len(s)] += s * (1 + min(0, pan))


def env(n, a, d):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)


def hp(x, k=1):
    for _ in range(k):
        x = np.concatenate([[0], np.diff(x)])
    return x


def lp(x, a):
    y = np.zeros_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc += a * (v - acc)
        y[i] = acc
    return y


def kick():
    n = int(SR * 0.45)
    t = np.arange(n) / SR
    f = 45 + 110 * np.exp(-t / 0.035)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.16) * 1.0


def clap():
    n = int(SR * 0.22)
    x = lp(hp(rng.standard_normal(n), 1), 0.35)
    t = np.arange(n) / SR
    bursts = np.exp(-t / 0.05) + 0.6 * np.exp(-((t - 0.012) % 0.02) / 0.004) * (t < 0.04)
    body = np.sin(2 * np.pi * 190 * t) * np.exp(-t / 0.04) * 0.5
    return (x * 1.6 * bursts + body) * 0.5


def hat(open_=False):
    n = int(SR * (0.25 if open_ else 0.06))
    x = lp(hp(rng.standard_normal(n), 1), 0.55)
    return x * np.exp(-np.arange(n) / SR / (0.07 if open_ else 0.015)) * 0.5


def crash():
    n = int(SR * 2.4)
    x = lp(hp(rng.standard_normal(n), 1), 0.5)
    return x * np.exp(-np.arange(n) / SR / 0.6) * 0.5


def riser(dur):
    n = int(SR * dur)
    x = lp(hp(rng.standard_normal(n), 1), 0.3)
    t = np.linspace(0, 1, n)
    return x * t**2 * 0.5


def pluck(f, dur=0.5):
    n = int(SR * dur)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t / 0.08) + 0.2 * np.sin(2 * np.pi * 4 * f * t) * np.exp(-t / 0.03)
    return s * env(n, 0.003, 0.16)


def bass(f, dur):
    n = int(SR * dur)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * 2 * f * t) + 0.12 * np.sin(2 * np.pi * 3 * f * t)
    return s * np.minimum(1, t / 0.006) * np.exp(-t / (dur * 0.9)) * np.minimum(1, (dur - t) / 0.03)


def pad(freqs, dur):
    n = int(SR * dur)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for f in freqs:
        for det in (-0.004, 0.0, 0.004):
            ff = f * (1 + det)
            s += np.sin(2 * np.pi * ff * t) + 0.3 * np.sin(2 * np.pi * 2 * ff * t) + 0.12 * np.sin(2 * np.pi * 3 * ff * t)
    return s / (3 * len(freqs)) * np.minimum(1, t / 0.35) * np.minimum(1, (dur - t) / 0.25)


_K, _C, _H, _HO, _CR = kick(), clap(), hat(), hat(True), crash()

CHORDS = [  # I V vi IV in C
    ([0, 4, 7], 0),
    ([7, 11, 14], -5),
    ([9, 12, 16], -3),
    ([5, 9, 12], -7),
]
ROOT_C4 = 60
bars = int(DUR / (4 * BEAT))
kick_times = []
sidechain = np.zeros(N)

DROP = 4.0
for b in range(bars + 1):
    t0 = b * 4 * BEAT
    ivals, shift = CHORDS[b % 4]
    chord_m = [ROOT_C4 + i for i in ivals]
    if b % 4 == 1:
        chord_m = [ROOT_C4 + i - 12 for i in ivals]  # keep G chord low
    fl = [mtof(m) for m in chord_m]
    on = t0 < 26.0
    if on:
        put(pad(fl, 4 * BEAT + 0.3), t0, 0.28, 0.2)
    # arpeggio, always (marimba feel, echoed)
    arp_m = [chord_m[0] + 12, chord_m[1] + 12, chord_m[2] + 12, chord_m[0] + 24]
    pat = [0, 1, 2, 3, 2, 1, 2, 1]
    if on:
        for k in range(8):
            tt = t0 + k * BEAT / 2
            f = mtof(arp_m[pat[k]])
            put(pluck(f), tt, 0.30 if tt < DROP else 0.34, -0.25)
            put(pluck(f), tt + 0.375, 0.12, 0.35)  # echo
    # drums, bass, stabs after the drop; pull back kick for a breath at 14-15.5 for the second lift
    if DROP <= t0 < 26.0:
        root = mtof(ROOT_C4 + shift - 24)
        for k in range(4):
            tb = t0 + k * BEAT
            breath = 14.0 <= tb < 15.5
            if not breath:
                put(_K, tb, 0.8)
                kick_times.append(tb)
            if k % 2 == 1:
                put(_C, tb, 0.35 if not breath else 0.25)
            put(_HO, tb + BEAT / 2, 0.3, 0.3)
            if not breath:
                put(bass(root, BEAT * 0.4), tb + BEAT / 2, 0.7)
            put(_H, tb, 0.18, -0.3)
            if tb >= 12.0:
                for sub in (BEAT / 4, 3 * BEAT / 4):
                    put(_H, tb + sub, 0.16, -0.2)
        # offbeat chord stabs
        for k in range(4):
            tb = t0 + k * BEAT + BEAT / 2
            for m in chord_m:
                put(pluck(mtof(m), 0.25), tb, 0.16, 0.15)

put(riser(2.0), 2.0, 0.28)
for ct in (4.0, 15.5, 22.0):
    put(_CR, ct, 0.4)
    put(_K, ct, 0.9)
    kick_times.append(ct)

# sidechain pump on everything except drums: duck pads/bass/arp slightly after each kick
for kt in kick_times:
    i = int(kt * SR)
    n = int(0.25 * SR)
    if i + n < N:
        sidechain[i : i + n] = np.maximum(sidechain[i : i + n], np.exp(-np.arange(n) / SR / 0.09))
duck = 1 - 0.35 * sidechain
# duck applied to whole mix lightly (drums are short and loud, so this mostly lets them pop)
L *= duck
R *= duck

# master: soft clip, fades, normalise
m = np.stack([L, R])
m = np.tanh(m * 1.0)
n_end = int(DUR * SR)
m = m[:, :n_end]
t = np.arange(n_end) / SR
fade = np.where(t > 25.0, np.clip((DUR - 0.2 - t) / 3.2, 0, 1), np.minimum(1, t / 0.15))
m *= fade
m *= 0.7 / np.max(np.abs(m))
out = (m.T * 32767).astype("<i2")
import wave

with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(out.tobytes())
print("wrote", sys.argv[1])
