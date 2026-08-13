# Animation Sequence

The simulation runs a 14-state machine. The first 10 states are the **unlock** path; the remaining 4 are the **relock** path.

## Unlock path

| # | State              | What you see                                                                                          | What's flowing |
|---|--------------------|-------------------------------------------------------------------------------------------------------|----------------|
| 1 | `locked_idle`      | Bolt extended, red LOCKED indicator, nothing animated                                                  | none           |
| 2 | `knock_detected`   | Blue waves expand from the knock sensor; sensor mic glows                                              | signal         |
| 3 | `pattern_validated`| Arduino pin-13 LED blinks                                                                              | signal         |
| 4 | `power_activated`  | Yellow wires from battery to driver glow; driver status LED on                                         | signal + power |
| 5 | `motor_rotates`    | Motor body indicates power; shaft begins to rotate                                                     | power + motion |
| 6 | `shaft_drives_gear`| Orange shaft marker visibly rotating                                                                   | power + motion |
| 7 | `gear_rotates`     | Brass gear rotating, curved yellow arrow above it                                                      | power + motion |
| 8 | `rack_moves`       | Blue rack slides left, dragging the bolt                                                               | power + motion |
| 9 | `bolt_retracts`    | Bolt clears the strike plate; green motion arrow on bolt                                               | power + motion |
|10 | `unlocked`         | Status panel green; strike-plate dot green; everything quiets down                                     | none           |

## Relock path

| # | State              | What you see                                                                                          | What's flowing |
|---|--------------------|-------------------------------------------------------------------------------------------------------|----------------|
|11 | `relock_requested` | Brief blue signal pulse (Arduino re-enables driver in reverse)                                         | signal         |
|12 | `motor_reverses`   | Gear rotation arrow reverses; gear and shaft turn the other way                                        | power + motion |
|13 | `bolt_extends`     | Rack slides back right; bolt re-enters strike plate                                                    | power + motion |
|14 | `locked_again`     | Status panel returns to red LOCKED                                                                     | none           |

## Sources of truth

- Code state machine: `src/simulation/AnimationController.tsx`.
- Canonical state definitions and durations: `src/data/system-flow.json`.
- Visual indicators per state: `src/data/components.json` and `src/data/visual-reference-analysis.json`.

## Cross-references

- [[Mechanical Mechanism]] — what physically happens during states 5–9 and 12–13.
- [[Electrical Flow]] — what is happening on the wires during states 2–4 and 11.
- [[Graphify Nexus Notes]] — for the static graph of `state → active_components`.

## Related Notes

- [[Secret Knock Lock Simulation]] — project hub
- [[Secret Knock Door Lock]] — physical Arduino prototype
- [[ENGR 198]] · [[Engineering Projects]] · [[University Dashboard]]
- [[Microphone Knock Detection]] · [[System Architecture]] · [[Presentation Notes]]
- [[Obsidian Knowledge Graph]]
