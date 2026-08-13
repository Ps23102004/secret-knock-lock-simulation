# Secret Knock Door Lock — 3D Simulation

ENGR 198 — interactive 3D simulation of a secret-knock door lock built directly from the Desktop reference image.

![Reference image used to design the simulation](public/reference/secret-knock-lock-reference.png)

## What the simulation shows

A user knocks on a door. A vibration sensor catches the knock. An Arduino UNO compares the knock pattern to a secret one. If it matches, the Arduino tells a motor driver to fire battery current into a vertical DC motor. The motor's vertical shaft turns a brass gear. The gear meshes with a horizontal blue rack. The rack drags a bolt out of the door-frame strike plate. **The door unlocks.** A second command runs everything in reverse.

## Reference image

Located on your Desktop:
```
/Users/parthsingh/Desktop/265D9CFE-D9A7-4FD2-8789-AB9D265D10BB.png
```

It is copied into the project at `public/reference/secret-knock-lock-reference.png` and surfaced inside the running app via the **Reference Image** panel in the bottom-right (toggleable).

## System overview

- **Door panel** — vertical wood-plank surface that holds the lock and the strike plate.
- **Lock housing** — dark rectangular case with a transparent / cutaway front cover.
- **Knock sensor module** — vibration mic mounted outside the housing.
- **Arduino UNO** — pattern detection and decision logic.
- **Battery pack** — power source for driver and Arduino.
- **Motor driver (H-bridge)** — gates and reverses motor current.
- **DC motor (vertical mount)** — converts current into rotation.
- **Vertical shaft → main gear → rack gear → sliding bolt** — the mechanical chain.
- **Strike plate** — receiver on the door frame.

