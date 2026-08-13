# Presentation Notes

Short script for the ENGR 198 class demo. Full version lives in `docs/PRESENTATION_SCRIPT.md`.

## 30-second pitch

> "This is the secret-knock door lock. You knock the right pattern, the Arduino recognizes it, the motor turns a vertical shaft, the shaft drives a brass gear, the gear pushes a rack, and the rack pulls the bolt out of the strike plate. Door unlocks. To re-lock, the motor reverses and the bolt slides back into place."

## What to click, in order

1. `Camera → Full Assembly` → tour every component.
2. `Camera → Mechanical Close-Up` → click `Play Unlock Sequence`.
3. `Camera → Electrical System` → click `Reset` then `Play Unlock Sequence` again to show the wires light up in order.
4. Show the right-side System Flow steps lighting up in real time.
5. Click `Play Relock Sequence` to show the bolt sliding back.
6. Open the **Reference Image** panel briefly to remind the audience this matches the design.

## If asked

- *Why vertical motor?* See [[Mechanical Mechanism]].
- *How does the knock pattern actually work?* The Arduino measures the time between knocks and compares to a stored pattern with a tolerance window.
- *What's the H-bridge for?* It lets the Arduino reverse the motor for relock.
- *Where's the docs?* `docs/` for engineering notes, `obsidian/` for linked notes, `src/data/` for the knowledge graph.

## Cross-references

- [[Secret Knock Lock Simulation]] — main vault index
- [[System Architecture]]
- [[Mechanical Mechanism]]
- [[Electrical Flow]]
- [[Animation Sequence]]

## Related Notes

- [[Secret Knock Door Lock]] — physical Arduino prototype this script demos
- [[ENGR 198]] · [[Engineering Projects]] · [[University Dashboard]]
- [[Microphone Knock Detection]] · [[Graphify Nexus Notes]]
- [[AI Brain Dashboard]] — workflow used to generate this script
- [[Obsidian Knowledge Graph]]
