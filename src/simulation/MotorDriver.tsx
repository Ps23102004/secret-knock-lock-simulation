import { Label } from "./Labels";
import { AnimState } from "./AnimationController";

/**
 * Motor driver board (e.g. L298N / TB6612) — small green PCB on the right side
 * between battery and motor, matching reference image position.
 */
export default function MotorDriver({
  anim,
  showLabels,
}: {
  anim: AnimState;
  showLabels: boolean;
}) {
  const lit = anim.powerActive;
  return (
    <group position={[0.05, 1.42, 0.32]}>
      {/* PCB */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.32, 0.04]} />
        <meshStandardMaterial color="#0a6b3a" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* IC chip (driver) */}
      <mesh position={[0, 0.02, 0.024]}>
        <boxGeometry args={[0.18, 0.13, 0.025]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.4} />
      </mesh>

      {/* Heat sink */}
      <mesh position={[0, 0.02, 0.05]}>
        <boxGeometry args={[0.16, 0.08, 0.04]} />
        <meshStandardMaterial color="#9ea7b3" metalness={0.95} roughness={0.3} />
      </mesh>

      {/* Screw terminals (motor + power) */}
      {[-0.15, 0.15].map((x, i) => (
        <mesh key={i} position={[x, -0.12, 0.03]}>
          <boxGeometry args={[0.07, 0.06, 0.025]} />
          <meshStandardMaterial color="#1d4ed8" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}

      {/* Status LED */}
      <mesh position={[0.14, 0.13, 0.025]}>
        <cylinderGeometry args={[0.012, 0.012, 0.008, 10]} />
        <meshStandardMaterial
          color="#ef4444"
          emissive="#ef4444"
          emissiveIntensity={lit ? 1.2 : 0.05}
        />
      </mesh>

      <Label position={[0, 0.24, 0.05]} visible={showLabels}>
        Motor Driver
      </Label>
    </group>
  );
}
