# Graphify Nexus Notes

The project ships with a knowledge graph in JSON form so it can be visualized, queried, or wired into the `/graphify` skill.

## Files

- `src/data/graphify-nodes.json` — 30 nodes + 35 edges across hardware, flows, software, optional mic input, rack-teeth detail, and documentation.
- `src/data/system-flow.json` — 14 sequence states with their active components.
- `src/data/components.json` — physical components with positions and roles.
- `src/data/visual-reference-analysis.json` — extracted from the [[Secret Knock Lock Simulation]] reference image.

## Node taxonomy

`design_input → design_artifact → structural / enclosure / sensors / controllers / power / actuators / transmissions / flows → software → artifacts`

This means: the graph **starts** at the Desktop reference image and ends at the Obsidian notes you're reading. Every other node sits on a path between the two.

## Edge taxonomy

- `derives` — design pipeline
- `signal_flow_blue`
- `power_flow_yellow`
- `mechanical_motion_green`
- `drives` — software → hardware visual driver
- `commands` — UI → software
- `commands_optional` — mic detector → animation controller (only when enabled)
- `audio_stream` — microphone → Web Audio API
- `audio_node_chain` — Web Audio nodes connected via `connect()`
- `samples` — analyser → consumer
- `configures` — tunable → software
- `annotates` — visual indicator → component it highlights
- `exports_to` — docs → Obsidian

## How this supports the AI workflow

You can drop `graphify-nodes.json` into Obsidian's Graph view (with a small adapter), into D3 / `react-force-graph`, or into the `/graphify` skill to:

- See blast radius of any change ("if I remove the motor driver, what stops working?").
- Generate a visual story of any sequence state ("what's active in `gear_rotates`?").
- Trace any visible component back to its source in the reference image.

## Cross-references

- [[System Architecture]] — high-level human-readable version of the same graph.
- [[Mechanical Mechanism]], [[Electrical Flow]], [[Animation Sequence]] — content the graph indexes.

## Related Notes

- [[Secret Knock Lock Simulation]] — project hub
- [[Secret Knock Door Lock]] — physical Arduino prototype
- [[ENGR 198]] · [[Engineering Projects]] · [[University Dashboard]]
- [[Microphone Knock Detection]] · [[Presentation Notes]]
- [[Graphify]] — the `/graphify` skill that produced the data files
- [[GitNexus]] — the repo brain layer that pairs with Graphify
- [[Obsidian Knowledge Graph]] — vault-wide graph strategy
