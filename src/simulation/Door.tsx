import { useMemo } from "react";
import * as THREE from "three";

/**
 * Vertical door panel that fills the background of the scene.
 * The lock housing is mounted on its front face at z = 0.
 * Door surface lies on the X-Y plane at z ≈ -0.05.
 */
export default function Door() {
  const planks = useMemo(() => {
    const arr: { x: number; w: number }[] = [];
    let x = -2.6;
    while (x < 2.6) {
      const w = 0.42 + Math.random() * 0.05;
      arr.push({ x: x + w / 2, w: w - 0.012 });
      x += w;
    }
    return arr;
  }, []);

  return (
    <group>
      {/* Door background slab */}
      <mesh position={[0, 0.6, -0.08]} receiveShadow>
        <boxGeometry args={[5.4, 3.6, 0.1]} />
        <meshStandardMaterial color="#3a2a1d" roughness={0.85} metalness={0.1} />
      </mesh>

      {/* Vertical wood planks */}
      {planks.map((p, i) => (
        <mesh key={i} position={[p.x, 0.6, -0.025]} receiveShadow castShadow>
          <boxGeometry args={[p.w, 3.55, 0.04]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#5a3a23" : "#4d3220"}
            roughness={0.9}
            metalness={0.05}
          />
        </mesh>
      ))}

      {/* Door frame strip on right (so we can mount the strike plate) */}
      <mesh position={[2.55, 0.6, -0.04]} receiveShadow>
        <boxGeometry args={[0.18, 3.55, 0.06]} />
        <meshStandardMaterial color="#2b1d12" roughness={0.95} />
      </mesh>

      {/* Visible gap between door and frame so the bolt area reads as a door edge */}
      <mesh position={[2.42, 0.6, -0.045]}>
        <boxGeometry args={[0.04, 3.55, 0.03]} />
        <meshStandardMaterial color="#0a0806" roughness={1} />
      </mesh>
    </group>
  );
}
