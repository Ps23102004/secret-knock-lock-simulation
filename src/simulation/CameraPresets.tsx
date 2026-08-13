import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export type CameraPresetName = "full" | "mech" | "elec" | "top" | "door";

const PRESETS: Record<
  CameraPresetName,
  { pos: [number, number, number]; target: [number, number, number]; fov?: number }
> = {
  full: { pos: [3.5, 2.4, 4.8], target: [0, 0.6, 0], fov: 42 },
  mech: { pos: [1.2, 0.55, 1.6], target: [0.25, 0.25, 0], fov: 35 },
  elec: { pos: [0.6, 1.6, 2.2], target: [-0.2, 1.0, 0], fov: 38 },
  top:  { pos: [0.2, 2.2, 0.4], target: [0.2, 0.25, 0], fov: 40 },
  door: { pos: [4.6, 1.0, 3.2], target: [0.8, 0.6, 0], fov: 40 },
};

export function CameraPresets({ preset }: { preset: CameraPresetName }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3());

  useEffect(() => {
    const p = PRESETS[preset];
    const startPos = camera.position.clone();
    const endPos = new THREE.Vector3(...p.pos);
    target.current.set(...p.target);
    if ("fov" in p && p.fov && (camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
      (camera as THREE.PerspectiveCamera).fov = p.fov;
      (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
    }
    let raf = 0;
    const t0 = performance.now();
    const dur = 700;
    const step = () => {
      const k = Math.min(1, (performance.now() - t0) / dur);
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      camera.position.lerpVectors(startPos, endPos, e);
      camera.lookAt(target.current);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    step();
    return () => cancelAnimationFrame(raf);
  }, [preset, camera]);

  return null;
}
