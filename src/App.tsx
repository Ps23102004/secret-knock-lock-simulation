import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import Scene from "./simulation/Scene";
import StatusPanel from "./simulation/StatusPanel";
import ReferenceImagePanel from "./simulation/ReferenceImagePanel";
import MicKnockDetector from "./simulation/MicKnockDetector";
import { CameraPresets, CameraPresetName } from "./simulation/CameraPresets";
import {
  AnimationController,
  SequenceState,
  AnimationCommand,
} from "./simulation/AnimationController";

export default function App() {
  const [stateName, setStateName] = useState<SequenceState>("locked_idle");
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [showLabels, setShowLabels] = useState(true);
  const [showCutaway, setShowCutaway] = useState(true);
  const [showElectrical, setShowElectrical] = useState(true);
  const [showMechArrows, setShowMechArrows] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [camera, setCamera] = useState<CameraPresetName>("full");
  const [refOpen, setRefOpen] = useState(true);
  const cmdRef = useRef<(c: AnimationCommand) => void>(() => {});

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        cmdRef.current({ type: "play_unlock" });
      } else if (e.key === "r") cmdRef.current({ type: "play_relock" });
      else if (e.key === "0") cmdRef.current({ type: "reset" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="app">
      <div className="canvas-wrap">
        <Canvas
          shadows
          camera={{ position: [3.5, 2.4, 4.8], fov: 42 }}
          gl={{ antialias: true }}
        >
          <color attach="background" args={["#0b0d12"]} />
          <fog attach="fog" args={["#0b0d12", 8, 22]} />

          <ambientLight intensity={0.45} />
          <directionalLight
            position={[6, 8, 5]}
            intensity={1.15}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <directionalLight position={[-5, 4, -3]} intensity={0.5} color="#bcd0ff" />
          <pointLight position={[0, 1.2, 1.6]} intensity={0.7} color="#ffd28a" />
          {/* Subtle env map for clearcoat/metalness reflections */}
          <Environment preset="city" background={false} environmentIntensity={0.45} />

          <AnimationController
            speed={speed}
            onState={setStateName}
            onStep={setStepIndex}
            registerCommand={(fn) => (cmdRef.current = fn)}
          >
            {(anim) => (
              <Scene
                anim={anim}
                showLabels={showLabels}
                showCutaway={showCutaway}
                showElectrical={showElectrical}
                showMechArrows={showMechArrows}
              />
            )}
          </AnimationController>

          <CameraPresets preset={camera} />

          <OrbitControls
            enablePan
            enableZoom
            enableRotate
            target={[0, 0.6, 0]}
            minDistance={1.5}
            maxDistance={14}
          />
        </Canvas>
      </div>

      {/* HUD controls */}
      <div className="hud">
        <h1>ENGR 198</h1>
        <h2>Secret Knock Door Lock</h2>

        <div className="section">
          <div className="section-title">Sequence</div>
          <button className="primary" onClick={() => cmdRef.current({ type: "play_unlock" })}>
            ▶ Play Unlock Sequence
          </button>
          <button className="secondary" onClick={() => cmdRef.current({ type: "play_relock" })}>
            ⟲ Play Relock Sequence
          </button>
          <button onClick={() => cmdRef.current({ type: "reset" })}>↺ Reset</button>
          <button onClick={() => cmdRef.current({ type: "step" })}>⤳ Step Forward</button>
          <div className="speed-row">
            <span>Speed</span>
            <input
              type="range"
              min={0.25}
              max={2.5}
              step={0.05}
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
            />
            <span>{speed.toFixed(2)}×</span>
          </div>
        </div>

        <div className="section">
          <div className="section-title">Camera</div>
          {(
            [
              ["full", "Full Assembly"],
              ["mech", "Mechanical Close-Up"],
              ["elec", "Electrical System"],
              ["top", "Gear Top View"],
              ["door", "Door / Lock State"],
            ] as [CameraPresetName, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              className={camera === key ? "active" : ""}
              onClick={() => setCamera(key)}
            >
              📷 {label}
            </button>
          ))}
        </div>

        <div className="section">
          <div className="section-title">Display</div>
          <label className="toggle-row">
            <span>Labels</span>
            <input type="checkbox" checked={showLabels} onChange={(e) => setShowLabels(e.target.checked)} />
          </label>
          <label className="toggle-row">
            <span>Cutaway housing</span>
            <input type="checkbox" checked={showCutaway} onChange={(e) => setShowCutaway(e.target.checked)} />
          </label>
          <label className="toggle-row">
            <span>Electrical flow</span>
            <input type="checkbox" checked={showElectrical} onChange={(e) => setShowElectrical(e.target.checked)} />
          </label>
          <label className="toggle-row">
            <span>Mechanical arrows</span>
            <input type="checkbox" checked={showMechArrows} onChange={(e) => setShowMechArrows(e.target.checked)} />
          </label>
          <label className="toggle-row">
            <span>Reference image</span>
            <input type="checkbox" checked={refOpen} onChange={(e) => setRefOpen(e.target.checked)} />
          </label>
        </div>
      </div>

      <StatusPanel stateName={stateName} stepIndex={stepIndex} />

      <MicKnockDetector fireCommand={(c) => cmdRef.current(c)} />

      <div className="legend-panel">
        <h4>Electrical / Motion Flow</h4>
        <div className="legend-row">
          <span className="legend-swatch" style={{ background: "#3b82f6" }} />
          Signal Flow (blue)
        </div>
        <div className="legend-row">
          <span className="legend-swatch" style={{ background: "#f59e0b" }} />
          Power Flow (yellow)
        </div>
        <div className="legend-row">
          <span className="legend-swatch" style={{ background: "#22c55e" }} />
          Physical Motion (green)
        </div>
        <div className="legend-row">
          <span className="legend-swatch" style={{ background: "#1f2937" }} />
          Ground (black)
        </div>
      </div>

      <ReferenceImagePanel open={refOpen} onToggle={() => setRefOpen((o) => !o)} />
    </div>
  );
}
