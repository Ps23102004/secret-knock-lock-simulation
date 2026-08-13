import { Label } from "./Labels";

/**
 * Housing dimensions:
 *   width  X = 2.4
 *   height Y = 1.8
 *   depth  Z = 0.55  (mounted on door at z = 0)
 *
 * Internal cavity Z range: [0.05 .. 0.45]
 * Internal X range: [-1.15 .. 1.15]
 * Internal Y range: [0.05 .. 1.55]
 */
export default function LockHousing({
  showCutaway,
  showLabels,
}: {
  showCutaway: boolean;
  showLabels: boolean;
}) {
  const W = 2.4;
  const H = 1.8;
  const D = 0.55;
  const wall = 0.05;
  const cy = 0.85; // housing centered vertically at y=0.85

  return (
    <group>
      {/* Back panel (mounted to door) */}
      <mesh position={[0, cy, wall / 2]} castShadow receiveShadow>
        <boxGeometry args={[W, H, wall]} />
        <meshPhysicalMaterial
          color="#161a21"
          roughness={0.62}
          metalness={0.25}
          clearcoat={0.3}
          clearcoatRoughness={0.5}
        />
      </mesh>

      {/* Top wall */}
      <mesh position={[0, cy + H / 2 - wall / 2, D / 2]} castShadow>
        <boxGeometry args={[W, wall, D]} />
        <meshPhysicalMaterial
          color="#161a21"
          roughness={0.62}
          metalness={0.25}
          clearcoat={0.3}
          clearcoatRoughness={0.5}
        />
      </mesh>
      {/* Bottom wall */}
      <mesh position={[0, cy - H / 2 + wall / 2, D / 2]} castShadow>
        <boxGeometry args={[W, wall, D]} />
        <meshPhysicalMaterial
          color="#161a21"
          roughness={0.62}
          metalness={0.25}
          clearcoat={0.3}
          clearcoatRoughness={0.5}
        />
      </mesh>
      {/* Left wall */}
      <mesh position={[-W / 2 + wall / 2, cy, D / 2]} castShadow>
        <boxGeometry args={[wall, H, D]} />
        <meshPhysicalMaterial
          color="#161a21"
          roughness={0.62}
          metalness={0.25}
          clearcoat={0.3}
          clearcoatRoughness={0.5}
        />
      </mesh>
      {/*
        Right wall is split to leave a bolt slot centered at
        y = 0.27 (rack/bolt y-axis), z range 0.38–0.48 (slot z-width 0.10 for
        the 0.10-deep bolt body). Behind the slot (z < 0.38) is solid wall.
      */}
      {/* Right wall, ABOVE the bolt slot */}
      <mesh position={[W / 2 - wall / 2, cy + 0.42, D / 2]} castShadow>
        <boxGeometry args={[wall, H - 0.95, D]} />
        <meshPhysicalMaterial
          color="#161a21"
          roughness={0.62}
          metalness={0.25}
          clearcoat={0.3}
          clearcoatRoughness={0.5}
        />
      </mesh>
      {/* Right wall, BELOW the bolt slot */}
      <mesh position={[W / 2 - wall / 2, cy - 0.78, D / 2]} castShadow>
        <boxGeometry args={[wall, H - 1.55, D]} />
        <meshPhysicalMaterial
          color="#161a21"
          roughness={0.62}
          metalness={0.25}
          clearcoat={0.3}
          clearcoatRoughness={0.5}
        />
      </mesh>
      {/* Right wall, BEHIND the bolt slot (z < 0.38) — solid */}
      <mesh position={[W / 2 - wall / 2, 0.27, 0.19]} castShadow>
        <boxGeometry args={[wall, 0.22, 0.36]} />
        <meshPhysicalMaterial
          color="#161a21"
          roughness={0.62}
          metalness={0.25}
          clearcoat={0.3}
          clearcoatRoughness={0.5}
        />
      </mesh>

      {/* Transparent / cutaway front cover — smoky gray glass-plastic */}
      <mesh position={[0, cy, D - wall / 2]} castShadow>
        <boxGeometry args={[W, H, wall]} />
        <meshPhysicalMaterial
          color="#5a6470"
          transparent
          opacity={showCutaway ? 0.22 : 0.88}
          roughness={0.08}
          metalness={0.05}
          transmission={showCutaway ? 0.88 : 0.25}
          thickness={0.05}
          ior={1.45}
          clearcoat={1}
          clearcoatRoughness={0.15}
          attenuationColor="#3a414b"
          attenuationDistance={2.0}
        />
      </mesh>

      {/* Corner screws */}
      {[
        [-W / 2 + 0.08, cy + H / 2 - 0.08],
        [W / 2 - 0.08, cy + H / 2 - 0.08],
        [-W / 2 + 0.08, cy - H / 2 + 0.08],
        [W / 2 - 0.08, cy - H / 2 + 0.08],
      ].map(([x, y], i) => (
        <group key={i} position={[x, y, D]}>
          <mesh>
            <cylinderGeometry args={[0.035, 0.035, 0.03, 16]} />
            <meshStandardMaterial color="#7d8896" metalness={0.9} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.016, 0]}>
            <boxGeometry args={[0.05, 0.005, 0.012]} />
            <meshStandardMaterial color="#3b3f47" metalness={0.7} roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Standoffs/pillars at corners (visible through cutaway) */}
      {[
        [-W / 2 + 0.13, cy - H / 2 + 0.13],
        [W / 2 - 0.13, cy - H / 2 + 0.13],
        [-W / 2 + 0.13, cy + H / 2 - 0.13],
        [W / 2 - 0.13, cy + H / 2 - 0.13],
      ].map(([x, y], i) => (
        <mesh key={`p${i}`} position={[x, y, D / 2]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, D - 0.05, 16]} />
          <meshStandardMaterial color="#444b56" metalness={0.7} roughness={0.4} />
        </mesh>
      ))}

      {/* Internal horizontal shelf separating electrical (top) and
          mechanical (bottom) compartments. The motor's top is at y=1.18; the
          shelf sits at y=1.22, just above the motor — matches the reference
          image's clear horizontal divider. */}
      <mesh position={[0, 1.22, D / 2 + 0.02]} castShadow receiveShadow>
        <boxGeometry args={[W - 0.12, 0.022, D - 0.10]} />
        <meshStandardMaterial color="#272d36" roughness={0.65} metalness={0.35} />
      </mesh>
      {/* Thin lip on the shelf's front edge */}
      <mesh position={[0, 1.215, D - 0.06]} castShadow>
        <boxGeometry args={[W - 0.12, 0.04, 0.012]} />
        <meshStandardMaterial color="#1d222a" roughness={0.7} metalness={0.4} />
      </mesh>

      <Label
        position={[-W / 2 + 0.4, cy + H / 2 + 0.13, D]}
        visible={showLabels}
      >
        Lock Housing (Cutaway)
      </Label>
    </group>
  );
}
