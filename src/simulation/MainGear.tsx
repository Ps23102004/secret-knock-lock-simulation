import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Label } from "./Labels";
import { AnimState } from "./AnimationController";

/**
 * Main drive gear — brass colored, rotates around the SAME vertical axis as
 * the motor shaft (x = -0.05, z = 0.16). Sits on the housing floor.
 *
 * Gear params:
 *   teeth = 18, module ≈ 0.022, base radius = 0.20
 *   addendum = 0.025
 *   gear height = 0.06
 *   center y = 0.27 (so top is at 0.30, where shaft meets it)
 */
export default function MainGear({
  anim,
  showLabels,
  showMechArrows,
}: {
  anim: AnimState;
  showLabels: boolean;
  showMechArrows: boolean;
}) {
  const cx = -0.05;
  const cy = 0.27;
  const cz = 0.16;

  const teeth = 18;
  const baseR = 0.20;
  const tipR = 0.225;
  const gearH = 0.06;

  // Build gear tooth geometry by extruding a star-like shape
  const gearGeom = useMemo(() => {
    const shape = new THREE.Shape();
    const pts: THREE.Vector2[] = [];
    const segPerTooth = 4;
    const total = teeth * segPerTooth;
    for (let i = 0; i <= total; i++) {
      const phase = (i % segPerTooth) / segPerTooth;
      // Trapezoidal tooth profile: 0..0.25 rise, 0.25..0.5 flat top,
      // 0.5..0.75 fall, 0.75..1 flat root
      let r: number;
      if (phase < 0.18) r = baseR + ((phase / 0.18) * (tipR - baseR));
      else if (phase < 0.42) r = tipR;
      else if (phase < 0.60) r = tipR - (((phase - 0.42) / 0.18) * (tipR - baseR));
      else r = baseR;
      const a = (i / total) * Math.PI * 2;
      pts.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r));
    }
    shape.setFromPoints(pts);

    // central hole
    const hole = new THREE.Path();
    hole.absellipse(0, 0, 0.045, 0.045, 0, Math.PI * 2, false, 0);
    shape.holes.push(hole);

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: gearH,
      bevelEnabled: true,
      bevelThickness: 0.004,
      bevelSize: 0.004,
      bevelSegments: 2,
      curveSegments: 4,
    });
    geo.translate(0, 0, -gearH / 2);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, []);

  // Curved arrow ring above gear showing rotation
  const arrowRing = useMemo(() => new THREE.RingGeometry(0.27, 0.30, 32, 1, 0, Math.PI * 1.4), []);

  const gearGroup = useRef<THREE.Group>(null);
  const arrowGrp = useRef<THREE.Group>(null);
  useFrame(() => {
    if (gearGroup.current) gearGroup.current.rotation.y = anim.gearRotation;
    if (arrowGrp.current) arrowGrp.current.rotation.y = anim.pulse * Math.PI * 2;
  });

  return (
    <group position={[cx, cy, cz]}>
      <group ref={gearGroup}>
        <mesh castShadow receiveShadow>
          <primitive attach="geometry" object={gearGeom} />
          <meshPhysicalMaterial
            color="#d99c2b"
            metalness={0.98}
            roughness={0.28}
            clearcoat={0.5}
            clearcoatRoughness={0.35}
            emissive="#3a2300"
            emissiveIntensity={0.06}
          />
        </mesh>

        {/* Hub — slightly darker brass with brushed feel */}
        <mesh position={[0, 0.005, 0]} castShadow>
          <cylinderGeometry args={[0.048, 0.048, gearH + 0.04, 28]} />
          <meshPhysicalMaterial
            color="#a8761e"
            metalness={0.96}
            roughness={0.42}
            clearcoat={0.3}
          />
        </mesh>

        {/* Hub center bolt detail */}
        <mesh position={[0, gearH / 2 + 0.025, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 0.012, 12]} />
          <meshStandardMaterial color="#5a4218" metalness={0.92} roughness={0.4} />
        </mesh>

        {/* Tooth-tip marker so rotation is unmistakable */}
        <mesh position={[tipR + 0.005, 0, 0]} castShadow>
          <boxGeometry args={[0.018, 0.04, 0.018]} />
          <meshStandardMaterial
            color="#fb923c"
            emissive="#fb923c"
            emissiveIntensity={0.6}
          />
        </mesh>
      </group>

      {/* Curved rotation arrow ring (separate, animates independently) */}
      {showMechArrows && (
        <group ref={arrowGrp} position={[0, gearH / 2 + 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh>
            <primitive attach="geometry" object={arrowRing} />
            <meshBasicMaterial color="#fbbf24" transparent opacity={0.7} side={THREE.DoubleSide} />
          </mesh>
          {/* Arrow head triangle at end of ring */}
          <mesh
            position={[0.285 * Math.cos(Math.PI * 1.4), 0.285 * Math.sin(Math.PI * 1.4), 0]}
            rotation={[0, 0, Math.PI * 1.4 + Math.PI / 2]}
          >
            <coneGeometry args={[0.035, 0.07, 3]} />
            <meshBasicMaterial color="#fbbf24" transparent opacity={0.85} />
          </mesh>
        </group>
      )}

      <Label position={[0, gearH + 0.09, 0]} visible={showLabels}>
        Main Gear (Rotates)
      </Label>
    </group>
  );
}
