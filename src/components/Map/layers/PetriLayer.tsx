import { useMemo } from "react";
import Nutrient from "../../Food/Nutrient";

interface PetriLayerProps {
  width: number;
  height: number;
  count?: number;
}

export default function PetriLayer({
  width,
  height,
  count = 20,
}: PetriLayerProps) {
  // Generate random positions once
  const nutrients = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: Math.random() * (width - 16),
        y: Math.random() * (height - 16),
      })),
    [width, height, count]
  );

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
        pointerEvents: "none",
      }}
    >
      {/* Petri dish border */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: Math.min(width, height) - 20,
          height: Math.min(width, height) - 20,
          border: "2px solid rgba(255, 255, 255, 0.27)",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Nutrients */}
      {nutrients.map((pos, i) => (
        <Nutrient key={i} x={pos.x} y={pos.y} />
      ))}
    </div>
  );
}
