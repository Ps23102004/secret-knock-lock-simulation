import { Label } from "./Labels";
import { AnimState } from "./AnimationController";

/**
 * Battery pack — top-right of housing.
 * Two horizontal silver/gray cylindrical cells (18650-style) sitting in a
 * black holder. Matches the reference image which shows large silver cells.
 */
export default function BatteryPack({
  anim,
  showLabels,
}: {
  anim: AnimState;
  showLabels: boolean;
}) {
  const glow = anim.powerActive ? 1.0 : 0;
  const cellLen = 0.62;
  const cellR = 0.085;

  return (
    <group position={[0.7, 1.46, 0.18]}>
      {/* Holder body — open on top so cells are visible */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[cellLen + 0.08, 0.42, 0.22]} />
        <meshStandardMaterial color="#0e1116" roughness={0.85} metalness={0.15} />
      </mesh>

      {/* Two silver cells, oriented along X (horizontal) */}
      {[-0.1, 0.1].map((dy, i) => (
        <group key={i} position={[0, dy, 0.04]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[cellR, cellR, cellLen, 28]} />
            <meshStandardMaterial color="#c8ccd2" metalness={0.9} roughness={0.32} />
          </mesh>
          {/* Black insulator wrap stripe near the - end */}
          <mesh position={[-cellLen / 2 + 0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[cellR + 0.001, cellR + 0.001, 0.06, 28]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
          </mesh>
          {/* Positive terminal cap (silver dome) */}
          <mesh position={[cellLen / 2 + 0.005, 0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
            <cylinderGeometry args={[cellR * 0.4, cellR * 0.4, 0.012, 18]} />
            <meshStandardMaterial color="#e6e8ec" metalness={0.95} roughness={0.2} />
          </mesh>
          {/* Negative end (flat) */}
          <mesh position={[-cellLen / 2 - 0.003, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[cellR * 0.92, cellR * 0.92, 0.006, 18]} />
            <meshStandardMaterial color="#9aa0a8" metalness={0.85} roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Spring contacts (visible at -X end of holder) */}
      {[-0.1, 0.1].map((dy, i) => (
        <mesh key={`s${i}`} position={[-cellLen / 2 - 0.04, dy, 0.04]}>
          <torusGeometry args={[0.018, 0.005, 6, 12]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.95} roughness={0.3} />
        </mesh>
      ))}

      {/* Power LED glows yellow when activated */}
      <mesh position={[cellLen / 2 + 0.02, -0.18, 0.07]}>
        <cylinderGeometry args={[0.014, 0.014, 0.012, 12]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={glow * 1.4}
        />
      </mesh>

      <Label position={[0, 0.28, 0.16]} visible={showLabels}>
        Battery Pack
      </Label>
      <Label
        position={[0, 0.45, 0.16]}
        visible={showLabels && anim.powerActive}
        variant="power"
      >
        3. Power Activated
      </Label>
    </group>
  );
}
