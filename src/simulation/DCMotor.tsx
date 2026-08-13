import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Label } from "./Labels";
import { AnimState } from "./AnimationController";

/**
 * DC Motor — VERTICAL MOUNT.
 * The motor body is a cylinder with its axis along Y (vertical).
 * It is supported by a bracket that connects to the housing back panel.
 * The shaft exits the BOTTOM of the motor and goes downward into the gear.
 *
 * Position: x = -0.05 (slightly left of center), y centered around 0.95
 * Motor body height ≈ 0.45, radius ≈ 0.13
 * Bottom face of motor is at y = 0.95 - 0.225 = 0.725
 */
export default function DCMotor({
  anim,
  showLabels,
  showMechArrows,
}: {
  anim: AnimState;
  showLabels: boolean;
  showMechArrows: boolean;
}) {
  const cx = -0.05;
  const cy = 0.95;
  const motorH = 0.45;
  const motorR = 0.13;
  const bottomY = cy - motorH / 2;

  // Curved rotation arrow ring around the motor body (matches reference)
  const arrowRingGeo = useMemo(
    () => new THREE.RingGeometry(motorR + 0.05, motorR + 0.085, 32, 1, 0, Math.PI * 1.4),
    []
  );
  const arrowGrp = useRef<THREE.Group>(null);
  useFrame(() => {
    if (arrowGrp.current) arrowGrp.current.rotation.y = anim.pulse * Math.PI * 2;
  });

  return (
    <group>
      {/* Mounting bracket — dark metallic gray, brushed feel */}
      <group position={[cx, cy, 0]}>
        {/* Back-panel post */}
        <mesh position={[-motorR - 0.05, 0, 0.08]} castShadow>
          <boxGeometry args={[0.04, motorH * 0.85, 0.16]} />
          <meshPhysicalMaterial
            color="#3f4751"
            metalness={0.92}
            roughness={0.38}
            clearcoat={0.3}
          />
        </mesh>
        {/* Clamp ring around motor */}
        <mesh position={[0, 0, 0.16]} castShadow>
          <torusGeometry args={[motorR + 0.015, 0.014, 14, 36]} />
          <meshPhysicalMaterial
            color="#454d57"
            metalness={0.95}
            roughness={0.28}
            clearcoat={0.4}
          />
        </mesh>
        {/* Clamp arm connecting ring to post */}
        <mesh position={[-motorR - 0.025, 0, 0.16]} castShadow>
          <boxGeometry args={[0.05, 0.04, 0.025]} />
          <meshPhysicalMaterial color="#454d57" metalness={0.95} roughness={0.3} />
        </mesh>
        {/* Two bracket fasteners on the post */}
        {[-0.10, 0.10].map((dy, i) => (
          <mesh key={i} position={[-motorR - 0.07, dy, 0.08]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.012, 0.012, 0.025, 12]} />
            <meshStandardMaterial color="#cfd2d8" metalness={0.95} roughness={0.25} />
          </mesh>
        ))}
      </group>

      {/* Motor body — dark gray/black with subtle clearcoat */}
      <mesh position={[cx, cy, 0.16]} castShadow receiveShadow>
        <cylinderGeometry args={[motorR, motorR, motorH, 36]} />
        <meshPhysicalMaterial
          color="#2c333d"
          metalness={0.90}
          roughness={0.30}
          clearcoat={0.45}
          clearcoatRoughness={0.35}
        />
      </mesh>

      {/* Top end-cap — copper/brass commutator */}
      <mesh position={[cx, cy + motorH / 2 - 0.005, 0.16]} castShadow>
        <cylinderGeometry args={[motorR + 0.005, motorR + 0.005, 0.04, 36]} />
        <meshPhysicalMaterial
          color="#b87333"
          metalness={0.95}
          roughness={0.32}
          clearcoat={0.5}
        />
      </mesh>

      {/* Tiny terminal posts on top */}
      {[-0.045, 0.045].map((x, i) => (
        <mesh key={i} position={[cx + x, cy + motorH / 2 + 0.025, 0.16]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.04, 12]} />
          <meshStandardMaterial color="#cfd2d8" metalness={0.95} roughness={0.2} />
        </mesh>
      ))}

      {/* Bottom end-cap (where shaft exits) */}
      <mesh position={[cx, bottomY + 0.005, 0.16]} castShadow>
        <cylinderGeometry args={[motorR + 0.003, motorR + 0.003, 0.02, 32]} />
        <meshStandardMaterial color="#2a2f37" metalness={0.7} roughness={0.5} />
      </mesh>

      {/* Curved rotation arrow ring just above the top end-cap */}
      {showMechArrows && (
        <group
          ref={arrowGrp}
          position={[cx, cy + motorH / 2 + 0.04, 0.16]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <mesh>
            <primitive attach="geometry" object={arrowRingGeo} />
            <meshBasicMaterial
              color="#fbbf24"
              transparent
              opacity={anim.motionActive || anim.powerActive ? 0.75 : 0.18}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh
            position={[
              (motorR + 0.07) * Math.cos(Math.PI * 1.4),
              (motorR + 0.07) * Math.sin(Math.PI * 1.4),
              0,
            ]}
            rotation={[0, 0, Math.PI * 1.4 + Math.PI / 2]}
          >
            <coneGeometry args={[0.04, 0.08, 3]} />
            <meshBasicMaterial
              color="#fbbf24"
              transparent
              opacity={anim.motionActive || anim.powerActive ? 0.9 : 0.25}
            />
          </mesh>
        </group>
      )}

      <Label position={[cx + 0.18, cy + 0.05, 0.3]} visible={showLabels}>
        DC Motor (Vertical Mount)
      </Label>
    </group>
  );
}
