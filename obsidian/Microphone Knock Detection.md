# Microphone Knock Detection

Optional input path that lets the simulation be triggered by a real knock, tap, or clap on/near the MacBook.

## How it works

```
MacBook microphone
        ↓ navigator.mediaDevices.getUserMedia({ audio: true })
Web Audio API (AudioContext + MediaStreamSource)
        ↓
AnalyserNode (fftSize 1024)
        ↓ getFloatTimeDomainData → RMS each frame
Mic Knock Detector
        ↓ play_unlock command (when spike detected)
Animation Controller
        ↓
Existing on-screen knock waves, sensor glow, Arduino LED, motor, gear, bolt …
```

The detector **does not** measure physical vibration directly — it watches sound transients picked up by the laptop microphone.

## Detection rule

A knock is registered on a frame when **all three** are true:

1. `currentRMS > userThreshold` (slider-tunable, mapped to 0.012 .. 0.30 RMS)
2. `currentRMS > baseline * spikeMultiplier` (spike multiplier = 4.0)
3. `now - lastTrigger > cooldownMs` (cooldown = 1500 ms)

The `baseline` is a slow exponential moving average (time constant ≈ 0.985) that follows the room's noise floor. It only updates on non-spike frames so a sustained knock can't pollute it.

## Sensitivity slider

| Slider | Threshold | Recommended for                        |
|--------|-----------|----------------------------------------|
| 100 %  | 0.012     | Very quiet rooms, light fingertip taps |
| 70 %   | 0.10      | Default — knocks on wood/desk          |
| 30 %   | 0.21      | Noisy rooms, dampens false triggers    |
| 0 %    | 0.30      | Effectively off (only a slap triggers) |

## UI status messages

- **Mic off** — initial state
- **Waiting for permission…** — browser prompt is open
- **Listening for knock…** — armed
- **Knock detected!** — spike crossed threshold (briefly shown)
- **Sequence triggered** — `play_unlock` was fired
- **Permission denied** — user blocked the prompt
- **Mic error** — getUserMedia or AudioContext threw; check console

## Browser requirements

- HTTPS or `localhost` (Vite dev server qualifies). Plain HTTP on a remote host will be denied.
- AudioContext requires a user gesture — that's why "Enable Mic Knock Detection" is a button, not auto-start on page load.
- macOS asks for system mic permission the first time *any* site uses the mic in that browser. Accept it once.

## Limitations

- A loud clap from across the room will trigger as readily as a finger tap on the laptop. There is no spatial filter.
- If you have noise suppression / echo cancellation enabled in your browser audio constraints, you'll mask quiet knocks. The detector explicitly disables these in `getUserMedia`.
- Sustained loud sounds (music, fan ramp-up) gradually raise the baseline so subsequent transients become harder to detect. This is intentional — it avoids false-positive spam in noisy rooms.

## Why this is a simulation input, not embedded sensor hardware

A production secret-knock lock would use a piezoelectric or accelerometer sensor mounted to the door, fed into an Arduino interrupt pin. That sensor measures door vibration and is immune to airborne noise from other rooms. The Web Audio mic path here is a *simulation convenience* — it lets you demo the unlock with a real physical knock at your laptop, but is not how the deployed product would work.

## Cross-references

- [[System Architecture]] — full input path including the optional mic branch
- [[Animation Sequence]] — what visually happens once the unlock sequence fires
- [[Electrical Flow]] — how the on-screen knock-sensor module is wired (the model the mic stands in for)
- [[Secret Knock Lock Simulation]] — main vault index

## Related Notes

- [[Secret Knock Door Lock]] — physical Arduino prototype
- [[ENGR 198]] · [[Engineering Projects]] · [[University Dashboard]]
- [[Mechanical Mechanism]] · [[Graphify Nexus Notes]] · [[Presentation Notes]]
- [[AI Brain Dashboard]] — Web Audio integration was built with this workflow
- [[Obsidian Knowledge Graph]]
