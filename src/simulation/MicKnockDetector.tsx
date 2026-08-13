import { useEffect, useRef, useState } from "react";
import { AnimationCommand } from "./AnimationController";

/**
 * Mic-based knock detection (optional).
 *
 * IMPORTANT: This detects audio TRANSIENTS picked up by the MacBook
 * microphone — it does NOT measure physical vibration directly. A sharp
 * knock, tap, or clap near the laptop produces a short loud spike which
 * we identify by comparing the instantaneous RMS amplitude to a slowly
 * tracked baseline (the running room-noise level).
 *
 * Detection rule (per audio frame):
 *   currentRMS > userThreshold
 *   AND currentRMS > baseline * spikeMultiplier
 *   AND now - lastTrigger > cooldownMs
 *
 * On a positive detection, we fire `play_unlock` on the existing animation
 * controller. The on-screen knock sensor visuals then come along for free
 * because they're driven by the unlock sequence's `knock_detected` phase.
 *
 * Browser notes:
 *   • Microphone permission is required. Browsers only prompt after a user
 *     gesture, which is why "Enable Mic Knock Detection" is a button.
 *   • AudioContext must be created/resumed in response to a user gesture.
 *   • Works on http://localhost (Vite dev server) and any HTTPS origin.
 *     Plain http on a non-localhost host will be denied.
 */

type Status =
  | "off"
  | "requesting"
  | "listening"
  | "knock"
  | "triggered"
  | "denied"
  | "error";

interface Props {
  fireCommand: (cmd: AnimationCommand) => void;
}

const COOLDOWN_MS = 1500;
const BASELINE_TIME_CONSTANT = 0.985; // higher = slower tracking
const DEFAULT_SENSITIVITY = 0.45; // 0..1, mapped to threshold below
const SPIKE_MULTIPLIER = 4.0; // currentRMS must be ≥ baseline * this

