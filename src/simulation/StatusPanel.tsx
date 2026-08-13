import { SequenceState } from "./AnimationController";

const STEPS = [
  "1. Knock Detected",
  "2. Pattern Validated",
  "3. Power Activated",
  "4. Motor Rotates",
  "5. Gear Rotates",
  "6. Bolt Retracts",
  "7. Unlocked",
];

const UNLOCKED_STATES: SequenceState[] = ["unlocked", "relock_requested"];

export default function StatusPanel({
  stateName,
  stepIndex,
}: {
  stateName: SequenceState;
  stepIndex: number;
}) {
  const isUnlocked = UNLOCKED_STATES.includes(stateName);
  return (
    <div className="status-panel">
      <h3>System Flow</h3>
      {STEPS.map((s, i) => {
        const idx = i + 1;
        const cls =
          idx === stepIndex ? "flow-step active" : idx < stepIndex ? "flow-step done" : "flow-step";
        return (
          <div key={s} className={cls}>
            <span className="dot" />
            <span>{s}</span>
          </div>
        );
      })}
      <div className={`lock-state ${isUnlocked ? "unlocked" : "locked"}`}>
        {isUnlocked ? "● UNLOCKED" : "● LOCKED"}
      </div>
      <div style={{ marginTop: 8, fontSize: 11, color: "#6f7d92", textAlign: "center" }}>
        State: <code>{stateName}</code>
      </div>
    </div>
  );
}
