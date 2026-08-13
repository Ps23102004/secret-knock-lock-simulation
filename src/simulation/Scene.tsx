import { Label } from "./Labels";
import { AnimState } from "./AnimationController";
import Door from "./Door";
import LockHousing from "./LockHousing";
import ArduinoUno from "./ArduinoUno";
import KnockSensor from "./KnockSensor";
import BatteryPack from "./BatteryPack";
import MotorDriver from "./MotorDriver";
import DCMotor from "./DCMotor";
import VerticalShaft from "./VerticalShaft";
import MainGear from "./MainGear";
import RackBolt from "./RackBolt";
import Wires from "./Wires";
import FlowArrows from "./FlowArrows";

interface Props {
  anim: AnimState;
  showLabels: boolean;
  showCutaway: boolean;
  showElectrical: boolean;
  showMechArrows: boolean;
}

export default function Scene({
  anim,
  showLabels,
  showCutaway,
  showElectrical,
  showMechArrows,
}: Props) {
  return (
    <group>
      <Door />

      <LockHousing showCutaway={showCutaway} showLabels={showLabels} />

      <ArduinoUno anim={anim} showLabels={showLabels} />
      <BatteryPack anim={anim} showLabels={showLabels} />
      <MotorDriver anim={anim} showLabels={showLabels} />
      <KnockSensor anim={anim} showLabels={showLabels} showElectrical={showElectrical} />

      <DCMotor anim={anim} showLabels={showLabels} showMechArrows={showMechArrows} />
      <VerticalShaft anim={anim} showLabels={showLabels} />
      <MainGear anim={anim} showLabels={showLabels} showMechArrows={showMechArrows} />
      <RackBolt anim={anim} showLabels={showLabels} showMechArrows={showMechArrows} />

      <StrikePlate anim={anim} showLabels={showLabels} />

      <Wires anim={anim} />
      <FlowArrows anim={anim} visible={showElectrical} />
    </group>
  );
}

function StrikePlate({ anim, showLabels }: { anim: AnimState; showLabels: boolean }) {
  // Strike plate is a U-shaped bracket. Back plate sits on the door frame at
  // z ≈ 0.05; the bracket projects forward in +Z to z = 0.48 so its slot
  // receives the bolt that travels along x at z = 0.43, y = 0.27.
  // Slot center aligned to (y=0.27, z=0.43).
  const SLOT_Z_CENTER = 0.43;
  const ARM_Z_CENTER = (0.05 + 0.48) / 2; // 0.265
  const ARM_Z_LEN = 0.48 - 0.05;          // 0.43
  const FRONT_FACE_Z = 0.48;
  return (
    <group position={[1.50, 0.27, 0]}>
      {/* Back plate (against the door frame) */}
      <mesh position={[0, 0, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[0.12, 0.42, 0.06]} />
        <meshPhysicalMaterial
          color="#b8bfc9"
          metalness={0.95}
          roughness={0.28}
          clearcoat={0.4}
          clearcoatRoughness={0.35}
        />
      </mesh>

      {/* Top arm of the U — projects forward in +Z, just above slot */}
      <mesh position={[0.05, 0.115, ARM_Z_CENTER]} castShadow>
        <boxGeometry args={[0.20, 0.05, ARM_Z_LEN]} />
        <meshPhysicalMaterial
          color="#b8bfc9"
          metalness={0.95}
          roughness={0.28}
          clearcoat={0.4}
          clearcoatRoughness={0.35}
        />
      </mesh>
      {/* Bottom arm of the U */}
      <mesh position={[0.05, -0.115, ARM_Z_CENTER]} castShadow>
        <boxGeometry args={[0.20, 0.05, ARM_Z_LEN]} />
        <meshPhysicalMaterial
          color="#b8bfc9"
          metalness={0.95}
          roughness={0.28}
          clearcoat={0.4}
          clearcoatRoughness={0.35}
        />
      </mesh>
      {/* Front face top — above slot opening */}
      <mesh position={[0.05, 0.13, FRONT_FACE_Z]} castShadow>
        <boxGeometry args={[0.20, 0.16, 0.05]} />
        <meshPhysicalMaterial
          color="#b8bfc9"
          metalness={0.95}
          roughness={0.28}
          clearcoat={0.4}
          clearcoatRoughness={0.35}
        />
      </mesh>
      {/* Front face bottom — below slot opening */}
      <mesh position={[0.05, -0.13, FRONT_FACE_Z]} castShadow>
        <boxGeometry args={[0.20, 0.16, 0.05]} />
        <meshPhysicalMaterial
          color="#b8bfc9"
          metalness={0.95}
          roughness={0.28}
          clearcoat={0.4}
          clearcoatRoughness={0.35}
        />
      </mesh>
      {/* Dark slot interior — aligned with the bolt at y=0, z=0.37 */}
      <mesh position={[0.05, 0, SLOT_Z_CENTER]}>
        <boxGeometry args={[0.21, 0.16, 0.13]} />
        <meshStandardMaterial color="#06080b" roughness={0.95} />
      </mesh>

      {/* Mounting screws on the back plate */}
      {[0.16, -0.16].map((dy, i) => (
        <mesh key={i} position={[0, dy, 0.085]}>
          <cylinderGeometry args={[0.018, 0.018, 0.012, 12]} />
          <meshStandardMaterial color="#cfd2d8" metalness={0.95} roughness={0.3} />
        </mesh>
      ))}

      {/* State indicator on top arm */}
      <mesh position={[0.10, 0.145, ARM_Z_CENTER + 0.10]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.022, 0.022, 0.008, 16]} />
        <meshStandardMaterial
          color={anim.unlockProgress > 0.95 ? "#22c55e" : "#ef4444"}
          emissive={anim.unlockProgress > 0.95 ? "#22c55e" : "#ef4444"}
          emissiveIntensity={1.4}
        />
      </mesh>

      <Label position={[0.20, 0.30, 0.30]} visible={showLabels}>
        Strike Plate
      </Label>
    </group>
  );
}
