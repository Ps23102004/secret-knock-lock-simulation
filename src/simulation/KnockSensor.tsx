import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Label } from "./Labels";
import { AnimState } from "./AnimationController";

/**
 * Knock sensor module mounted to the LEFT of the lock housing,
 * directly on the door surface, matching the reference image's "1. Knock Detected".
 * Includes blue knock-vibration waves that animate when knockActive is true.
 */
export default function KnockSensor({
  anim,
  showLabels,
  showElectrical,
}: {
  anim: AnimState;
  showLabels: boolean;
  showElectrical: boolean;
}) {
  // Three concentric expanding circles for knock waves
  const wave1 = useRef<THREE.Mesh>(null);
  const wave2 = useRef<THREE.Mesh>(null);
  const wave3 = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!anim.knockActive) {
      [wave1, wave2, wave3].forEach((w) => {
        if (w.current) {
          w.current.scale.setScalar(0.001);
          (w.current.material as THREE.MeshBasicMaterial).opacity = 0;
        }
      });
      return;
    }
    const t = anim.pulse;
    const phases = [t, (t + 0.33) % 1, (t + 0.66) % 1];
    [wave1, wave2, wave3].forEach((w, i) => {
      if (!w.current) return;
      const p = phases[i];
      const scale = 0.05 + p * 0.55;
      w.current.scale.set(scale, scale, 1);
      (w.current.material as THREE.MeshBasicMaterial).opacity = (1 - p) * 0.85;
    });
  });

  const ringGeo = useMemo(() => new THREE.RingGeometry(0.95, 1.0, 48), []);

  return (
    <group position={[-1.6, 1.15, 0.05]}>
      {/* Mounting plate */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.34, 0.28, 0.03]} />
        <meshStandardMaterial color="#161a20" roughness={0.7} />
      </mesh>

      {/* Sensor disk (microphone) */}
      <mesh position={[0, 0, 0.022]} castShadow>
        <cylinderGeometry args={[0.085, 0.085, 0.018, 32]} />
        <meshStandardMaterial color="#2a3038" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Mic grille center */}
      <mesh position={[0, 0, 0.033]}>
        <cylinderGeometry args={[0.055, 0.055, 0.005, 32]} />
        <meshStandardMaterial
          color={anim.knockActive ? "#60a5fa" : "#0f1218"}
          emissive={anim.knockActive ? "#60a5fa" : "#000000"}
          emissiveIntensity={anim.knockActive ? 0.6 : 0}
          roughness={0.8}
        />
      </mesh>

      {/* Mounting screws */}
      {[
        [-0.13, 0.1],
        [0.13, 0.1],
        [-0.13, -0.1],
        [0.13, -0.1],
      ].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.018]}>
          <cylinderGeometry args={[0.012, 0.012, 0.012, 12]} />
          <meshStandardMaterial color="#9aa3af" metalness={0.9} roughness={0.3} />
        </mesh>
      ))}

      {/* Knock vibration waves (in front of mic) */}
      {showElectrical && (
        <group position={[0, 0, 0.05]}>
          {[wave1, wave2, wave3].map((ref, i) => (
            <mesh key={i} ref={ref} rotation={[0, 0, 0]}>
              <primitive attach="geometry" object={ringGeo} />
              <meshBasicMaterial
                color="#3b82f6"
                transparent
                opacity={0}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
        </group>
      )}

      <Label position={[0, -0.22, 0.05]} visible={showLabels}>
        Knock Sensor Module
      </Label>
      <Label position={[0, 0.42, 0.1]} visible={showLabels && anim.knockActive} variant="signal">
        1. Knock Detected
      </Label>
    </group>
  );
}
