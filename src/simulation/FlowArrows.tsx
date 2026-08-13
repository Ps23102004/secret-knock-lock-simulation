import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { AnimState } from "./AnimationController";

interface ArrowSeg {
  pts: [number, number, number][];
  color: "signal" | "power" | "motion";
  visible: (a: AnimState) => boolean;
}

const COLOR_MAP: Record<ArrowSeg["color"], string> = {
  signal: "#3b82f6",
  power: "#f59e0b",
  motion: "#22c55e",
};

/**
 * Animated curved arrows with arrowheads + travelling dots.
 *   blue   = signal route (sensor → arduino → driver)
 *   yellow = power route (battery → driver → motor)
 *   green  = mechanical motion route (gear → bolt)
 *
 * The static curve is always faintly visible to convey topology even on a
 * still frame; when the corresponding flow becomes active the curve and dots
 * brighten and the arrowhead glows.
 */
export default function FlowArrows({
  anim,
  visible,
}: {
  anim: AnimState;
  visible: boolean;
}) {
  const arrows: ArrowSeg[] = useMemo(
    () => [
      // SIGNAL — knock sensor → arduino body
      {
        pts: [
          [-1.5, 1.20, 0.20],
          [-1.25, 1.40, 0.30],
          [-1.0, 1.55, 0.32],
          [-0.78, 1.58, 0.28],
        ],
        color: "signal",
        visible: (a) => a.signalActive || a.knockActive,
      },
      // SIGNAL — arduino → motor driver
      {
        pts: [
          [-0.45, 1.58, 0.30],
          [-0.20, 1.62, 0.36],
          [0.05, 1.55, 0.40],
        ],
        color: "signal",
        visible: (a) => a.signalActive,
      },
      // POWER — battery → motor driver
      {
        pts: [
          [0.55, 1.55, 0.40],
          [0.30, 1.55, 0.40],
          [0.10, 1.52, 0.40],
        ],
        color: "power",
        visible: (a) => a.powerActive,
      },
      // POWER — motor driver → motor body (curves down and slightly left)
      {
        pts: [
          [0.05, 1.36, 0.40],
          [0.05, 1.30, 0.36],
          [-0.02, 1.22, 0.30],
          [-0.05, 1.18, 0.20],
        ],
        color: "power",
        visible: (a) => a.powerActive,
      },
      // MOTION — along the bolt direction (gear → bolt)
      {
        pts: [
          [0.18, 0.43, 0.50],
          [0.55, 0.43, 0.50],
          [0.95, 0.43, 0.50],
          [1.35, 0.43, 0.50],
        ],
        color: "motion",
        visible: (a) => a.motionActive,
      },
    ],
    []
  );

  if (!visible) return null;

  return (
    <group>
      {arrows.map((seg, i) => (
        <FlowArrow key={i} seg={seg} anim={anim} />
      ))}
    </group>
  );
}

function FlowArrow({ seg, anim }: { seg: ArrowSeg; anim: AnimState }) {
  const isVisible = seg.visible(anim);
  const dotsCount = 5;
  const dotsRefs = useRef<(THREE.Mesh | null)[]>([]);
  const tubeMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const headMatRef = useRef<THREE.MeshBasicMaterial>(null);

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        seg.pts.map((p) => new THREE.Vector3(...p)),
        false,
        "catmullrom",
        0.5
      ),
    [seg]
  );

  // Static arrow tube (slightly thicker for readability)
  const tubeGeo = useMemo(() => new THREE.TubeGeometry(curve, 48, 0.0085, 8, false), [curve]);

  // Arrowhead at the curve's endpoint, pointing along the local tangent
  const head = useMemo(() => {
    const end = curve.getPointAt(1);
    const tangent = curve.getTangentAt(1).normalize();
    const orientation = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      tangent
    );
    return { pos: end, quat: orientation };
  }, [curve]);

  useFrame(() => {
    const baseOpacity = isVisible ? 0.7 : 0.18;
    const headOpacity = isVisible ? 1.0 : 0.25;
    if (tubeMatRef.current) tubeMatRef.current.opacity = baseOpacity;
    if (headMatRef.current) headMatRef.current.opacity = headOpacity;

    if (!isVisible) {
      dotsRefs.current.forEach((m) => {
        if (m) (m.material as THREE.MeshBasicMaterial).opacity = 0;
      });
      return;
    }
    const t = anim.pulse;
    dotsRefs.current.forEach((m, i) => {
      if (!m) return;
      const local = (t + i / dotsCount) % 1;
      const pos = curve.getPointAt(local);
      m.position.copy(pos);
      const fade = Math.sin(local * Math.PI);
      (m.material as THREE.MeshBasicMaterial).opacity = 0.95 * fade;
    });
  });

  return (
    <group>
      {/* Static curved path (visible always, brighter when active) */}
      <mesh geometry={tubeGeo}>
        <meshBasicMaterial
          ref={tubeMatRef}
          color={COLOR_MAP[seg.color]}
          transparent
          opacity={0.18}
        />
      </mesh>
      {/* Arrowhead at the end */}
      <mesh position={head.pos} quaternion={head.quat}>
        <coneGeometry args={[0.045, 0.10, 14]} />
        <meshBasicMaterial
          ref={headMatRef}
          color={COLOR_MAP[seg.color]}
          transparent
          opacity={0.25}
        />
      </mesh>
      {/* Travelling dots */}
      {Array.from({ length: dotsCount }).map((_, i) => (
        <mesh key={i} ref={(el) => (dotsRefs.current[i] = el)}>
          <sphereGeometry args={[0.022, 12, 12]} />
          <meshBasicMaterial color={COLOR_MAP[seg.color]} transparent opacity={0} />
        </mesh>
      ))}
    </group>
  );
}
