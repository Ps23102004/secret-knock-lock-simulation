import { ReactNode, useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

export type SequenceState =
  | "locked_idle"
  | "knock_detected"
  | "pattern_validated"
  | "power_activated"
  | "motor_rotates"
  | "shaft_drives_gear"
  | "gear_rotates"
  | "rack_moves"
  | "bolt_retracts"
  | "unlocked"
  | "relock_requested"
  | "motor_reverses"
  | "bolt_extends"
  | "locked_again";

export type AnimationCommand =
  | { type: "play_unlock" }
  | { type: "play_relock" }
  | { type: "reset" }
  | { type: "step" };

export interface AnimState {
  /** 0 = fully locked, 1 = fully unlocked */
  unlockProgress: number;
  /** rotation of motor shaft / gear in radians */
  gearRotation: number;
  /** current sequence state */
  state: SequenceState;
  /** index of current step in the public 7-step flow (1-based, 0 = idle) */
  stepIndex: number;
  /** 0..1 pulse used by knock-wave / led / arrow shaders */
  pulse: number;
  /** is electrical/power glowing */
  powerActive: boolean;
  /** is signal active (blue arrows from sensor → arduino → driver) */
  signalActive: boolean;
  /** is motion active (green arrows along bolt) */
  motionActive: boolean;
  /** are knock waves visible */
  knockActive: boolean;
}

interface Props {
  speed: number;
  onState: (s: SequenceState) => void;
  onStep: (idx: number) => void;
  registerCommand: (fn: (c: AnimationCommand) => void) => void;
  children: (anim: AnimState) => ReactNode;
}

// Each phase's target progress and what is "active"
interface Phase {
  state: SequenceState;
  duration: number; // seconds at speed=1
  // unlock progress at end of phase (0..1)
  endProgress: number;
  stepIndex: number;
  signal?: boolean;
  power?: boolean;
  motion?: boolean;
  knock?: boolean;
}

const UNLOCK_PHASES: Phase[] = [
  { state: "locked_idle",       duration: 0.3, endProgress: 0,    stepIndex: 0 },
  { state: "knock_detected",    duration: 1.4, endProgress: 0,    stepIndex: 1, knock: true, signal: true },
  { state: "pattern_validated", duration: 1.0, endProgress: 0,    stepIndex: 2, signal: true },
  { state: "power_activated",   duration: 0.9, endProgress: 0,    stepIndex: 3, power: true, signal: true },
  { state: "motor_rotates",     duration: 0.7, endProgress: 0.05, stepIndex: 4, power: true },
  { state: "shaft_drives_gear", duration: 0.5, endProgress: 0.15, stepIndex: 4, power: true, motion: true },
  { state: "gear_rotates",      duration: 0.6, endProgress: 0.30, stepIndex: 5, power: true, motion: true },
  { state: "rack_moves",        duration: 1.4, endProgress: 0.85, stepIndex: 6, power: true, motion: true },
  { state: "bolt_retracts",     duration: 0.7, endProgress: 1.0,  stepIndex: 6, power: true, motion: true },
  { state: "unlocked",          duration: 1.2, endProgress: 1.0,  stepIndex: 7 },
];

const RELOCK_PHASES: Phase[] = [
  { state: "relock_requested", duration: 0.4, endProgress: 1.0,  stepIndex: 7, signal: true },
  { state: "motor_reverses",   duration: 0.7, endProgress: 0.85, stepIndex: 4, power: true, motion: true },
  { state: "bolt_extends",     duration: 1.6, endProgress: 0.05, stepIndex: 6, power: true, motion: true },
  { state: "locked_again",     duration: 0.6, endProgress: 0,    stepIndex: 0 },
];

export function AnimationController({
  speed,
  onState,
  onStep,
  registerCommand,
  children,
}: Props) {
  const [anim, setAnim] = useState<AnimState>({
    unlockProgress: 0,
    gearRotation: 0,
    state: "locked_idle",
    stepIndex: 0,
    pulse: 0,
    powerActive: false,
    signalActive: false,
    motionActive: false,
    knockActive: false,
  });

  const animRef = useRef(anim);
  animRef.current = anim;

  // Active sequence: { phases, index, t, startProgress }
  const seq = useRef<{
    phases: Phase[];
    idx: number;
    t: number;
    startProgress: number;
  } | null>(null);

  // Pending one-shot "advance to next phase" request from Step button
  const stepReq = useRef(false);

  useEffect(() => {
    registerCommand((cmd) => {
      if (cmd.type === "play_unlock") {
        seq.current = {
          phases: UNLOCK_PHASES,
          idx: 0,
          t: 0,
          startProgress: animRef.current.unlockProgress,
        };
      } else if (cmd.type === "play_relock") {
        seq.current = {
          phases: RELOCK_PHASES,
          idx: 0,
          t: 0,
          startProgress: animRef.current.unlockProgress,
        };
      } else if (cmd.type === "reset") {
        seq.current = null;
        setAnim({
          unlockProgress: 0,
          gearRotation: 0,
          state: "locked_idle",
          stepIndex: 0,
          pulse: 0,
          powerActive: false,
          signalActive: false,
          motionActive: false,
          knockActive: false,
        });
      } else if (cmd.type === "step") {
        // If no sequence running, start unlock from current point
        if (!seq.current) {
          seq.current = {
            phases: UNLOCK_PHASES,
            idx: 0,
            t: 0,
            startProgress: animRef.current.unlockProgress,
          };
        }
        stepReq.current = true;
      }
    });
  }, [registerCommand]);

  // Notify parent of state / step changes (debounced via change tracking)
  const lastNotifyState = useRef<SequenceState>("locked_idle");
  const lastNotifyStep = useRef<number>(0);

  useFrame((_, dtRaw) => {
    const dt = dtRaw * speed;

    if (!seq.current) {
      // Idle: keep gear gently rotating only when unlocked? No — keep static.
      const next = {
        ...animRef.current,
        pulse: (animRef.current.pulse + dt * 1.2) % 1,
      };
      setAnim(next);
      return;
    }

    const s = seq.current;
    const phase = s.phases[s.idx];

    s.t += dt;
    const phaseDur = Math.max(phase.duration, 0.0001);
    let local = Math.min(s.t / phaseDur, 1);

    if (stepReq.current) {
      // jump to end of current phase
      local = 1;
      s.t = phaseDur;
      stepReq.current = false;
    }

    // Smooth easing
    const eased = local < 0.5 ? 2 * local * local : 1 - Math.pow(-2 * local + 2, 2) / 2;

    // unlockProgress interpolates from startProgress → phase.endProgress
    const unlockProgress = s.startProgress + (phase.endProgress - s.startProgress) * eased;

    // Gear rotation derives directly from unlock progress (rack travels with it)
    // Full unlock = ~3 turns of the gear (looks dramatic but believable)
    const gearRotation = -unlockProgress * Math.PI * 6;

    const next: AnimState = {
      ...animRef.current,
      unlockProgress,
      gearRotation,
      state: phase.state,
      stepIndex: phase.stepIndex,
      pulse: (animRef.current.pulse + dt * 1.6) % 1,
      powerActive: !!phase.power,
      signalActive: !!phase.signal,
      motionActive: !!phase.motion,
      knockActive: !!phase.knock,
    };
    setAnim(next);

    if (local >= 1) {
      // advance phase
      s.idx += 1;
      s.t = 0;
      s.startProgress = phase.endProgress;
      if (s.idx >= s.phases.length) {
        seq.current = null;
      }
    }

    if (next.state !== lastNotifyState.current) {
      lastNotifyState.current = next.state;
      onState(next.state);
    }
    if (next.stepIndex !== lastNotifyStep.current) {
      lastNotifyStep.current = next.stepIndex;
      onStep(next.stepIndex);
    }
  });

  return <>{children(anim)}</>;
}
