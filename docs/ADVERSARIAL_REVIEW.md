# Adversarial Engineering Review

Reviewer: Sub-agent #9 (Adversarial Engineering Reviewer)
Date: 2026-04-25

The point of this pass is to attack the simulation, not defend it. I tried to find anything that looks fake, floats, mis-aligns, or fails to communicate the mechanism.

## Challenge 1 — "Is the motor actually vertical?"

**Test:** orbit the camera and look at the motor body from every side.

**Risk:** A `cylinderGeometry` defaults to its axis along Y, which is vertical in Three.js. If anyone later adds `rotation={[Math.PI/2, 0, 0]}` to "fit it in", the requirement breaks immediately and silently.

**Resolution:** The motor in `DCMotor.tsx` has **no rotation prop**. Its axis is Y by default. The mounting bracket (`-X` post + clamp ring at the same Y) makes it visually obvious the cylinder is vertical, not horizontal-on-its-side.

## Challenge 2 — "Does the shaft really go into the gear hub?"

**Test:** switch to the "Mechanical Close-Up" camera preset, zoom in, and follow the shaft down.

**Risk:** floating shaft. If the shaft's bottom Y doesn't reach the gear's top Y, you get a visible gap, which destroys credibility.

**Resolution:** Numbers are pinned in code:
- Motor body bottom face: `y = 0.95 - 0.45/2 = 0.725`
- Shaft top: `y = 0.725` (matches)
- Shaft bottom: `y = 0.30`
- Gear top face: `y = 0.27 + 0.06/2 = 0.30` (matches)
The bottom shaft coupler also covers the joint visually.

## Challenge 3 — "Does the gear rotation look real?"

**Test:** play the unlock sequence at 0.5× speed and stare at the gear.

**Risk:** A symmetric brass disc with subtle teeth can read as static even when it's rotating, because the eye latches onto the rotational symmetry.

**Resolution:**
- Added an **orange tooth-tip marker** sticking out at one tooth position (in `MainGear.tsx`).
- Added an **orange shaft marker stripe** along the entire shaft length (in `VerticalShaft.tsx`).
- Added a **curved yellow rotation arrow ring** above the gear that itself rotates.
The combination removes any ambiguity.

## Challenge 4 — "Does the gear actually drive the rack?"

**Test:** scrub the unlock sequence and watch the contact point.

**Risk:** Visually disconnected — gear spins, rack drifts independently, no apparent cause-and-effect.

**Resolution:** Both the gear's `rotation.y` and the rack's `position.x` are derived from the **same** `anim.unlockProgress`. They start, accelerate, and stop together. The rack's tooth crest sits at the gear's pitch radius (`z = gz + 0.21`), so the engagement reads correctly even though the actual tooth-pitch correspondence is symbolic. (See note in `RackBolt.tsx` for why we let visual clarity win over kinematic exactness.)

## Challenge 5 — "Is the unlocked state actually distinct?"

**Test:** reset, then play unlock to completion, then reset.

**Risk:** No clear "ah, it's unlocked now" moment.

**Resolution:** Three independent unlocked indicators:
1. The HUD status panel pill flips from red `● LOCKED` to green `● UNLOCKED`.
2. The strike-plate face dot turns from red to green (in scene).
3. The bolt has visibly cleared the strike plate's receiver slot.

## Issues left open (intentionally)

- **No real gear-tooth contact physics.** This is a pedagogical simulation, not a CAD prototype. Adding accurate involute teeth and a real rack-and-pinion ratio would distract from the message and slow the animation.
- **No knock-pattern UI.** The Arduino just blinks; we don't show *which* pattern unlocks. For ENGR 198 the knock pattern is conceptual, not interactive.
- **No door swing.** Unlocking does not animate the door opening. Out of scope and would add a coordinate system for the door that isn't in the reference.

## Verdict

The vertical motor → vertical shaft → main gear → rack → bolt chain is mechanically coherent and visually unambiguous. Approved.

---

## Upgrade pass — adversarial findings (2026-04-25)

### Challenge 6 — "Are the rack teeth obviously rack teeth, or just decorative bumps?"

**Test:** open the Mechanical Close-Up camera and stop the unlock at 50%.

**Risk:** small triangular protrusions could read as decorative ribs rather than functional teeth.

**Resolution:** trapezoidal compound teeth (wider base + narrower tip), 16 of them, with two distinct shades of steel-blue and clearcoat. Combined with the **labels** ("Rack teeth engage gear") and the pulsing **gear/rack contact region** highlight, the engagement is unmistakable.

### Challenge 7 — "Does the contact-region highlight ride along with the rack and break the illusion?"

**Risk:** if it moved with the rack, it would imply the contact point moves — wrong kinematically.

**Resolution:** the contact-region sphere is **outside** the `rackGroup` ref, so it stays fixed at the gear-tangent point in world space while the rack slides through it.

### Challenge 8 — "Will the mic detector misfire on background noise?"

**Test:** play music nearby, type loudly, scroll a wheel mouse.

**Risk:** sustained noise raises baseline gradually; sharp clicks could pass the absolute threshold.

**Resolution:** the rule requires **both** a fixed threshold (sensitivity slider) AND a 4× spike over the rolling baseline. Typing on the same MacBook keyboard usually fails the 4× test because typing keeps the baseline elevated. Heavy-handed key presses can still trigger it — that's by design (the detector is intentionally permissive).

### Challenge 9 — "What happens if the user denies mic permission then clicks unlock?"

**Risk:** code might assume mic is initialized after the button click.

**Resolution:** mic detector cleanup runs in the catch block; status flips to `denied`. Manual buttons read the same `cmdRef.current` and are unaffected. Re-clicking "Enable Mic Knock Detection" will re-prompt the browser.

### Challenge 10 — "What if AudioContext is created but the browser tab is suspended (background)?"

**Risk:** RAF stops in background, baseline could drift.

**Resolution:** `requestAnimationFrame` pausing in background tabs is a feature here, not a bug — RMS calculation pauses, baseline freezes, and resumes when the tab is foregrounded. No false-positive risk.

### Issue still open

- The mic detector triggers on clap, snap, and many other transients. There is no pattern matching — any single transient unlocks. For a real knock-pattern lock you'd want to time multiple knocks, but per the brief the mic path is a *demo trigger*, not the production design. Documented in `obsidian/Microphone Knock Detection.md`.

### Verdict

Upgrade pass approved. Manual controls preserved end-to-end.
