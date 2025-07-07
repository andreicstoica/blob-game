import { useMemo } from "react";
import People from "../../Food/People";

interface EarthLayerProps {
  width: number;
  height: number;
  count?: number;
}

export default function EarthLayer({
  width,
  height,
  count = 50,
}: EarthLayerProps) {
  // Generate random positions for people
  const people = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: Math.random() * (width - 8),
        y: Math.random() * (height - 8),
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
      <img
        src="/src/assets/world-map.jpg"
        alt="World Map"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.75, // Make it more transparent
        }}
      />

      {/* People */}
      {people.map((pos, i) => (
        <People key={i} x={pos.x} y={pos.y} />
      ))}
    </div>
  );
}
