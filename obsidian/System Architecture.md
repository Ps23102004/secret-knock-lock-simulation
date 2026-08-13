# System Architecture

Three subsystems: **electrical**, **mechanical**, and **software/visualization**. They meet at the DC motor.

```
[Knock Sensor] --signal--> [Arduino] --signal--> [Motor Driver]
       ^                                                ^
       │ (manual)                  [Battery Pack] --power--/
       │                                                |
       │                                                v
       │                                       [DC Motor (vertical)]
       │                                                |
       │                                          [Vertical Shaft]
       │                                                |
       │                                            [Main Gear]
       │                                                |
       │                                            [Rack Gear  ← teeth visible on -Z face]
       │                                                |
       │                                          [Sliding Bolt]
       │                                                |
       │                                          [Strike Plate]
       │
       │  ╔═══ Optional input path ═══════════════╗
       └──╢ MacBook Mic                           ║
          ║   → Web Audio API                     ║
          ║      → AnalyserNode                   ║
          ║         → Mic Knock Detector          ║
          ║            → fires `play_unlock`      ║
          ╚═══════════════════════════════════════╝
```

The optional mic path is a *substitute* for clicking the manual unlock button — it does **not** reach the on-screen knock sensor's electrical inputs (those are simulated in software). When a mic-detected knock fires, the unlock sequence runs identically, including the on-screen blue knock waves and the sensor-mic glow, because those visuals are owned by the `knock_detected` phase of the AnimationController.

## Subsystems

- [[Electrical Flow]] — covers everything from the sensor through the motor driver.
- [[Mechanical Mechanism]] — covers everything from the motor through the bolt.
- [[Animation Sequence]] — covers the time-ordered sequence that exercises all of the above.
- [[Graphify Nexus Notes]] — covers the static graph of nodes / edges / flows.

## Software layer

- `App.tsx` — top-level UI + canvas mount.
- `simulation/Scene.tsx` — composition of all 3D groups.
- `simulation/AnimationController.tsx` — the state machine.
- `simulation/CameraPresets.tsx` — five camera shots.
- `simulation/StatusPanel.tsx` — the right-side System Flow card.

## Layout reference

The layout matches the [[Secret Knock Lock Simulation]] reference image: knock sensor outside the housing on the left, Arduino top-left, battery top-right, motor driver mid-right, motor in the center pointing down, and the rack/bolt extending to the right into the strike plate.

## Related Notes

- [[Secret Knock Lock Simulation]] — project hub
- [[Secret Knock Door Lock]] — physical Arduino prototype
- [[ENGR 198]] · [[Engineering Projects]] · [[University Dashboard]]
- [[Mechanical Mechanism]] · [[Electrical Flow]] · [[Animation Sequence]] · [[Microphone Knock Detection]] · [[Graphify Nexus Notes]] · [[Presentation Notes]]
- [[Obsidian Knowledge Graph]]