See [Mechanical explanation](#mechanical-explanation) and [Electrical explanation](#electrical-explanation) below.

## Mechanical explanation

```
Motor (vertical) ─→ Vertical shaft ─→ Main gear ─→ Rack ─→ Bolt ─→ Strike plate
        ↑                                  ↑
       (Y axis)                       (same Y axis)
```

The motor body, the shaft, and the gear hub all share the same `(x, z)` coordinate, so they pivot around the same vertical axis. The gear teeth engage a horizontal rack at the gear's pitch radius. The rack is rigidly bolted to the bolt, so the bolt moves the same linear distance as the rack.

## Electrical explanation

```
Knock Sensor ──signal(blue)──→ Arduino ──signal(blue)──→ Motor Driver
                                                              ↑
                          Battery ──power(yellow)─────────────┘
                                                              │
                                                              ▼
                                                          DC Motor
```

Wire colors in-app match this legend exactly.

## Animation states

14 sequence states drive the visualization. Full table in `src/data/system-flow.json`. The 7 publicly-numbered steps (mirroring the reference image's `SYSTEM FLOW` panel) are:

1. Knock Detected
2. Pattern Validated
3. Power Activated
4. Motor Rotates
5. Gear Rotates
6. Bolt Retracts
7. Unlocked

A separate **Relock** sequence runs the chain in reverse.

## Controls

HUD on the left:

- **Play Unlock Sequence** / **Play Relock Sequence** / **Reset** / **Step Forward**
- **Speed** slider (0.25× → 2.5×)
- **Camera** presets: Full Assembly, Mechanical Close-Up, Electrical System, Gear Top View, Door / Lock State
- **Toggles**: Labels, Cutaway housing, Electrical flow, Mechanical arrows, Reference image

Keyboard shortcuts:

- **Space** → Play unlock
- **R** → Play relock
- **0** → Reset

### 🎙 Microphone Knock Detection (optional)

Bottom-right panel below the status panel. Lets you trigger the unlock by knocking on the desk near your MacBook.

1. Click **🎙 Enable Mic Knock Detection**.
2. Allow microphone access when the browser prompts.
3. The status flips to **Listening for knock…** and the live audio meter starts moving.
4. Knock, tap, or clap. The meter spikes; status briefly shows **Knock detected!** then **Sequence triggered**, and the unlock animation plays.
5. Cooldown is 1.5 s — one knock won't re-fire the sequence.
6. Adjust the **Sensitivity** slider:
   - Higher = more sensitive (lower trigger threshold) — good for quiet rooms.
   - Lower = less sensitive (higher threshold) — good for noisy rooms.
7. Click **✕ Disable Mic** to release the microphone.

The manual buttons keep working regardless of mic state.

> Mic detection is a sound-transient detector (Web Audio API), not a vibration sensor. See `obsidian/Microphone Knock Detection.md` for details.

## How to run

```bash
cd secret-knock-lock-simulation
npm install
npm run dev
```

The dev server opens at <http://localhost:5173>.

To make a production build:

```bash
npm run build
npm run preview
```

## File structure

```
secret-knock-lock-simulation/
├── README.md
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── index.html
├── public/
│   └── reference/
│       └── secret-knock-lock-reference.png   ← copy of Desktop image
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── styles.css
│   ├── simulation/
│   │   ├── Scene.tsx
│   │   ├── Door.tsx
│   │   ├── LockHousing.tsx
│   │   ├── ArduinoUno.tsx
│   │   ├── KnockSensor.tsx
│   │   ├── BatteryPack.tsx
│   │   ├── MotorDriver.tsx
│   │   ├── DCMotor.tsx
│   │   ├── VerticalShaft.tsx
│   │   ├── MainGear.tsx
│   │   ├── RackBolt.tsx
│   │   ├── Wires.tsx
│   │   ├── FlowArrows.tsx
│   │   ├── Labels.tsx
│   │   ├── StatusPanel.tsx
│   │   ├── AnimationController.tsx
│   │   ├── CameraPresets.tsx
│   │   ├── MicKnockDetector.tsx        ← optional Web Audio knock trigger
│   │   └── ReferenceImagePanel.tsx
│   └── data/
│       ├── graphify-nodes.json
│       ├── system-flow.json
│       ├── components.json
│       └── visual-reference-analysis.json
├── docs/
│   ├── IMAGE_REFERENCE_ANALYSIS.md
│   ├── AGENT_WORKFLOW_LOG.md
│   ├── GRAPHIFY_WORKFLOW.md
│   ├── OBSIDIAN_INDEX.md
│   ├── REVIEW_REPORT.md
│   ├── ADVERSARIAL_REVIEW.md
│   ├── SIMULATION_NOTES.md
│   └── PRESENTATION_SCRIPT.md
└── obsidian/
    ├── Secret Knock Lock Simulation.md
    ├── System Architecture.md
    ├── Mechanical Mechanism.md
    ├── Electrical Flow.md
    ├── Animation Sequence.md
    ├── Microphone Knock Detection.md   ← new
    ├── Graphify Nexus Notes.md
    └── Presentation Notes.md
```

## Recent improvements (upgrade pass)

- **Visible rack teeth** — 16 trapezoidal steel-blue teeth on the rack's gear-facing edge, showing how the brass gear drives the bar.
- **Material upgrade** — `meshPhysicalMaterial` with clearcoat on key parts: gear, shaft, motor, bracket, rack body, rack teeth, sliding bolt, bolt nose, strike plate, and the housing's smoky-gray transparent cover.
- **Color differentiation** — brass gear, steel-blue rack teeth, darker metallic blue rack/bolt body, polished silver shaft, dark gray motor with copper top, brushed silver strike plate.
- **Gear/Rack contact region** — soft yellow translucent sphere fixed at the gear-tangent point, pulsing during motion.
- **Environment map** — drei `<Environment preset="city" />` for plausible reflections.
- **Microphone knock detection** — see [section above](#-microphone-knock-detection-optional).

## Graphify / Nexus data

`src/data/graphify-nodes.json` is a 23-node, 25-edge knowledge graph spanning hardware, signal/power/motion flows, software, and documentation. See `docs/GRAPHIFY_WORKFLOW.md` for the schema and intended use.

`src/data/system-flow.json` defines the 14 sequence states and is the **canonical timeline** for the animation.

## Obsidian documentation

Drop the `obsidian/` folder into any Obsidian vault — every note uses Obsidian-style `[[wikilinks]]` so the graph wires itself up. The main entry point is `Secret Knock Lock Simulation.md`. See `docs/OBSIDIAN_INDEX.md`.

## Known assumptions

- AA cell count is illustrative (4× AA in series ≈ 6V is a common Arduino-friendly setup; 2 cells are rendered for clarity).
- The motor driver IC is generic.
- Knock-pattern algorithm is conceptual — we visualize "validation" but don't model the timing array.
- Door does not swing open after unlock (out of scope; reference image doesn't include door motion).
- Rack travel and gear rotation are visually exaggerated, not physically scaled. See `docs/SIMULATION_NOTES.md`.

## Troubleshooting

- **Transparent housing looks solid.** You're on a very old browser. The cover uses `meshPhysicalMaterial.transmission` which needs a recent Chromium / Firefox / Safari. Untoggle "Cutaway housing" → still see internals via the open-back design? They're all in the cavity, but transparency is the intended view.
- **Three.js shader warnings on first load.** Normal first-frame compilation noise; ignore.
- **Port 5173 in use.** `npm run dev -- --port 5174`.
- **Reference image doesn't load in the panel.** Make sure `public/reference/secret-knock-lock-reference.png` exists; rebuild Vite.

### Mic knock detection troubleshooting

- **Mic permission denied** — reload the page and allow it. If you previously blocked it, clear the site's mic permission in your browser's site settings (or use a fresh Incognito window).
- **No detection** — increase the sensitivity slider, knock harder, or knock closer to the laptop. The default sensitivity (45%) is tuned for a moderate-noise room.
- **False triggers** — drop the sensitivity slider, reduce background noise, or move away from a fan / open window. Loud claps from across the room can fire it; that's expected.
- **Browser doesn't prompt** — most browsers require a user gesture before requesting the mic. The "Enable Mic Knock Detection" button is that gesture.
- **Doesn't work over the network** — the Web Audio mic API requires HTTPS or `localhost`. Vite's dev server uses `http://localhost`, which is allowed. If you serve the build over `http://192.168.x.x` it will be denied.
- **macOS first-time use** — macOS pops a system-level prompt asking whether the browser may use the microphone. Allow once; subsequent uses don't re-prompt.

## Sub-agent workflow

This project was built by 10 simulated sub-agents (Codex unavailable on this run). The full log is in `docs/AGENT_WORKFLOW_LOG.md`.
