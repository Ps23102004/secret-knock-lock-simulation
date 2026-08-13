# ENGR 198 — Presentation Script

Total time target: **5 minutes**.

## 0:00 — Opening (15 s)

> "This is a 3D simulation of our Secret Knock Door Lock. The simulation matches the design we'd 3D-print, so even if our physical build isn't ready, you can see exactly how the mechanism is supposed to behave."

Switch to the **Reference Image** panel briefly. State that the simulation was built directly from this image.

## 0:15 — Hardware tour, Full Assembly camera (60 s)

Click `Camera → Full Assembly`. Walk through each component, top to bottom:

- "Mounted on the door, outside the housing, is the **knock sensor module**."
- "Inside the housing on the top-left is the **Arduino UNO**, the brain."
- "Top-right is the **battery pack**."
- "Right of the Arduino is the **motor driver** — that's the H-bridge that switches battery current to the motor."
- "In the middle is the **vertical DC motor**. The shaft goes straight down."
- "The shaft drives the brass **main gear**, which turns the **rack gear**, which slides the **bolt** in or out of the **strike plate** on the door frame."

## 1:15 — Mechanical Close-Up (45 s)

Click `Camera → Mechanical Close-Up`. Click `Play Unlock Sequence`.

- Point out the **orange marker** on the shaft and on the gear tooth — "those make it obvious that the shaft and the gear are rotating around the same vertical axis."
- Point out the **green motion arrow** that appears along the bolt as it retracts.

## 2:00 — Electrical flow (45 s)

Click `Camera → Electrical System`. Click `Reset`, then `Play Unlock Sequence` again.

- "Watch the **blue dots** travel from the sensor into the Arduino."
- "Now the **yellow dots** light up from the battery, through the driver, into the motor."
- "And finally the green motion path triggers."

## 2:45 — System Flow side panel (30 s)

Direct attention to the right-side System Flow panel.

- "Each step of the unlock — knock, validate, power, motor, gear, bolt, unlocked — lights up in real time. This mirrors the legend in our reference image."

## 3:15 — Relock & Reset (30 s)

Click `Play Relock Sequence`. Show the bolt extending back into the strike plate. Show the indicator returning to LOCKED.

## 3:45 — Engineering decisions (60 s)

Talk through 2–3 design choices:

- **Why vertical motor?** Lets the gear rotate in a horizontal plane that perfectly drives the rack — minimal coupling parts, matches the reference design.
- **Why H-bridge driver instead of a relay?** Lets us reverse the motor for relock with one chip.
- **Why a rack and pinion?** Converts continuous rotation into linear bolt travel without solenoids.

## 4:00 — Bonus: real microphone knock (45 s)

Click the **🎙 Enable Mic Knock Detection** button in the bottom-right panel. Allow the browser permission. The status flips to "Listening for knock…" and the green meter wakes up.

> "Now I can knock right on my MacBook and the simulation should react."

Knock once on the desk near the laptop. The "Knock detected!" status flashes, then "Sequence triggered", and the unlock animation plays end-to-end — same visuals as if you'd clicked the button. Cooldown is 1.5 s, so a single sharp knock won't repeat-fire.

If the room is noisy, drop the sensitivity slider; if it doesn't trigger, raise it.

## 4:45 — Wrap (15 s)

> "The full project — 3D simulation, design diagrams, system flow data, microphone knock trigger, and an Obsidian knowledge graph — is in the `secret-knock-lock-simulation` folder. Thanks!"

---

## If asked: how does the knock pattern work?

In the Arduino sketch (not modeled here): record the time deltas between successive knocks; compare against a stored array of expected deltas with a tolerance window of ~30 %. If all deltas match, drive the motor for ~500 ms.

## If asked: what powers the simulation?

Vite + React + TypeScript + Three.js (via `@react-three/fiber` and `@react-three/drei`). Single dev command: `npm run dev`.
