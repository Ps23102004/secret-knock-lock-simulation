# Mechanical Mechanism

The mechanical chain is the load-bearing requirement of this project. Everything else exists to fire it.

## Chain of motion

1. **DC Motor (vertical mount)** — brushed motor, body axis aligned with the global Y-axis. Mounted to a bracket that bolts to the back wall of the lock housing.
2. **Vertical Motor Shaft** — silver shaft on the same Y-axis, exits the bottom of the motor. An orange marker stripe runs along the shaft so any rotation is immediately visible.
3. **Main Gear** — brass spur gear with 18 teeth, hub on the same Y-axis as the shaft. A coupler joins shaft and hub.
4. **Rack Gear** — toothed bar oriented along X. Its tooth crests sit at the gear's pitch radius so they engage cleanly.
5. **Sliding Bolt** — rigidly attached to the rack. Slides through a slot in the right wall of the housing.
6. **Strike Plate** — fixed to the door frame. Receives the bolt when locked.

## Why a vertical motor + horizontal rack?

- A vertical motor lets the gear rotate in a horizontal plane.
- A horizontal plane gear naturally meshes with a horizontal rack.
- A horizontal rack moves the bolt in a horizontal direction, which is exactly the direction needed to enter / exit the strike plate.

The result is a minimal-coupling mechanism: motor → coupler → gear → rack → bolt. No bevel gears, no right-angle drives, no extra linkages.

## Numerical pinning

| Component   | x      | y     | z     |
|-------------|--------|-------|-------|
| Motor body  | -0.05  | 0.95  | 0.16  |
| Shaft       | -0.05  | 0.50  | 0.16  |
| Gear hub    | -0.05  | 0.27  | 0.16  |

Same `x` and `z`. Vertical alignment is therefore guaranteed by code.

## Visual cues that prove rotation

- Orange shaft marker stripe.
- Orange tooth-tip marker on one gear tooth.
- Curved yellow rotation arrow ring above the gear AND above the motor body (animates).
- Green motion arrow along the bolt (only during the bolt-retract phase).
- **Soft yellow contact-region pulse** at the gear/rack engagement point (fixed in world space — does not move with the rack — making it obvious that this is *the* place where the gear hands torque off to the rack).

## Rack teeth detail

The rack has 16 trapezoidal teeth on its -Z face (the side facing the gear). Each tooth is a two-piece compound:

- **Base block** — wider, sits on the rack body, bright steel-blue (`#60a5fa`).
- **Tip block** — narrower, projects further toward the gear, even lighter blue (`#93c5fd`).

The base+tip silhouette reads as a tapered tooth from any angle. Both pieces use `meshPhysicalMaterial` with a clearcoat for the brushed-blue look in the reference image.

### Why visible teeth matter

Without prominent teeth, the rack looks like a simple sliding bar that just happens to move when the motor turns. With teeth that visibly mesh against the gear, viewers can *see* the cause-and-effect of rotational → linear motion conversion. This is the single most-pointed-at part of the mechanism in a class demo.

### Gear/Rack contact region

A pale-yellow translucent sphere sits at the fixed engagement point (world `(-0.05, 0.27, 0.37)`). It pulses while `motionActive` is true, so the eye is drawn there at exactly the moment when torque is being transferred. The sphere does **not** move with the rack — it stays at the gear's tangent — so the contrast between the moving rack and the stationary contact-region makes the kinematics legible.

## Cross-references

- See [[Electrical Flow]] for the upstream "why does the motor turn?".
- See [[Animation Sequence]] for the timing.
- See [[Graphify Nexus Notes]] for the canonical node IDs.

## Related Notes

- [[Secret Knock Lock Simulation]] — project hub
- [[Secret Knock Door Lock]] — physical Arduino prototype
- [[ENGR 198]] · [[Engineering Projects]] · [[University Dashboard]]
- [[Microphone Knock Detection]] · [[System Architecture]] · [[Presentation Notes]]
- [[Obsidian Knowledge Graph]]
