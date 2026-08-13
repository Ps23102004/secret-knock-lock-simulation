# Image Reference Analysis

**Source file:** `/Users/parthsingh/Desktop/265D9CFE-D9A7-4FD2-8789-AB9D265D10BB.png`
**Copied into project:** `public/reference/secret-knock-lock-reference.png`
**Analyzed by:** Visual Reference Analyst (sub-agent #2)
**Analyzed on:** 2026-04-25

## Scene description

The reference image is an annotated 3D rendering of a smart door lock mounted on a vertical wood-plank door. The lock housing is rectangular with a transparent / cutaway front cover that exposes the internal Arduino UNO, battery pack, motor driver, vertical DC motor, vertical drive shaft, brass main gear, blue rack gear, and the sliding bolt. To the right of the housing is a strike plate on the door frame that the bolt seats into when the door is locked.

Three legend / status panels surround the main render:

- **Top-right** — `SYSTEM FLOW` lists 7 numbered steps from "Knock Detected" to "Unlocked".
- **Bottom-center** — `ELECTRICAL FLOW` legend mapping arrow colors to meaning:
  - Blue → signal flow
  - Yellow / orange → power flow
  - Black → ground
  - Green → physical mechanical motion
- **Bottom-center-right** — `LOCK STATES` panel showing LOCKED (red, bolt extended) and UNLOCKED (green, bolt retracted).
- **Bottom-left** — `MECHANICAL CLOSE-UP` panel zooming into the gear / rack / shaft assembly with the caption "Vertical Motor Shaft Drives Gear, Gear Rotates → Rack Moves → Bolt Retracts".

## Component layout

| ID                          | Where it sits in the image          | Notes                                                |
|-----------------------------|-------------------------------------|------------------------------------------------------|
| Knock Sensor Module         | Outside housing, left of door       | Black puck with grille; blue waves indicate vibration|
| Arduino UNO                 | Inside housing, top-left            | Green PCB, silver USB jack, ATmega chip              |
| Battery Pack                | Inside housing, top-right           | Black holder with 2 visible cells                    |
| Motor Driver                | Inside housing, mid-right           | Small green PCB with blue terminals                  |
| DC Motor (Vertical Mount)   | Inside housing, center-vertical     | Dark cylinder, copper top, **vertical axis**         |
| Vertical Motor Shaft        | Below motor                         | Silver shaft, **same vertical axis as motor + gear** |
| Main Gear                   | Below shaft                         | Brass spur gear with visible teeth                   |
| Rack Gear                   | To the right of main gear           | Blue/teal toothed bar, horizontal                    |
| Sliding Bolt                | Right end of rack                   | Blue bolt extending toward strike plate              |
| Strike Plate                | Door frame, to the right            | Brushed metal receiver                               |

## Hard design constraints derived from the image

1. The motor MUST be vertical. The body is a cylinder whose axis is the Y-axis.
2. The motor shaft MUST exit the bottom of the motor and continue downward.
3. The motor shaft, the motor body, and the main gear MUST share one vertical axis.
4. The gear must visibly rotate when the shaft rotates.
5. The gear must engage a horizontal rack gear; rack must slide as the gear turns.
6. The bolt is rigid with the rack and must seat into a strike plate on the frame.
7. Color coding for arrows must follow the legend exactly.
8. A 7-step System Flow side panel must mirror the reference legend order.
9. A LOCKED/UNLOCKED indicator must be visible at all times.
10. A "MECHANICAL CLOSE-UP" camera preset is required (matching the inset).

## Mapping from image annotations → simulation components

- **"1. Knock Detected"** → `KnockSensor.tsx` + animated knock-wave rings
- **"2. Pattern Validated"** → Arduino LED blink + `StatusPanel` step 2 highlight
- **"3. Power Activated"** → Battery + power wires glow yellow
- **"4. Motor Rotates"** → DC motor + shaft visibly rotating with orange marker
- **"5. Gear Rotates"** → Main gear rotating; curved yellow rotation arrow
- **"6. Bolt Retracts"** → Rack + bolt translating; green motion arrow
- **"7. Unlocked"** → Strike plate green dot, status panel green
