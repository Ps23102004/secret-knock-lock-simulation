# Simulation Notes

## Reference image selection

Exactly one image was found on `~/Desktop`:

```
/Users/parthsingh/Desktop/265D9CFE-D9A7-4FD2-8789-AB9D265D10BB.png
```

Modified: 2026-04-25. Single match → used directly. No tie-break required.

Copied to: `public/reference/secret-knock-lock-reference.png` and surfaced in-app via the `Reference Image` panel in the bottom-right.

## Coordinate system

Right-handed Three.js convention:
- **+X** → right (toward door frame and strike plate)
- **+Y** → up (vertical motor axis)
- **+Z** → out of the door (toward the camera)

The door surface is at z ≈ -0.05 (small recess). The lock housing back panel mounts at z ≈ 0.025. Internal cavity occupies z ∈ [0.05, 0.45].

## Key axis: motor → shaft → gear

Pinned positions:

| Component   | x      | y     | z     |
|-------------|--------|-------|-------|
| Motor body  | -0.05  | 0.95  | 0.16  |
| Shaft       | -0.05  | 0.50  | 0.16  |
| Gear hub    | -0.05  | 0.27  | 0.16  |

If you change one of these, change all three.

## Rack travel

`RackBolt.tsx` clamps the rack travel to **0.55 m** for visual readability. The gear rotation in the same time window is **6π radians** (3 full turns). This is intentionally not a physically correct gear-rack ratio; the goal is that both the gear marker and the rack are visibly moving in the same camera frame.

## Animation phases

See `src/data/system-flow.json` for the canonical state list. The React state machine in `AnimationController.tsx` instantiates two phase tables:

- `UNLOCK_PHASES` (10 phases ending at `unlocked`)
- `RELOCK_PHASES` (4 phases ending at `locked_again`)

Each phase has:
- `state` — name shown in `StatusPanel`
- `duration` — seconds at `speed=1`
- `endProgress` — `unlockProgress` value at end of phase (0 = locked, 1 = unlocked)
- `stepIndex` — which of the 7 public steps to highlight in the side panel
- flow flags (`signal` / `power` / `motion` / `knock`) controlling overlays

## Keyboard shortcuts

- **Space** — Play unlock
- **R** — Play relock
- **0** — Reset

## Known assumptions

- AA cells are illustrative (4× AA in series ≈ 6V is a common Arduino-friendly setup).
- Motor driver IC is not labeled — pedagogically generic.
- Knock pattern logic is not modeled; we just show the validation step.
- Door does not swing open after unlock.

## Known limitations

- `meshPhysicalMaterial` transmission is best in modern Chromium / Firefox / Safari; very old browsers may show the cover as solid.
- No mobile-touch optimization; designed for laptop demos.
- Mic knock detection is a sound-transient detector, not a vibration sensor or a pattern matcher. Any single sharp sound louder than `baseline*4` AND your sensitivity threshold will fire the unlock. See `obsidian/Microphone Knock Detection.md`.

## Mic knock detection — internals at a glance

| Setting                  | Value         | Where in code                                 |
|--------------------------|---------------|-----------------------------------------------|
| FFT size                 | 1024          | `MicKnockDetector.tsx` (analyser.fftSize)     |
| Smoothing                | 0.4           | analyser.smoothingTimeConstant                |
| RMS threshold range      | 0.012 .. 0.30 | `sensitivityToThreshold`                      |
| Baseline EMA             | α = 0.985     | `BASELINE_TIME_CONSTANT`                      |
| Baseline floor           | 0.003         | inside `tick()`                               |
| Spike multiplier         | 4.0×          | `SPIKE_MULTIPLIER`                            |
| Cooldown                 | 1500 ms       | `COOLDOWN_MS`                                 |
| Default sensitivity      | 0.45 (45%)    | `DEFAULT_SENSITIVITY`                         |
| Audio constraints        | EC/NS/AGC off | `getUserMedia` audio object                   |

## Materials palette (post-upgrade)

| Component             | Color    | Material                             |
|-----------------------|----------|--------------------------------------|
| Main gear             | `#d99c2b`| meshPhysicalMaterial + clearcoat 0.5 |
| Gear hub              | `#a8761e`| meshPhysicalMaterial                 |
| Vertical shaft        | `#e2e6ec`| meshPhysicalMaterial + clearcoat 0.6 |
| Motor body            | `#2c333d`| meshPhysicalMaterial + clearcoat 0.45|
| Motor top end-cap     | `#b87333`| meshPhysicalMaterial                 |
| Motor bracket         | `#3f4751`| meshPhysicalMaterial                 |
| Rack body             | `#1e40af`| meshPhysicalMaterial + clearcoat 0.4 |
| Rack tooth base       | `#60a5fa`| meshPhysicalMaterial + clearcoat 0.6 |
| Rack tooth tip        | `#93c5fd`| meshPhysicalMaterial + clearcoat 0.7 |
| Sliding bolt          | `#1d4ed8`| meshPhysicalMaterial + clearcoat 0.5 |
| Bolt nose             | `#3b82f6`| meshPhysicalMaterial                 |
| Strike plate          | `#b8bfc9`| meshPhysicalMaterial + clearcoat 0.4 |
| Housing body          | `#161a21`| meshPhysicalMaterial + clearcoat 0.3 |
| Housing transparent cover | `#5a6470` | meshPhysicalMaterial w/ transmission 0.88, attenuation `#3a414b` |
