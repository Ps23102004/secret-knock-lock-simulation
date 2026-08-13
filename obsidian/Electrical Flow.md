# Electrical Flow

## Players

- **Knock Sensor Module** — vibration / piezo microphone, mounted on the door surface to the left of the housing. Outputs a logic-level pulse when the door vibrates.
- **Arduino UNO** — runs the knock-detection sketch.
- **Battery Pack** — supplies battery voltage (≈ 6V from 4× AA in series; pedagogical 2-cell render).
- **Motor Driver** — H-bridge that gates and reverses motor current under Arduino control.
- **DC Motor** — actuator that rotates when current flows.

## Wires (color matches the in-app legend)

| Wire | Color | From → To |
|------|-------|-----------|
| Sensor signal      | Blue   | Knock Sensor → Arduino |
| Driver control     | Blue   | Arduino → Motor Driver (PWM / direction pins) |
| Battery +          | Yellow | Battery → Motor Driver VIN |
| Driver out 1       | Yellow | Motor Driver OUT1 → Motor + |
| Driver out 2       | Yellow | Motor Driver OUT2 → Motor − |
| Battery −          | Black  | Battery − → Arduino GND (and driver GND) |
| Sensor power       | Yellow | Arduino 5V → Sensor VCC |

## Flow during unlock

1. Door is knocked → sensor emits short blue pulse → Arduino interrupt fires.
2. Arduino measures inter-knock timings → compares to stored secret pattern → if match, asserts an enable line into the driver (blue).
3. Driver gates battery current (yellow) onto the motor terminals.
4. Motor turns. The mechanical chain (see [[Mechanical Mechanism]]) takes over.
5. After ~500 ms the Arduino releases the enable. The motor coasts to a stop with the bolt retracted.

## Flow during relock

The Arduino re-asserts the enable but with the H-bridge in **reversed polarity**. Battery current flows the other way through the motor → motor turns in the opposite direction → rack and bolt return to the extended position.

## Visualization in the simulation

- The wires themselves are 3D `TubeGeometry` segments (`Wires.tsx`). Power and signal wires **emit light** (raised emissive intensity) when their flow is active.
- A separate overlay (`FlowArrows.tsx`) draws **animated travelling dots** along each flow path, using the same color code, so the direction of flow is unmistakable even on a still frame.

## Cross-references

- [[Mechanical Mechanism]] for what happens after the motor turns.
- [[Animation Sequence]] for the exact step at which each wire lights up.

## Related Notes

- [[Secret Knock Lock Simulation]] — project hub
- [[Secret Knock Door Lock]] — physical Arduino prototype
- [[ENGR 198]] · [[Engineering Projects]] · [[University Dashboard]]
- [[Microphone Knock Detection]] · [[System Architecture]] · [[Graphify Nexus Notes]] · [[Presentation Notes]]
- [[Obsidian Knowledge Graph]]
