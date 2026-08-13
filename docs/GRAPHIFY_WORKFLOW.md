# Graphify / Nexus Workflow

## Files

- `src/data/graphify-nodes.json` — 30 nodes + 35 edges spanning physical hardware, signal/power/motion flows, software (animation, camera, UI, mic detector), optional microphone input, rack-teeth detail, and documentation artifacts.
- `src/data/system-flow.json` — 14 ordered sequence states, each with `active_components`, `visual_highlights`, `mechanical_motion`, and `electrical_flow`.
- `src/data/components.json` — per-component geometry, position, and role.
- `src/data/visual-reference-analysis.json` — extracted from the Desktop reference image; the source of truth for visual design.

## Node taxonomy

- `design_input` — the original Desktop image.
- `design_artifact` — extracted analysis of that image.
- `structural` — door, strike plate.
- `enclosure` / `enclosure_face` — housing, transparent cover.
- `input_sensor` — knock sensor.
- `controller` — Arduino UNO.
- `power_source` — battery pack.
- `h_bridge` — motor driver.
- `actuator` — DC motor.
- `transmission` — vertical shaft, main gear, rack gear.
- `lock_actuator` — sliding bolt.
- `flow` — signal / power / motion overlays.
- `software` — animation controller, camera controller, UI controls, status panel.
- `artifact` — documentation pack and Obsidian notes.

## Edge types

- `derives` — design pipeline.
- `signal_flow_blue` — blue arrow paths.
- `power_flow_yellow` — yellow arrow paths.
- `mechanical_motion_green` — green motion paths.
- `drives` — software → hardware visual driver.
- `commands` — UI → software commands.
- `exports_to` — docs → Obsidian.

## How this supports the AI workflow

The graph is a **single source of truth** about *what depends on what* in this project. It can be loaded into any graph visualizer (Obsidian Graph view, D3, react-force-graph, the Nexus tool from `/graphify`) to show, for example:

- "What breaks if I remove the motor driver?" → trace incoming `power_flow_yellow` edges.
- "What does step 5 of the unlock sequence touch?" → query `system-flow.json` state `gear_rotates` → look up its `active_components` → highlight those nodes.
- "Where did this design decision come from?" → all roads lead back to `desktop_reference_image` via `visual_reference_analysis`.

## Round-tripping with the simulation

Each node `id` matches the React component name (lowercased / snake-cased), so a future enhancement could read `graphify-nodes.json` at runtime and dim/highlight components based on graph queries. The component IDs you'll find in the code:

| Graph node id                                       | React component                       |
|-----------------------------------------------------|---------------------------------------|
| `door_panel`                                        | `Door.tsx`                            |
| `lock_housing`                                      | `LockHousing.tsx`                     |
| `arduino_uno`                                       | `ArduinoUno.tsx`                      |
| `knock_sensor_module`                               | `KnockSensor.tsx`                     |
| `battery_pack`                                      | `BatteryPack.tsx`                     |
| `motor_driver`                                      | `MotorDriver.tsx`                     |
| `dc_motor_vertical_mount`                           | `DCMotor.tsx`                         |
| `vertical_motor_shaft`                              | `VerticalShaft.tsx`                   |
| `main_drive_gear`                                   | `MainGear.tsx`                        |
| `rack_gear` / `rack_teeth_detail` / `sliding_bolt` / `gear_rack_contact_region` | `RackBolt.tsx` |
| `strike_plate`                                      | `Scene.tsx::StrikePlate`              |
| `signal_flow_blue` etc.                             | `Wires.tsx` + `FlowArrows.tsx`        |
| `animation_controller`                              | `AnimationController.tsx`             |
| `camera_controller`                                 | `CameraPresets.tsx`                   |
| `ui_controls`                                       | `App.tsx` (HUD)                       |
| `status_panel`                                      | `StatusPanel.tsx`                     |
| `macbook_microphone` / `web_audio_api` / `analyser_node` / `mic_knock_detector` / `sensitivity_threshold` | `MicKnockDetector.tsx` |
