import { Html } from "@react-three/drei";
import { ReactNode } from "react";

export function Label({
  position,
  children,
  visible = true,
  variant,
  offset,
}: {
  position: [number, number, number];
  children: ReactNode;
  visible?: boolean;
  variant?: "signal" | "power" | "motion";
  offset?: [number, number];
}) {
  if (!visible) return null;
  const cls = `label-floating${variant ? " " + variant : ""}`;
  return (
    <Html
      position={position}
      center
      distanceFactor={6}
      style={{ pointerEvents: "none", transform: offset ? `translate(${offset[0]}px,${offset[1]}px)` : undefined }}
      occlude={false}
    >
      <div className={cls}>{children}</div>
    </Html>
  );
}
