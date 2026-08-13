import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Label } from "./Labels";
import { AnimState } from "./AnimationController";

/**
 * Rack gear + sliding bolt.
 *
 * Geometry — synchronized with MainGear at (gx=-0.05, gy=0.27, gz=0.16):
 *   • Gear pitch radius = 0.21, tooth-tip radius = 0.225 (in XZ plane)
 *   • Rack runs along X. Body sits at z = 0.43 so its -Z face (z = 0.39)
 *     is just outside the gear's tooth-tip circle (z = 0.385). The rack
 *     teeth project from the body in -Z toward the gear, tipping at
 *     z ≈ 0.345, interlacing with gear teeth at the +Z extreme.
 *   • Rack LEFT END is at x = gx (= -0.05) — the gear tangent point. No gap.
 *   • Bolt extends rightward, exits the housing right wall slot at z ≈ 0.43,
 *     and seats into a forward-projecting U-bracket strike plate at z = 0.43.
 *
 * Visual travel = 0.55 m, paired with ~3 turns of the gear in the same time
 * window (intentional pedagogical exaggeration; see SIMULATION_NOTES.md).
 */
export default function RackBolt({
  anim,
  showLabels,
  showMechArrows,
}: {
  anim: AnimState;
  showLabels: boolean;
  showMechArrows: boolean;
}) {
  const gx = -0.05;
  const gy = 0.27;
  const rackZ = 0.43;
  const rackBodyDepth = 0.09;
  const rackThick = 0.10;

  const rackLen = 1.30;
  const anchorX = gx + rackLen / 2;

  const travel = 0.55;

  const rackGroup = useRef<THREE.Group>(null);
  const arrowMat = useRef<THREE.MeshBasicMaterial>(null);
  const arrowBarMat = useRef<THREE.MeshBasicMaterial>(null);
  // Contact-region highlight at the gear/rack engagement point
  const contactMat = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    if (rackGroup.current) {
      rackGroup.current.position.x = -anim.unlockProgress * travel;
    }
    const op = anim.motionActive ? 0.9 : 0.0;
    if (arrowMat.current) arrowMat.current.opacity = op;
    if (arrowBarMat.current) arrowBarMat.current.opacity = op;
    // Contact highlight pulses when motion is active
    if (contactMat.current) {
      const pulse = anim.motionActive
        ? 0.6 + 0.35 * Math.sin(clock.elapsedTime * 6)
        : 0.25;
      contactMat.current.opacity = pulse;
    }
  });

  // Trapezoidal rack teeth — clearly defined, project in -Z toward the gear.
  // Each tooth is a 2-piece compound for visible bevel: a base block sitting
  // on the rack body, plus a slightly narrower tip block giving it a
  // trapezoidal silhouette readable from a distance.
  const teeth = useMemo(() => {
    const arr: { x: number }[] = [];
    const nTeeth = 16;
    const toothW = 0.072;
    const startX = -rackLen / 2 + 0.06;
    for (let i = 0; i < nTeeth; i++) {
      arr.push({ x: startX + (i + 0.5) * toothW });
    }
    return arr;
  }, []);

  return (
    <group position={[anchorX, gy, rackZ]}>
      <group ref={rackGroup}>
        {/* Rack body — darker steel-blue base bar */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[rackLen, rackThick, rackBodyDepth]} />
          <meshPhysicalMaterial
            color="#1e40af"
            metalness={0.85}
            roughness={0.32}
            clearcoat={0.4}
            clearcoatRoughness={0.4}
          />
        </mesh>

        {/* Backing strip on top of rack body for slight bevel highlight */}
        <mesh position={[0, rackThick / 2 - 0.005, 0]} castShadow>
          <boxGeometry args={[rackLen - 0.02, 0.012, rackBodyDepth - 0.005]} />
          <meshStandardMaterial color="#3b82f6" metalness={0.75} roughness={0.35} />
        </mesh>

        {/* Rack TEETH — bright steel-blue, trapezoidal, project in -Z */}
        {teeth.map((t, i) => {
          const baseW = 0.052;
          const tipW = 0.030;
          const baseH = 0.022;
          const tipH = 0.024;
          const teethY = rackThick * 0.85;
          const baseZ = -rackBodyDepth / 2 - baseH / 2 + 0.002;
          const tipZ = -rackBodyDepth / 2 - baseH - tipH / 2 + 0.003;
          return (
            <group key={i}>
              {/* Tooth base (wider, sits on rack body) */}
              <mesh position={[t.x, 0, baseZ]} castShadow>
                <boxGeometry args={[baseW, teethY, baseH]} />
                <meshPhysicalMaterial
                  color="#60a5fa"
                  metalness={0.92}
                  roughness={0.22}
                  clearcoat={0.6}
                  clearcoatRoughness={0.3}
                />
              </mesh>
              {/* Tooth tip (narrower, gives a trapezoidal silhouette) */}
              <mesh position={[t.x, 0, tipZ]} castShadow>
                <boxGeometry args={[tipW, teethY * 0.92, tipH]} />
                <meshPhysicalMaterial
                  color="#93c5fd"
                  metalness={0.95}
                  roughness={0.18}
                  clearcoat={0.7}
                  clearcoatRoughness={0.25}
                />
              </mesh>
            </group>
          );
        })}

        {/* Sliding bolt — darker metallic blue, with a subtle cap groove */}
        <mesh position={[rackLen / 2 + 0.32, 0, 0]} castShadow>
          <boxGeometry args={[0.65, 0.14, 0.11]} />
          <meshPhysicalMaterial
            color="#1d4ed8"
            metalness={0.85}
            roughness={0.30}
            clearcoat={0.5}
            clearcoatRoughness={0.35}
          />
        </mesh>

        {/* Bolt highlight strip (thin top accent) */}
        <mesh position={[rackLen / 2 + 0.32, 0.057, 0]}>
          <boxGeometry args={[0.62, 0.008, 0.10]} />
          <meshStandardMaterial color="#3b82f6" metalness={0.7} roughness={0.4} />
        </mesh>

        {/* Bolt nose — rounded brushed-blue cylinder */}
        <mesh
          position={[rackLen / 2 + 0.66, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.07, 0.07, 0.05, 24]} />
          <meshPhysicalMaterial
            color="#3b82f6"
            metalness={0.85}
            roughness={0.28}
            clearcoat={0.55}
            clearcoatRoughness={0.3}
          />
        </mesh>

        {/* Bolt nose end-cap (hemisphere, brighter) */}
        <mesh
          position={[rackLen / 2 + 0.69, 0, 0]}
          rotation={[0, 0, -Math.PI / 2]}
          castShadow
        >
          <sphereGeometry args={[0.068, 20, 16, 0, Math.PI]} />
          <meshPhysicalMaterial
            color="#60a5fa"
            metalness={0.9}
            roughness={0.22}
            clearcoat={0.7}
            clearcoatRoughness={0.25}
          />
        </mesh>

        {/* Mechanical motion arrow (green) — bar + arrowhead, only in motion */}
        {showMechArrows && (
          <group position={[rackLen / 2 + 0.30, 0.18, 0]}>
            <mesh>
              <boxGeometry args={[0.36, 0.024, 0.024]} />
              <meshBasicMaterial ref={arrowBarMat} color="#22c55e" transparent opacity={0} />
            </mesh>
            <mesh position={[0.22, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.05, 0.11, 14]} />
              <meshBasicMaterial ref={arrowMat} color="#22c55e" transparent opacity={0} />
            </mesh>
          </group>
        )}
      </group>

      {/* Gear↔rack contact-region highlight (does NOT move with the rack —
          the contact point is fixed in world space at the gear tangent) */}
      <mesh position={[-rackLen / 2, 0, -0.06]} renderOrder={2}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial
          ref={contactMat}
          color="#fde047"
          transparent
          opacity={0.25}
          depthWrite={false}
        />
      </mesh>

      {/* Labels */}
      <Label position={[-rackLen / 2 + 0.02, 0.20, -0.10]} visible={showLabels} variant="motion">
        Rack teeth engage gear
      </Label>
      <Label position={[rackLen / 2 + 0.40, -0.16, 0]} visible={showLabels}>
        Sliding bolt retracts
      </Label>
    </group>
  );
}