export default function MicKnockDetector({ fireCommand }: Props) {
  const [status, setStatus] = useState<Status>("off");
  const [sensitivity, setSensitivity] = useState(DEFAULT_SENSITIVITY);
  const [level, setLevel] = useState(0); // 0..1 for the meter bar
  const [lastTriggerAt, setLastTriggerAt] = useState<number | null>(null);

  // Audio infrastructure refs (kept across renders, not re-created on
  // sensitivity changes etc.)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataRef = useRef<Float32Array<ArrayBuffer> | null>(null);
  const baselineRef = useRef(0.005);
  const lastTriggerRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const sensitivityRef = useRef(sensitivity);
  sensitivityRef.current = sensitivity;

  // Map sensitivity slider [0..1] to threshold:
  //   sensitivity=1.0 → threshold=0.012 (very sensitive)
  //   sensitivity=0.0 → threshold=0.30  (almost no triggers)
  const sensitivityToThreshold = (s: number) => {
    const lo = 0.012;
    const hi = 0.30;
    return lo + (1 - s) * (hi - lo);
  };

  const stop = () => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
    dataRef.current = null;
    baselineRef.current = 0.005;
    setLevel(0);
  };

  const start = async () => {
    if (status === "listening" || status === "requesting") return;
    setStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      streamRef.current = stream;

      const Ctx =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      audioCtxRef.current = ctx;
      // Some browsers create the context in "suspended" state; resume it.
      if (ctx.state === "suspended") await ctx.resume();

      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.4;
      src.connect(analyser);
      analyserRef.current = analyser;

      // Time-domain buffer for RMS calculation. Using an explicit
      // ArrayBuffer (not ArrayBufferLike) keeps strict DOM types happy when
      // we hand the Float32Array to analyser.getFloatTimeDomainData().
      const buf = new ArrayBuffer(analyser.fftSize * Float32Array.BYTES_PER_ELEMENT);
      const data = new Float32Array(buf);
      dataRef.current = data;

      setStatus("listening");
      tick();
    } catch (err) {
      const e = err as DOMException | Error;
      if ("name" in e && (e.name === "NotAllowedError" || e.name === "PermissionDeniedError")) {
        setStatus("denied");
      } else {
        console.error("MicKnockDetector error:", e);
        setStatus("error");
      }
      stop();
    }
  };

  const stopAndReset = () => {
    stop();
    setStatus("off");
  };

  const tick = () => {
    const analyser = analyserRef.current;
    const data = dataRef.current;
    if (!analyser || !data) return;

    analyser.getFloatTimeDomainData(data);

    // Compute RMS over the frame
    let sumSq = 0;
    for (let i = 0; i < data.length; i++) sumSq += data[i] * data[i];
    const rms = Math.sqrt(sumSq / data.length);

    // Update baseline (slow exponential moving average) — only when we're
    // not in a likely-spike condition, so loud knocks don't pollute baseline.
    const threshold = sensitivityToThreshold(sensitivityRef.current);
    const isSpike =
      rms > threshold && rms > baselineRef.current * SPIKE_MULTIPLIER;
    if (!isSpike) {
      baselineRef.current =
        BASELINE_TIME_CONSTANT * baselineRef.current +
        (1 - BASELINE_TIME_CONSTANT) * rms;
      // Floor so quiet rooms don't collapse to 0 and re-amplify everything.
      if (baselineRef.current < 0.003) baselineRef.current = 0.003;
    }

    // Drive the on-screen meter (clamped, gamma-curved for readability)
    const meter = Math.min(1, Math.pow(rms / 0.5, 0.6));
    setLevel(meter);

    // Trigger?
    const now = performance.now();
    if (isSpike && now - lastTriggerRef.current > COOLDOWN_MS) {
      lastTriggerRef.current = now;
      setLastTriggerAt(now);
      setStatus("knock");
      // Tiny delay so the "Knock detected" status is visible before "Triggered"
      window.setTimeout(() => setStatus("triggered"), 220);
      window.setTimeout(() => setStatus("listening"), 1100);
      // Fire the unlock — this drives all on-screen visuals via the
      // existing AnimationController phase machine.
      fireCommand({ type: "play_unlock" });
    }

    rafRef.current = requestAnimationFrame(tick);
  };

  // Cleanup on unmount
  useEffect(
    () => () => {
      stop();
    },
    []
  );

  const statusText: Record<Status, string> = {
    off: "Mic off",
    requesting: "Waiting for permission…",
    listening: "Listening for knock…",
    knock: "Knock detected!",
    triggered: "Sequence triggered",
    denied: "Permission denied",
    error: "Mic error — see console",
  };

  const statusColor: Record<Status, string> = {
    off: "#6f7d92",
    requesting: "#fbbf24",
    listening: "#22c55e",
    knock: "#3b82f6",
    triggered: "#a855f7",
    denied: "#ef4444",
    error: "#ef4444",
  };

  const isActive = status === "listening" || status === "knock" || status === "triggered";
  const cooldownRemaining =
    lastTriggerAt != null
      ? Math.max(0, COOLDOWN_MS - (performance.now() - lastTriggerAt))
      : 0;

  return (
    <div className="mic-panel">
      <h4>Mic Knock Detection</h4>

      <div className="mic-status" style={{ color: statusColor[status] }}>
        ● {statusText[status]}
      </div>

      {/* Live audio level meter */}
      <div className="mic-meter">
        <div
          className="mic-meter-fill"
          style={{
            width: `${(level * 100).toFixed(1)}%`,
            background:
              level > 0.85
                ? "#ef4444"
                : level > 0.5
                ? "#f59e0b"
                : "#22c55e",
          }}
        />
        {/* Threshold marker */}
        <div
          className="mic-meter-threshold"
          style={{
            left: `${Math.min(
              100,
              (sensitivityToThreshold(sensitivity) / 0.5) * 100
            ).toFixed(1)}%`,
          }}
          title="Detection threshold"
        />
      </div>

      <div className="mic-row">
        <span style={{ fontSize: 11, color: "#6f7d92" }}>Sensitivity</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={sensitivity}
          onChange={(e) => setSensitivity(parseFloat(e.target.value))}
        />
        <span style={{ fontSize: 11, width: 32, textAlign: "right" }}>
          {(sensitivity * 100).toFixed(0)}%
        </span>
      </div>

      {!isActive && status !== "requesting" ? (
        <button className="primary" onClick={start}>
          🎙 Enable Mic Knock Detection
        </button>
      ) : (
        <button className="secondary" onClick={stopAndReset}>
          ✕ Disable Mic
        </button>
      )}

      {(status === "denied" || status === "error") && (
        <div className="mic-help">
          Reload the page and allow microphone access. If you blocked the
          prompt, clear the site's mic permission in browser settings.
        </div>
      )}

      {isActive && (
        <div className="mic-help">
          Tap, knock, or clap near your MacBook. Cooldown:{" "}
          {(cooldownRemaining / 1000).toFixed(1)}s.
        </div>
      )}

      <div className="mic-help" style={{ opacity: 0.7 }}>
        Detects audio transients via the Web Audio API — not physical
        vibration. Manual sequence buttons remain available regardless.
      </div>
    </div>
  );
}
