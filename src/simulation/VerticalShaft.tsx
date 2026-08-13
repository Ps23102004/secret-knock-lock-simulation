import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Label } from "./Labels";
import { AnimState } from "./AnimationController";

/**
 * Silver vertical shaft from underside of DC motor (y ≈ 0.725) down to the
 * top of the gear hub (y ≈ 0.30). Same axis as motor + gear: x = -0.05, z = 0.16.
 *
 * Includes a visible orange MARKER stripe so rotation is unambiguous.
 */
export default function VerticalShaft({
  anim,
  showLabels,
}: {
  anim: AnimState;
  showLabels: boolean;
}) {
  const cx = -0.05;
  const cz = 0.16;
  const yTop = 0.725;
  const yBottom = 0.30;
  const shaftLen = yTop - yBottom;
  const shaftMid = (yTop + yBottom) / 2;

  const grp = useRef<THREE.Group>(null);
  useFrame(() => {
    if (grp.current) grp.current.rotation.y = anim.gearRotation;
  });

  return (
    <group ref={grp} position={[cx, shaftMid, cz]}>
      {/* Main shaft cylinder — polished brushed silver */}
      <mesh castShadow>
        <cylinderGeometry args={[0.024, 0.024, shaftLen, 24]} />
        <meshPhysicalMaterial
          color="#e2e6ec"
          metalness={0.98}
          roughness={0.18}
          clearcoat={0.6}
          clearcoatRoughness={0.25}
        />
      </mesh>

      {/* Orange rotation marker — a thin slab so rotation is visible */}
      <mesh position={[0.027, 0, 0]} castShadow>
        <boxGeometry args={[0.012, shaftLen * 0.95, 0.006]} />
        <meshStandardMaterial
          color="#fb923c"
          emissive="#fb923c"
          emissiveIntensity={0.55}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Coupler at top (motor → shaft) */}
      <mesh position={[0, shaftLen / 2 - 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.042, 0.042, 0.044, 18]} />
        <meshPhysicalMaterial
          color="#7d8492"
          metalness={0.95}
          roughness={0.30}
          clearcoat={0.4}
        />
      </mesh>

      {/* Coupler at bottom (shaft → gear hub) */}
      <mesh position={[0, -shaftLen / 2 + 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.048, 0.048, 0.044, 18]} />
        <meshPhysicalMaterial
          color="#7d8492"
          metalness={0.95}
          roughness={0.30}
          clearcoat={0.4}
        />
      </mesh>

      {/* Label is positioned outside rotating group, but Drei/HTML in the
          rotating group rotates with it — that's fine since it always faces
          camera due to `center` prop. Place it offset to one side. */}
      {showLabels && (
        <Label position={[0.18, 0, 0]} variant="motion">
          Vertical Shaft Drives Gear
        </Label>
      )}
    </group>
  );
}
