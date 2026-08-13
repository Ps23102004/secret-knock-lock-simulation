import { Label } from "./Labels";
import { AnimState } from "./AnimationController";

/**
 * Arduino UNO mounted in top-left of the housing cavity.
 * Position chosen to match reference image.
 */
export default function ArduinoUno({
  anim,
  showLabels,
}: {
  anim: AnimState;
  showLabels: boolean;
}) {
  // LED blinks on signal and pattern_validated
  const blink = (anim.signalActive ? Math.sin(anim.pulse * Math.PI * 8) * 0.5 + 0.5 : 0) > 0.4;

  return (
    <group position={[-0.78, 1.46, 0.16]}>
      {/* PCB */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.65, 0.42, 0.04]} />
        <meshStandardMaterial color="#0a6b3a" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Solder mask outline */}
      <mesh position={[0, 0, 0.021]}>
        <boxGeometry args={[0.62, 0.39, 0.002]} />
        <meshStandardMaterial color="#0d8a4a" roughness={0.5} />
      </mesh>

      {/* USB port */}
      <mesh position={[-0.34, 0.13, 0.05]} castShadow>
        <boxGeometry args={[0.1, 0.09, 0.07]} />
        <meshStandardMaterial color="#a6adb7" metalness={0.95} roughness={0.25} />
      </mesh>

      {/* Power jack */}
      <mesh position={[-0.34, -0.08, 0.05]} castShadow>
        <boxGeometry args={[0.09, 0.09, 0.06]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* ATmega chip (square in middle) */}
      <mesh position={[0.05, -0.02, 0.03]}>
        <boxGeometry args={[0.13, 0.13, 0.018]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.5} />
      </mesh>

      {/* Pin headers along top and bottom */}
      <mesh position={[0.08, 0.18, 0.03]}>
        <boxGeometry args={[0.36, 0.04, 0.02]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.08, -0.18, 0.03]}>
        <boxGeometry args={[0.36, 0.04, 0.02]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Power LED (always green when housing has power) */}
      <mesh position={[-0.18, 0.08, 0.026]}>
        <cylinderGeometry args={[0.015, 0.015, 0.01, 12]} />
        <meshStandardMaterial
          color="#22c55e"
          emissive="#22c55e"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Built-in LED on pin 13 — blinks during signal/validation */}
      <mesh position={[-0.05, 0.08, 0.026]}>
        <cylinderGeometry args={[0.015, 0.015, 0.01, 12]} />
        <meshStandardMaterial
          color="#fde047"
          emissive="#fde047"
          emissiveIntensity={blink ? 1.4 : 0.05}
        />
      </mesh>

      {/* Reset button */}
      <mesh position={[-0.22, -0.12, 0.028]}>
        <boxGeometry args={[0.04, 0.04, 0.015]} />
        <meshStandardMaterial color="#3b3f47" />
      </mesh>

      <Label position={[0, 0.28, 0.05]} visible={showLabels}>
        Arduino UNO
      </Label>
    </group>
  );
}
