import { useMemo } from "react";
import * as THREE from "three";
import { AnimState } from "./AnimationController";

interface Wire {
  pts: [number, number, number][];
  color: string;
  radius?: number;
}

/**
 * Wire harness connecting all electronics.
 * Endpoints reflect the post-shelf layout:
 *   • Knock sensor: (-1.6, 1.15, 0.05)
 *   • Arduino:      (-0.78, 1.46, 0.16)   — top-left, USB pointing left
 *   • Battery:      ( 0.7,  1.46, 0.18)   — top-right, horizontal cells
 *   • Motor driver: ( 0.05, 1.42, 0.32)   — top-middle, in front
 *   • Motor body:   (-0.05, 0.95, 0.16)   — below the shelf, vertical
 */
export default function Wires({ anim }: { anim: AnimState }) {
  const wires: Wire[] = useMemo(
    () => [
      // Knock sensor → Arduino input pin (blue signal)
      {
        pts: [
          [-1.55, 1.18, 0.07],
          [-1.40, 1.30, 0.18],
          [-1.20, 1.42, 0.20],
          [-1.05, 1.46, 0.18],
        ],
        color: "#3b82f6",
      },
      // Arduino → Motor driver (blue signal — control PWM/direction)
      {
        pts: [
          [-0.45, 1.46, 0.18],
          [-0.20, 1.50, 0.26],
          [0.0, 1.48, 0.32],
        ],
        color: "#3b82f6",
      },
      // Battery + (right end of upper cell) → Motor driver (yellow power)
      {
        pts: [
          [1.02, 1.56, 0.22],
          [1.02, 1.62, 0.30],
          [0.55, 1.62, 0.36],
          [0.20, 1.55, 0.40],
          [0.10, 1.50, 0.40],
        ],
        color: "#f59e0b",
      },
      // Battery − (left end of lower cell) → Arduino GND (black ground)
      {
        pts: [
          [0.34, 1.36, 0.22],
          [0.10, 1.32, 0.20],
          [-0.30, 1.34, 0.18],
          [-0.55, 1.42, 0.18],
        ],
        color: "#1f2937",
        radius: 0.010,
      },
      // Motor driver → Motor + terminal (yellow power)
      // Motor terminals are on the motor's TOP at (cx ± 0.045, cy + motorH/2 + 0.025, cz)
      // i.e. (-0.095 / -0.005, 1.20, 0.16)
      {
        pts: [
          [0.05, 1.36, 0.32],
          [0.0, 1.30, 0.28],
          [-0.05, 1.24, 0.20],
          [-0.005, 1.21, 0.16],
        ],
        color: "#f59e0b",
      },
      // Motor driver → Motor − terminal (yellow power)
      {
        pts: [
          [-0.05, 1.36, 0.32],
          [-0.10, 1.28, 0.26],
          [-0.12, 1.23, 0.18],
          [-0.095, 1.21, 0.16],
        ],
        color: "#f59e0b",
      },
      // Arduino 5V → Knock sensor power (yellow)
      {
        pts: [
          [-1.0, 1.50, 0.18],
          [-1.3, 1.30, 0.16],
          [-1.55, 1.12, 0.07],
        ],
        color: "#f59e0b",
        radius: 0.009,
      },
    ],
    []
  );

  return (
    <group>
      {wires.map((w, i) => (
        <Wire key={i} wire={w} anim={anim} />
      ))}
    </group>
  );
}

function Wire({ wire, anim }: { wire: Wire; anim: AnimState }) {
  const tube = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      wire.pts.map((p) => new THREE.Vector3(...p)),
      false,
      "catmullrom",
      0.4
    );
    return new THREE.TubeGeometry(curve, 48, wire.radius ?? 0.013, 8, false);
  }, [wire]);

  const isPower = wire.color === "#f59e0b";
  const isSignal = wire.color === "#3b82f6";
  const glow = (isPower && anim.powerActive) || (isSignal && anim.signalActive) ? 0.85 : 0.08;

  return (
    <mesh geometry={tube} castShadow>
      <meshStandardMaterial
        color={wire.color}
        emissive={wire.color}
        emissiveIntensity={glow}
        roughness={0.5}
        metalness={0.15}
      />
    </mesh>
  );
}
