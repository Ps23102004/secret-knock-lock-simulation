---
type: project
area: ENGR 198
status: active
tags: [engr198, simulation, hardware, university]
aliases: [Secret Knock Lock Sim, Lock Simulation]
---

# Secret Knock Lock Simulation

> ENGR 198 project — interactive 3D simulation of a secret-knock door lock.
> Built from the Desktop reference image at
> `/Users/parthsingh/Desktop/265D9CFE-D9A7-4FD2-8789-AB9D265D10BB.png`.

## Course / project parents

- [[ENGR 198]] — course this belongs to
- [[Secret Knock Door Lock]] — the physical Arduino build this simulates
- [[Engineering Projects]] — engineering hub
- [[University Dashboard]] — academic root

## Problem summary

Design a door lock that a user can open by knocking a secret pattern. The Arduino listens with a knock sensor, validates the pattern, and drives a motor that retracts a bolt via a vertical-shaft → main-gear → rack mechanism.

## How to read this vault

- [[System Architecture]] — high-level subsystem map
- [[Mechanical Mechanism]] — motor → shaft → gear → rack → bolt
- [[Electrical Flow]] — sensor → Arduino → driver → motor
- [[Animation Sequence]] — 14-state unlock and relock timeline
- [[Microphone Knock Detection]] — optional Web Audio mic-based trigger
- [[Graphify Nexus Notes]] — knowledge graph of the whole project
- [[Presentation Notes]] — class demo script

## Quick links to the running project

- Source root: `secret-knock-lock-simulation/`
- Reference image (in app): `secret-knock-lock-simulation/public/reference/secret-knock-lock-reference.png`
- Run with:
  ```bash
  cd secret-knock-lock-simulation
  npm install
  npm run dev
  ```

## Key invariant

> The **DC motor is mounted vertically**. The motor shaft, the shaft itself, and the **main gear** all share the **same vertical axis**. The gear meshes with a **horizontal rack** rigidly attached to the **sliding bolt**, which seats into the **strike plate** on the door frame.

If anything in the simulation breaks this invariant, fix it before anything else.

## Related Notes

- [[Secret Knock Door Lock]] — the physical Arduino prototype this simulates
- [[Air Quality Monitor]] — sister ENGR 198 project (Project 1)
- [[ENGR 198]] · [[University Dashboard]] · [[Engineering Projects]] · [[Projects Dashboard]]
- [[Mechanical Mechanism]] · [[Electrical Flow]] · [[Animation Sequence]] · [[Microphone Knock Detection]] · [[System Architecture]] · [[Graphify Nexus Notes]] · [[Presentation Notes]]
- [[AI Brain Dashboard]] — workflow used to build this sim
- [[Obsidian Knowledge Graph]] — how this vault connects
